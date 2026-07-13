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

    @staticmethod
    def interview_questions(resume_analysis: dict, job_analysis: dict, difficulty: str, count: int = 5) -> str:
        return f"""You are a professional technical interviewer.

Your goal is to generate a list of {count} highly tailored technical and behavioral interview questions for a candidate.

Use the candidate's Resume Analysis and the Job Description Analysis to customize the questions:
- Evaluate the gap between the candidate's strengths (or missing skills) and the job's required skills.
- Ask questions that verify they possess the required skills, or probe into missing/weaker areas from their resume.
- Tailor the depth of questions to the chosen difficulty level: '{difficulty}'.
- Ensure questions are varied across categories (e.g., Coding, System Design, Communication, Database).

Candidate Resume Analysis:
{resume_analysis}

Job Description Analysis:
{job_analysis}

Target Difficulty: {difficulty}

Generate exactly {count} questions. For each question:
- question: The actual question to ask the user.
- category: The topic category (e.g., Python, Architecture, Database).
- expected_topics: A list of 3-5 key concepts, keywords, or topics the candidate should mention in their answer.
"""

    @staticmethod
    def evaluate_answer(question: str, expected_topics: list[str], answer: str) -> str:
        return f"""You are a technical interviewer evaluating a candidate's answer.

Question Asked: {question}
Expected Topics/Keywords: {expected_topics}
Candidate's Answer: {answer}

Provide a structured evaluation:
1. score: An integer score from 0 to 100 based on the accuracy, completeness, and clarity of the answer.
   - If the answer is blank, nonsensical, or completely wrong, give a very low score (0-20).
   - If they hit most expected topics with clear phrasing, give a high score (80+).
2. feedback: A concise summary of their answer's quality.
3. strengths: A list of points they got right or explained well.
4. weaknesses: A list of missing details, errors, or gaps in their answer.
5. improvements: Actionable advice on how they could structure or explain their answer better.
"""

    @staticmethod
    def generate_feedback(qa_history: list[dict]) -> str:
        return f"""You are a senior technical interviewer and hiring manager compiling the final evaluation report for a candidate.

Review the history of questions, answers, and scores from their interview session:
{qa_history}

Provide a structured final feedback report:
1. overall_score: Estimate a final score between 0 and 100 representing their overall performance.
2. technical_score: Score (0-100) representing their technical knowledge and correctness.
3. communication_score: Score (0-100) representing how clearly, concisely, and professionally they explained their answers.
4. problem_solving_score: Score (0-100) representing their capacity to handle edge cases, explain trade-offs, and think through system engineering questions.
5. confidence_score: Score (0-100) representing the certainty, depth of expertise, and structure in their delivery.
6. strengths: A list of candidate's core strengths highlighted during the session.
7. improvement_areas: A list of gaps, errors, or areas where the candidate needs to study.
8. recommended_topics: A list of recommended learning topics. For each topic, specify:
   - topic: The name of the subject or library to study.
   - reason: A brief explanation of why they need to study this (referencing gaps in their answers).
   - priority: High, Medium, or Low based on how critical it is for the role.
9. summary: A concise high-level feedback summary outlining overall performance, potential, and a final advice.
"""