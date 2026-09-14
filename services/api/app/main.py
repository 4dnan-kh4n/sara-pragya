from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.core.errors import ApiError, api_error_handler, unhandled_error_handler
from app.core.middleware import request_context_middleware


def create_app() -> FastAPI:
    settings = get_settings()
    local_development_origin = (
        r"^http://(?:localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?$"
        if settings.app_env == "development"
        else None
    )
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Research-oriented clinical decision-support API. Not a diagnostic service.",
        docs_url="/docs" if settings.app_env != "production" else None,
        redoc_url=None,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_origin_regex=local_development_origin,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    )
    app.middleware("http")(request_context_middleware)
    app.add_exception_handler(ApiError, api_error_handler)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, unhandled_error_handler)
    app.include_router(api_router, prefix="/api/v1")

    @app.get("/", include_in_schema=False)
    def service_information() -> dict[str, str]:
        return {
            "service": settings.app_name,
            "version": settings.app_version,
            "purpose": "Research and clinical decision support; not diagnosis.",
        }

    return app


app = create_app()
