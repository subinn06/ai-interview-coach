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

    @staticmethod
    def job_analysis(job_title: str, company_name: str, description: str) -> str:
        return f"""You are an experienced technical recruiter.

Analyze the following job description to extract structured requirements.

Role: {job_title}
Company: {company_name}

Specifically extract the following details:
1. required_skills: A list of core technical or soft skills that are strictly required or mandatory for this role.
2. preferred_skills: A list of nice-to-have skills, certifications, or tool experiences.
3. experience_level: Estimate the target career level or range (e.g., Entry-level, Mid-level, Senior, Lead).
4. responsibilities: A list of primary duties, projects, or day-to-day responsibilities described in the job post.
5. keywords: Important technical terms, industry-specific words, or core methodologies that are emphasized in the description (great for ATS keywords).
6. summary: A concise summary of the role and what the team is looking for.

Job Description:
{description}
"""