from fastapi import FastAPI

app = FastAPI(
    title="AI Interview Coach",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "This is backend for AI Interview Coach"
    }