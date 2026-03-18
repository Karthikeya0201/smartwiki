from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Personalized Product Wiki"
    
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    MONGO_URL: str
    DATABASE_NAME: str

    class Config:
        env_file = ".env"


settings = Settings()