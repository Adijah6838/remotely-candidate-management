from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import router as candidates_router

# Initialize the FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="Candidate Management System API",
    version="1.0.0",
)

# Configure CORS
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(candidates_router)


@app.get("/health", tags=["System"])
def health_check():
    """
    Simple health check endpoint to verify the API is running.
    """
    return {"status": "ok", "app_name": settings.APP_NAME}