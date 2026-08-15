import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from sqlalchemy.ext.compiler import compiles
from sqlalchemy.dialects.postgresql import JSONB, UUID

@compiles(JSONB, "sqlite")
def compile_jsonb_sqlite(type_, compiler, **kw):
    return "JSON"

@compiles(UUID, "sqlite")
def compile_uuid_sqlite(type_, compiler, **kw):
    return "TEXT"

from app import models  # registers all models with base
from app.models.base import Base
from app.db.dependencies import get_db
from app.services.pdf_service import PDFService
from main import app

import json
from app.ai.client import GeminiClient

@pytest.fixture(autouse=True)
def mock_pdf_extraction(monkeypatch):
    monkeypatch.setattr(
        PDFService,
        "extract_text",
        lambda self, file_path: "Senior Fullstack Engineer with 5+ years experience in Python, FastAPI, React 19, TypeScript, and SQL database design."
    )

@pytest.fixture(autouse=True)
def mock_gemini_client(monkeypatch):
    def fake_generate_structured(self, prompt, schema):
        schema_name = getattr(schema, "__name__", str(schema))
        if "ResumeAnalysisSchema" in schema_name:
            return json.dumps({
                "ats_score": 85,
                "strengths": ["Python", "FastAPI"],
                "weaknesses": ["Docker"],
                "missing_skills": ["Kubernetes"],
                "summary": "Solid candidate."
            })
        elif "JobAnalysisSchema" in schema_name:
            return json.dumps({
                "required_skills": ["Python", "SQL"],
                "preferred_skills": ["Docker"],
                "experience_level": "Senior",
                "responsibilities": ["Develop APIs"],
                "keywords": ["Backend"],
                "summary": "Backend engineering role."
            })
        elif "GeneratedQuestionListSchema" in schema_name:
            return json.dumps({
                "questions": [
                    {
                        "question": "How do you handle async IO in Python?",
                        "category": "Python",
                        "expected_topics": ["Event loop", "Coroutines"]
                    }
                ]
            })
        elif "AnswerEvaluationSchema" in schema_name:
            return json.dumps({
                "score": 90,
                "feedback": "Great explanation.",
                "strengths": ["Clear concepts"],
                "weaknesses": [],
                "improvements": []
            })
        elif "FeedbackSchema" in schema_name:
            return json.dumps({
                "overall_score": 92,
                "technical_score": 94,
                "communication_score": 90,
                "problem_solving_score": 92,
                "confidence_score": 92,
                "strengths": ["System Design"],
                "improvement_areas": ["Performance"],
                "recommended_topics": [{"topic": "Caching", "reason": "Speed up response", "priority": "high"}],
                "summary": "Solid interview performance."
            })
        return "{}"

    monkeypatch.setattr(GeminiClient, "generate_structured", fake_generate_structured)

from sqlalchemy.pool import StaticPool

TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, expire_on_commit=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def auth_headers_user1(client):
    client.post("/auth/register", json={
        "email": "user1@example.com",
        "full_name": "Test User 1",
        "password": "Password123!"
    })
    login_res = client.post("/auth/login", data={
        "username": "user1@example.com",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="function")
def auth_headers_user2(client):
    client.post("/auth/register", json={
        "email": "user2@example.com",
        "full_name": "Test User 2",
        "password": "Password123!"
    })
    login_res = client.post("/auth/login", data={
        "username": "user2@example.com",
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def pytest_sessionfinish(session, exitstatus):
    pass
