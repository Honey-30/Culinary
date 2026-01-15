"""Configuration management for backend services"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    environment: str = "development"
    enable_ml_perception: bool = True
    ml_inference_timeout: float = 2.0
    mock_mode: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance"""
    return Settings()
