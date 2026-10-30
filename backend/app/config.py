from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/onlinevehiclerental_db"
    secret_key: str = "local-development-secret-change-me"
    access_token_expire_minutes: int = 1440
    frontend_origin: str = "http://localhost:5173"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
