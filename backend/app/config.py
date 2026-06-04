from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # MongoDB
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "swiftfolio"
    
    # OpenAI
    openai_api_key: str = ""
    
    # GitHub
    github_token: str = ""
    
    # App
    app_name: str = "SwiftFolio"
    debug: bool = True
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()

