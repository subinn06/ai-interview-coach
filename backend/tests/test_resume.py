import io
from unittest.mock import patch
from app.ai.schemas import ResumeAnalysisSchema

def test_upload_pdf_resume(client, auth_headers_user1):
    pdf_bytes = b"%PDF-1.4 sample pdf content for resume parsing"
    files = {"file": ("my_resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    
    response = client.post("/resumes", files=files, headers=auth_headers_user1)
    assert response.status_code in (200, 201)
    data = response.json()
    assert data["filename"] == "my_resume.pdf"
    assert "id" in data

def test_reject_invalid_file(client, auth_headers_user1):
    txt_bytes = b"This is a text file, not a PDF"
    files = {"file": ("notes.txt", io.BytesIO(txt_bytes), "text/plain")}
    
    response = client.post("/resumes", files=files, headers=auth_headers_user1)
    assert response.status_code == 400
    assert "detail" in response.json()

def test_resume_user_isolation(client, auth_headers_user1, auth_headers_user2):
    pdf_bytes = b"%PDF-1.4 user1 resume"
    files = {"file": ("user1_resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    upload_res = client.post("/resumes", files=files, headers=auth_headers_user1)
    assert upload_res.status_code in (200, 201)
    resume_id = upload_res.json()["id"]

    res_user2 = client.get(f"/resumes/{resume_id}", headers=auth_headers_user2)
    assert res_user2.status_code == 404

def test_delete_resume(client, auth_headers_user1):
    pdf_bytes = b"%PDF-1.4 delete target resume"
    files = {"file": ("to_delete.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    upload_res = client.post("/resumes", files=files, headers=auth_headers_user1)
    assert upload_res.status_code in (200, 201)
    resume_id = upload_res.json()["id"]

    delete_res = client.delete(f"/resumes/{resume_id}", headers=auth_headers_user1)
    assert delete_res.status_code in (200, 204)

    get_res = client.get(f"/resumes/{resume_id}", headers=auth_headers_user1)
    assert get_res.status_code == 404

def test_analyze_resume(client, auth_headers_user1):
    pdf_bytes = b"%PDF-1.4 analyze target resume"
    files = {"file": ("analyze.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    upload_res = client.post("/resumes", files=files, headers=auth_headers_user1)
    assert upload_res.status_code in (200, 201)
    resume_id = upload_res.json()["id"]

    mock_analysis = ResumeAnalysisSchema(
        ats_score=85,
        summary="Solid backend engineer",
        strengths=["FastAPI", "Python"],
        weaknesses=["Docker"],
        missing_skills=["Kubernetes"]
    )

    with patch("app.ai.resume_analyzer.ResumeAnalyzer.analyze", return_value=mock_analysis):
        analyze_res = client.post(f"/resumes/{resume_id}/analyze", headers=auth_headers_user1)
        assert analyze_res.status_code in (200, 201)
        data = analyze_res.json()
        assert data["ats_score"] == 85
