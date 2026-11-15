import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app import models

# Use a separate SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    
    # 🟢 FIX: Close all database connections so Windows can delete the file
    engine.dispose()
    
    if os.path.exists("./test.db"):
        os.remove("./test.db")
    
    uploads_dir = "uploads"
    if os.path.exists(uploads_dir):
        for f in os.listdir(uploads_dir):
            if f.startswith("test_"):
                os.remove(os.path.join(uploads_dir, f))

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_create_candidate():
    with open("test_image.jpg", "wb") as f:
        f.write(b"fake image data")

    with open("test_image.jpg", "rb") as f:
        response = client.post(
            "/candidates/",
            data={"first_name": "Test", "last_name": "User", "email": "test@example.com", "phone": "1234567890", "skills": "Python, FastAPI"},
            files={"picture": ("test_image.jpg", f, "image/jpeg")}
        )
    
    os.remove("test_image.jpg")
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "Test"
    assert data["email"] == "test@example.com"
    assert len(data["skills"]) == 2

def test_duplicate_email():
    with open("test_image.jpg", "wb") as f:
        f.write(b"fake image data")

    with open("test_image.jpg", "rb") as f:
        client.post(
            "/candidates/",
            data={"first_name": "A", "last_name": "B", "email": "dup@example.com", "phone": "1", "skills": ""},
            files={"picture": ("test_image.jpg", f, "image/jpeg")}
        )

    with open("test_image.jpg", "rb") as f:
        response = client.post(
            "/candidates/",
            data={"first_name": "C", "last_name": "D", "email": "dup@example.com", "phone": "2", "skills": ""},
            files={"picture": ("test_image.jpg", f, "image/jpeg")}
        )
    
    os.remove("test_image.jpg")
    assert response.status_code == 409

def test_get_candidate_404():
    response = client.get("/candidates/9999")
    assert response.status_code == 404