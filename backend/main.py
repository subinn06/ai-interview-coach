from fastapi import FastAPI
from app.api.auth import router as auth_router

app = FastAPI(
    title="AI Interview Coach",
    version="1.0.0"
)

app.include_router(
    auth_router
)

@app.get("/")
def root():
    return {
        "message": "This is backend for AI Interview Coach"
    }