from fastapi import APIRouter

from app.api.routes.analysis import router as analysis_router
from app.api.routes.documents import router as documents_router
from app.api.routes.health import router as health_router
from app.api.routes.reports import router as reports_router

api_router = APIRouter()
api_router.include_router(analysis_router, tags=["analysis"])
api_router.include_router(documents_router, tags=["documents"])
api_router.include_router(health_router, tags=["system"])
api_router.include_router(reports_router, tags=["reports"])
