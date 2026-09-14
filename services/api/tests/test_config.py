import pytest
from pydantic import ValidationError

from app.core.config import Settings


def test_development_has_safe_local_defaults() -> None:
    settings = Settings(_env_file=None)

    assert settings.app_env == "test"
    assert settings.cors_origins == ["http://localhost:3000"]


def test_production_supports_stateless_configuration() -> None:
    settings = Settings(
        app_env="production", cors_origins="https://sarapragya.example", _env_file=None
    )

    assert settings.cors_origins == ["https://sarapragya.example"]


def test_production_rejects_wildcard_cors() -> None:
    with pytest.raises(ValidationError, match="Wildcard CORS"):
        Settings(
            app_env="production",
            cors_origins="*",
            _env_file=None,
        )
