class PromptBuilder:
    @staticmethod
    def resume_analysis(resume_text: str) -> str:
        return f"""You are an experienced technical recruiter and ATS (Applicant Tracking System) evaluator.

Analyze the following resume text and provide a detailed professional evaluation.

Specifically evaluate the following criteria:
1. ats_score: Estimate a score between 0 and 100 based on modern layout clarity, formatting scanability, and standard technical terminology.
2. strengths: Provide a list of key professional achievements, skills, or experience points highlighted in the resume.
3. weaknesses: Provide a list of constructive areas where the resume layout, phrasing, or content could be improved.
4. missing_skills: Identify technical or soft skills that are expected for their career track but are missing or poorly represented in the text.
5. summary: Write a concise, high-level summary of the candidate's professional profile and overall fit.

Extracted Resume Text:
{resume_text}
"""