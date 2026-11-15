from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

# Create the SQLAlchemy engine using the URL from .env
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Each instance of SessionLocal will be a database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our ORM models
Base = declarative_base()


# Dependency to get a database session for a single request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()