from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_PROJECT_ROOT = Path(__file__).resolve().parents[4]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(_PROJECT_ROOT / ".env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: Literal["development", "test", "staging", "production"] = "development"
    app_name: str = "SARA-PRAGYA API"
    app_version: str = "0.1.0"
    log_level: str = "INFO"
    cors_origins: list[str] | str = Field(default_factory=lambda: ["http://localhost:3000"])
    ai_provider: Literal["disabled", "gemini"] = "disabled"
    gemini_api_key: SecretStr | None = None
    gemini_model: str = "gemini-3.5-flash-lite"

    @model_validator(mode="after")
    def validate_environment_safety(self) -> "Settings":
        if isinstance(self.cors_origins, str):
            self.cors_origins = [
                origin.strip() for origin in self.cors_origins.split(",") if origin.strip()
            ]
        if self.app_env == "production" and "*" in self.cors_origins:
            raise ValueError("Wildcard CORS is not permitted in production")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
