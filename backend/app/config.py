from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Remotely API"
    APP_ENV: str = "development"
    DEBUG: bool = True

    # API Server
    API_HOST: str = "127.0.0.1"
    API_PORT: int = 8000

    # Database
    DATABASE_URL: str

    # File Uploads
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 5

    # Pagination
    DEFAULT_PAGE_SIZE: int = 25

    # CORS (Comma-separated string)
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Tells Pydantic to read from the .env file in the current directory
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


# Instantiate the settings so we can import it anywhere
settings = Settings()