from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    func,
)
from sqlalchemy.orm import relationship

from app.database import Base

# Many-to-Many association table between Candidates and Skills
candidate_skills = Table(
    "candidate_skills",
    Base.metadata,
    Column(
        "candidate_id",
        Integer,
        ForeignKey("candidates.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "skill_id",
        Integer,
        ForeignKey("skills.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=False)
    picture = Column(String(255), nullable=False)  # Stores the filename
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationship to skills
    skills = relationship("Skill", secondary=candidate_skills, back_populates="candidates")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)

    # Relationship to candidates
    candidates = relationship("Candidate", secondary=candidate_skills, back_populates="skills")