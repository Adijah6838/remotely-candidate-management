import math
import os
import shutil
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from pydantic import EmailStr
from sqlalchemy.orm import Session

from app import models, schemas
from app.config import settings
from app.database import get_db

router = APIRouter(prefix="/candidates", tags=["Candidates"])

# Ensure the uploads directory exists
UPLOAD_DIR = settings.UPLOAD_DIR
os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================
# GET Endpoints
# =========================
@router.get("/", response_model=schemas.CandidateListResponse)
def get_candidates(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(25, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    """Retrieve a paginated list of candidates."""
    total = db.query(models.Candidate).count()
    total_pages = math.ceil(total / page_size) if total > 0 else 1
    offset = (page - 1) * page_size
    
    candidates = (
        db.query(models.Candidate)
        .order_by(models.Candidate.created_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return {
        "items": candidates,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


@router.get("/{candidate_id}", response_model=schemas.CandidateResponse)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    """Retrieve a single candidate by ID."""
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate


# =========================
# POST Endpoint
# =========================
@router.post("/", response_model=schemas.CandidateResponse, status_code=status.HTTP_201_CREATED)
def create_candidate(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: EmailStr = Form(...),
    phone: str = Form(...),
    skills: str = Form("", description="Comma-separated list of skills"),
    picture: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Create a new candidate with an uploaded picture and skills."""
    
    # 1. Check for duplicate email
    existing = db.query(models.Candidate).filter(models.Candidate.email == email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    # 2. Validate and save the image
    if not picture.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    file_extension = os.path.splitext(picture.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(picture.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")

    # 3. Process skills
    db_skills = []
    if skills.strip():
        skill_names = [s.strip() for s in skills.split(",") if s.strip()]
        for name in skill_names:
            skill = db.query(models.Skill).filter(models.Skill.name == name).first()
            if not skill:
                skill = models.Skill(name=name)
                db.add(skill)
                db.flush()
            db_skills.append(skill)

    # 4. Create the Candidate
    new_candidate = models.Candidate(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        picture=unique_filename,
        skills=db_skills
    )

    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    return new_candidate


# =========================
# PATCH Endpoint (Edit)
# =========================
@router.patch("/{candidate_id}", response_model=schemas.CandidateResponse)
def update_candidate(
    candidate_id: int,
    first_name: Optional[str] = Form(None),
    last_name: Optional[str] = Form(None),
    email: Optional[EmailStr] = Form(None),
    phone: Optional[str] = Form(None),
    skills: Optional[str] = Form(None, description="Comma-separated list of skills"),
    picture: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """Update an existing candidate. Only provided fields will be updated."""
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # 1. Update Email (Check for duplicates if changed)
    if email and email != candidate.email:
        existing = db.query(models.Candidate).filter(models.Candidate.email == email).first()
        if existing:
            raise HTTPException(status_code=409, detail="Email already registered")
        candidate.email = email

    # 2. Update Basic Info
    if first_name: candidate.first_name = first_name
    if last_name: candidate.last_name = last_name
    if phone: candidate.phone = phone

    # 3. Update Picture (if provided)
    if picture:
        if not picture.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
            
        # Delete old image
        old_path = os.path.join(UPLOAD_DIR, candidate.picture)
        if os.path.exists(old_path):
            try:
                os.remove(old_path)
            except Exception:
                pass # Ignore if file lock prevents deletion

        # Save new image
        file_extension = os.path.splitext(picture.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(picture.file, buffer)
        
        candidate.picture = unique_filename

    # 4. Update Skills (if provided)
    if skills is not None:
        db_skills = []
        if skills.strip():
            skill_names = [s.strip() for s in skills.split(",") if s.strip()]
            for name in skill_names:
                skill = db.query(models.Skill).filter(models.Skill.name == name).first()
                if not skill:
                    skill = models.Skill(name=name)
                    db.add(skill)
                    db.flush()
                db_skills.append(skill)
        candidate.skills = db_skills

    db.commit()
    db.refresh(candidate)
    return candidate


# =========================
# DELETE Endpoint
# =========================
@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    """Delete a candidate and their uploaded image."""
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Delete image from disk
    image_path = os.path.join(UPLOAD_DIR, candidate.picture)
    if os.path.exists(image_path):
        try:
            os.remove(image_path)
        except Exception:
            pass # Ignore if file lock prevents deletion

    # Delete from database (cascades to candidate_skills table)
    db.delete(candidate)
    db.commit()
    
    return None