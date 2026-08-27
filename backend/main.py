from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
from app.api.job import router as job_router
from app.api.interview import router as interview_router
from app.api.dashboard import router as dashboard_router
from app.api.report import router as report_router

from app.core.config import settings

app = FastAPI(
    title="AI Interview Coach",
    version="1.0.0"
)

# environment driven cors configuration
cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(job_router)
app.include_router(interview_router)
app.include_router(dashboard_router)
app.include_router(report_router)

@app.get("/")
def root():
    return {
        "message": "This is backend for AI Interview Coach"
    }