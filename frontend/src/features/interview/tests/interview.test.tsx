import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test/test-utils";
import InterviewSetupPage from "../pages/InterviewSetupPage";
import AnswerEditor from "../components/AnswerEditor";
import QuestionCard from "../components/QuestionCard";
import FeedbackCard from "../components/FeedbackCard";
import * as resumeService from "@/features/resume/api/resume.api";
import * as jobService from "@/features/jobs/api/jobs.api";

vi.mock("../api/interview.api");
vi.mock("@/features/resume/api/resume.api");
vi.mock("@/features/jobs/api/jobs.api");

describe("Interview Feature Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders setup form with resume and job options", async () => {
    vi.spyOn(resumeService, "getResumesApi").mockResolvedValueOnce([
      { id: "res-1", user_id: "u-1", filename: "my_resume.pdf", stored_filename: "my_res.pdf", file_path: "/uploads/res-1.pdf", created_at: "2026-08-01" },
    ]);
    vi.spyOn(jobService, "getJobsApi").mockResolvedValueOnce([
      { id: "job-1", user_id: "u-1", job_title: "Fullstack Engineer", company_name: "Google", description: "Build scalable web apps", created_at: "2026-08-01" },
    ]);

    renderWithProviders(<InterviewSetupPage />);

    await waitFor(() => {
      expect(screen.getByText(/my_resume.pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/Fullstack Engineer at Google/i)).toBeInTheDocument();
    });
  });

  it("renders active interview question", () => {
    renderWithProviders(
      <QuestionCard
        questionText="How do you handle async state in React?"
        currentNumber={2}
        totalQuestions={5}
        category="Frontend Architecture"
        difficulty="medium"
      />
    );

    expect(screen.getByText(/How do you handle async state in React\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Question 2 of 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Frontend Architecture/i)).toBeInTheDocument();
  });

  it("handles answer submission in AnswerEditor", () => {
    const handleSubmit = vi.fn();
    renderWithProviders(
      <AnswerEditor onSubmit={handleSubmit} isLoading={false} />
    );

    const textarea = screen.getByLabelText(/type your response/i);
    fireEvent.change(textarea, { target: { value: "We can use React Query and useEffect hooks." } });

    const submitBtn = screen.getByRole("button", { name: /submit response/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith("We can use React Query and useEffect hooks.");
  });

  it("handles next question click in FeedbackCard", () => {
    const handleNext = vi.fn();
    const evaluation = {
      score: 85,
      feedback: "Great response on React Query state management.",
      strengths: ["Clear explanation"],
      weaknesses: ["Add error handling details"],
      improvements: ["Mention retry configuration"],
    };

    renderWithProviders(
      <FeedbackCard
        evaluation={evaluation}
        onNext={handleNext}
        isLastQuestion={false}
        isLoadingNext={false}
      />
    );

    expect(screen.getByText(/Great response on React Query state management./i)).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /continue to next question/i });
    fireEvent.click(nextBtn);

    expect(handleNext).toHaveBeenCalled();
  });

  it("renders interview completion button on final question", () => {
    const handleNext = vi.fn();
    const evaluation = {
      score: 90,
      feedback: "Final question answered excellently.",
      strengths: ["System design clarity"],
      weaknesses: [],
      improvements: [],
    };

    renderWithProviders(
      <FeedbackCard
        evaluation={evaluation}
        onNext={handleNext}
        isLastQuestion={true}
        isLoadingNext={false}
      />
    );

    expect(screen.getByRole("button", { name: /finish interview & view report/i })).toBeInTheDocument();
  });

  it("renders error state and handles retry in AnswerEditor", () => {
    const handleSubmit = vi.fn();
    const handleRetry = vi.fn();

    renderWithProviders(
      <AnswerEditor
        onSubmit={handleSubmit}
        isLoading={false}
        error="Network error: Connection failed"
        onRetry={handleRetry}
      />
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Network error: Connection failed — Your answer is preserved below./i)).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /retry submission/i });
    fireEvent.click(retryBtn);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});

