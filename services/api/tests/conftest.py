import os

import pytest

from app.core.config import get_settings

os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault("AI_PROVIDER", "disabled")


@pytest.fixture(autouse=True)
def stable_test_environment(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("APP_ENV", "test")
    monkeypatch.setenv("AI_PROVIDER", "disabled")
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()
