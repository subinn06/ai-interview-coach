import io

def setup_user_interview_session(client, headers):
    pdf_bytes = b"%PDF-1.4 report test resume"
    files = {"file": ("report_resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    res_upload = client.post("/resumes", files=files, headers=headers)
    resume_id = res_upload.json()["id"]

    client.post(f"/resumes/{resume_id}/analyze", headers=headers)

    job_payload = {
        "job_title": "Staff Engineer",
        "company_name": "OpenAI",
        "description": "AI systems and LLM evaluation"
    }
    job_res = client.post("/jobs", json=job_payload, headers=headers)
    job_id = job_res.json()["id"]

    client.post(f"/jobs/{job_id}/analyze", headers=headers)

    start_res = client.post("/interviews/start", json={
        "resume_id": resume_id,
        "job_description_id": job_id,
        "difficulty": "hard"
    }, headers=headers)

    session_id = start_res.json()["session_id"]
    q_id = start_res.json()["first_question"]["id"]

    client.post(f"/interviews/{session_id}/answer", json={
        "question_id": q_id,
        "answer": "Evaluate precision, recall, and context relevance using Ragas metrics."
    }, headers=headers)

    client.post(f"/interviews/{session_id}/finish", headers=headers)
    return session_id

def test_generate_report_by_session(client, auth_headers_user1):
    session_id = setup_user_interview_session(client, auth_headers_user1)

    report_res = client.get(f"/reports/session/{session_id}", headers=auth_headers_user1)
    assert report_res.status_code == 200
    data = report_res.json()
    assert data["overall_score"] == 92
    assert "id" in data

def test_retrieve_report_by_id(client, auth_headers_user1):
    session_id = setup_user_interview_session(client, auth_headers_user1)

    gen_res = client.get(f"/reports/session/{session_id}", headers=auth_headers_user1)
    assert gen_res.status_code == 200
    report_id = gen_res.json()["id"]

    get_res = client.get(f"/reports/{report_id}", headers=auth_headers_user1)
    assert get_res.status_code == 200
    data = get_res.json()
    assert data["id"] == report_id
    assert data["overall_score"] == 92

def test_reports_user_isolation(client, auth_headers_user1, auth_headers_user2):
    session_id_u1 = setup_user_interview_session(client, auth_headers_user1)

    gen_res = client.get(f"/reports/session/{session_id_u1}", headers=auth_headers_user1)
    assert gen_res.status_code == 200
    report_id = gen_res.json()["id"]

    # user 2 attempts to fetch user 1's report by session id and report id
    session_res_u2 = client.get(f"/reports/session/{session_id_u1}", headers=auth_headers_user2)
    assert session_res_u2.status_code == 404

    report_res_u2 = client.get(f"/reports/{report_id}", headers=auth_headers_user2)
    assert report_res_u2.status_code == 404
