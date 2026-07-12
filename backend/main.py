from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
from app.api.job import router as job_router
from app.api.interview import router as interview_router

app = FastAPI(
    title="AI Interview Coach",
    version="1.0.0"
)

# include routers
app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(job_router)
app.include_router(interview_router)

@app.get("/")
def root():
    return {
        "message": "This is backend for AI Interview Coach"
    }