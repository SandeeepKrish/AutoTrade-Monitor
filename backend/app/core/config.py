from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
  MONGO_URI: str = "mongodb://localhost:27017/stockdb"
  JWT_SECRET_KEY: str = "change-me"
  JWT_ALGORITHM: str = "HS256"
  ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
  REDIS_URL: str | None = None
  FRONTEND_ORIGIN: str = "http://localhost:5173"

  class Config:
    env_file = ".env"


@lru_cache
def get_settings() -> Settings:
  return Settings()


settings = get_settings()
