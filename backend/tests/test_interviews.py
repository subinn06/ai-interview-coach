import io

def setup_user_resume_and_job(client, headers):
    pdf_bytes = b"%PDF-1.4 sample resume content"
    files = {"file": ("resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    res_upload = client.post("/resumes", files=files, headers=headers)
    resume_id = res_upload.json()["id"]

    client.post(f"/resumes/{resume_id}/analyze", headers=headers)

    job_payload = {
        "job_title": "Backend Engineer",
        "company_name": "Test Co",
        "description": "Python, FastAPI, SQL"
    }
    job_res = client.post("/jobs", json=job_payload, headers=headers)
    job_id = job_res.json()["id"]

    client.post(f"/jobs/{job_id}/analyze", headers=headers)

    return resume_id, job_id

def test_start_interview(client, auth_headers_user1):
    resume_id, job_id = setup_user_resume_and_job(client, auth_headers_user1)

    start_res = client.post("/interviews/start", json={
        "resume_id": resume_id,
        "job_description_id": job_id,
        "difficulty": "medium"
    }, headers=auth_headers_user1)

    assert start_res.status_code in (200, 201)
    data = start_res.json()
    assert "session_id" in data
    assert "first_question" in data

def test_submit_answer(client, auth_headers_user1):
    resume_id, job_id = setup_user_resume_and_job(client, auth_headers_user1)

    start_res = client.post("/interviews/start", json={
        "resume_id": resume_id,
        "job_description_id": job_id,
        "difficulty": "easy"
    }, headers=auth_headers_user1)

    session_id = start_res.json()["session_id"]
    q_id = start_res.json()["first_question"]["id"]

    answer_res = client.post(f"/interviews/{session_id}/answer", json={
        "question_id": q_id,
        "answer": "Asyncio uses an event loop to run cooperative tasks asynchronously."
    }, headers=auth_headers_user1)

    assert answer_res.status_code in (200, 201)
    data = answer_res.json()
    assert data["evaluation"]["score"] == 90

def test_invalid_interview_session(client, auth_headers_user1):
    response = client.get("/interviews/00000000-0000-0000-0000-000000000000", headers=auth_headers_user1)
    assert response.status_code == 404

def test_complete_interview(client, auth_headers_user1):
    resume_id, job_id = setup_user_resume_and_job(client, auth_headers_user1)

    start_res = client.post("/interviews/start", json={
        "resume_id": resume_id,
        "job_description_id": job_id,
        "difficulty": "medium"
    }, headers=auth_headers_user1)

    session_id = start_res.json()["session_id"]

    finish_res = client.post(f"/interviews/{session_id}/finish", headers=auth_headers_user1)
    assert finish_res.status_code == 200
    data = finish_res.json()
    assert data["status"] == "completed"

def test_prevent_unauthorized_interview_access(client, auth_headers_user1, auth_headers_user2):
    resume_id, job_id = setup_user_resume_and_job(client, auth_headers_user1)

    start_res = client.post("/interviews/start", json={
        "resume_id": resume_id,
        "job_description_id": job_id,
        "difficulty": "easy"
    }, headers=auth_headers_user1)

    session_id = start_res.json()["session_id"]
    q_id = start_res.json()["first_question"]["id"]

    # user 2 tries to submit an answer to user 1's interview session
    answer_res_user2 = client.post(f"/interviews/{session_id}/answer", json={
        "question_id": q_id,
        "answer": "Unauthorized attempt"
    }, headers=auth_headers_user2)

    assert answer_res_user2.status_code in (400, 404)
