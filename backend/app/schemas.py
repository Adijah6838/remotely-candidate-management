from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict, EmailStr


# =========================
# Skill Schemas
# =========================
class SkillBase(BaseModel):
    name: str


class SkillResponse(SkillBase):
    id: int

    # Tells Pydantic to read data from SQLAlchemy models (ORM)
    model_config = ConfigDict(from_attributes=True)


# =========================
# Candidate Schemas
# =========================
class CandidateBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str


class CandidateResponse(CandidateBase):
    id: int
    picture: str
    created_at: datetime
    updated_at: datetime
    skills: List[SkillResponse] = []

    model_config = ConfigDict(from_attributes=True)


# =========================
# Pagination Response
# =========================
class CandidateListResponse(BaseModel):
    items: List[CandidateResponse]
    total: int
    page: int
    page_size: int
    total_pages: int