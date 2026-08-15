from unittest.mock import patch
from app.ai.schemas import JobAnalysisSchema

def test_create_job(client, auth_headers_user1):
    job_payload = {
        "job_title": "Senior Python Engineer",
        "company_name": "Stripe",
        "description": "Looking for Python backend developer with FastAPI and PostgreSQL expertise."
    }
    response = client.post("/jobs", json=job_payload, headers=auth_headers_user1)
    assert response.status_code in (200, 201)
    data = response.json()
    assert data["job_title"] == "Senior Python Engineer"
    assert data["company_name"] == "Stripe"
    assert "id" in data

def test_retrieve_job(client, auth_headers_user1):
    job_payload = {
        "job_title": "Backend Architect",
        "company_name": "Google",
        "description": "Design distributed microservices in Go/Python."
    }
    create_res = client.post("/jobs", json=job_payload, headers=auth_headers_user1)
    assert create_res.status_code in (200, 201)
    job_id = create_res.json()["id"]

    get_res = client.get(f"/jobs/{job_id}", headers=auth_headers_user1)
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["job_title"] == "Backend Architect"

def test_jobs_user_isolation(client, auth_headers_user1, auth_headers_user2):
    job_payload = {
        "job_title": "Private User 1 Job Target",
        "company_name": "Acme Inc",
        "description": "Private job posting details."
    }
    create_res = client.post("/jobs", json=job_payload, headers=auth_headers_user1)
    assert create_res.status_code in (200, 201)
    job_id = create_res.json()["id"]

    get_user2 = client.get(f"/jobs/{job_id}", headers=auth_headers_user2)
    assert get_user2.status_code == 404

def test_analyze_job(client, auth_headers_user1):
    job_payload = {
        "job_title": "Fullstack Developer",
        "company_name": "Meta",
        "description": "Fullstack role requiring React, Node, and Python."
    }
    create_res = client.post("/jobs", json=job_payload, headers=auth_headers_user1)
    assert create_res.status_code in (200, 201)
    job_id = create_res.json()["id"]

    mock_analysis = JobAnalysisSchema(
        required_skills=["React", "Node.js", "Python"],
        preferred_skills=["Docker", "AWS"],
        responsibilities=["Build web UIs", "Maintain APIs"],
        experience_level="Senior",
        summary="High-growth fullstack role.",
        keywords=["Fullstack", "React"]
    )

    with patch("app.ai.job_analyzer.JobAnalyzer.analyze", return_value=mock_analysis):
        analyze_res = client.post(f"/jobs/{job_id}/analyze", headers=auth_headers_user1)
        assert analyze_res.status_code in (200, 201)
        data = analyze_res.json()
        assert "required_skills" in data
