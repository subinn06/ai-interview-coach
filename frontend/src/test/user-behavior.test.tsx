import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test/test-utils";
import LoginPage from "@/features/auth/pages/LoginPage";
import ResumeDetailPage from "@/features/resume/pages/ResumeDetailPage";
import InterviewSessionPage from "@/features/interview/pages/InterviewSessionPage";
import ReportPage from "@/features/reports/pages/ReportPage";
import { useAuthStore } from "@/store/auth-store";
import * as authService from "@/features/auth/api/auth.api";
import * as resumeService from "@/features/resume/api/resume.api";
import * as interviewService from "@/features/interview/api/interview.api";
import * as reportsService from "@/features/reports/api/reports.api";

vi.mock("@/features/auth/api/auth.api");
vi.mock("@/features/resume/api/resume.api");
vi.mock("@/features/interview/api/interview.api");
vi.mock("@/features/reports/api/reports.api");

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "1", sessionId: "1" }),
  };
});

describe("User Behavior Integration Tests (Sprint 9.10)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  });

  it("User Behavior 1: User submits login form and authenticates session", async () => {
    const mockUser = { id: "u-1", email: "candidate@example.com", full_name: "Sarah Connor", is_active: true, created_at: "2026-08-01" };
    vi.spyOn(authService, "loginApi").mockResolvedValueOnce({
      access_token: "valid-session-jwt",
      token_type: "bearer",
    });
    vi.spyOn(authService, "getCurrentUserApi").mockResolvedValueOnce(mockUser);

    renderWithProviders(<LoginPage />);

    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const signInBtn = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "candidate@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    fireEvent.click(signInBtn);

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().user?.full_name).toBe("Sarah Connor");
    });
  });

  it("User Behavior 2: User views resume detail and triggers Gemini ATS AI analysis", async () => {
    vi.spyOn(resumeService, "getResumeApi").mockResolvedValueOnce({
      id: "1",
      user_id: "u-1",
      filename: "senior_fullstack_resume.pdf",
      stored_filename: "stored_1.pdf",
      file_path: "/uploads/1.pdf",
      created_at: "2026-08-01",
      analyses: [
        {
          id: "ans-1",
          resume_id: "1",
          ats_score: 92,
          summary: "Outstanding Fullstack Candidate Profile",
          strengths: ["React 19", "TypeScript", "Node.js Architecture"],
          weaknesses: ["K8s deployment experience"],
          missing_skills: ["GraphQL"],
          created_at: "2026-08-01",
        },
      ],
    });

    renderWithProviders(<ResumeDetailPage />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "senior_fullstack_resume.pdf" })).toBeInTheDocument();
      expect(screen.getByText("Outstanding Fullstack Candidate Profile")).toBeInTheDocument();
      expect(screen.getByText("React 19")).toBeInTheDocument();
      expect(screen.getByText(/92%/i)).toBeInTheDocument();
    });
  });

  it("User Behavior 3: User answers interview question and receives real-time AI feedback", async () => {
    vi.spyOn(interviewService, "getInterviewApi").mockResolvedValue({
      id: "1",
      status: "started",
      difficulty: "hard",
      started_at: "2026-08-01",
      questions: [
        {
          id: "q-1",
          question: "Explain how React fiber reconciler schedules high priority updates?",
          category: "React Architecture",
          order_number: 1,
          expected_topics: ["Concurrent Mode", "Priority Lanes"],
          created_at: "2026-08-01",
          answer: null,
        },
      ],
    });

    const submitSpy = vi.spyOn(interviewService, "submitAnswerApi").mockResolvedValueOnce({
      evaluation: {
        score: 88,
        feedback: "Excellent technical explanation of concurrent rendering priorities.",
        strengths: ["Deep understanding of Fiber tree mutation phase"],
        weaknesses: ["Can expand on useDeferredValue hook"],
        improvements: ["Add Code sandbox benchmark"],
      },
    });

    renderWithProviders(<InterviewSessionPage />);

    await waitFor(() => {
      expect(screen.getByText(/Explain how React fiber reconciler schedules high priority updates\?/i)).toBeInTheDocument();
    });

    const answerBox = screen.getByLabelText(/type your response/i);
    fireEvent.change(answerBox, {
      target: { value: "Fiber assigns priority lanes to updates allowing user interactions to preempt heavy background renders." },
    });

    const submitBtn = screen.getByRole("button", { name: /submit response/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith("1", {
        question_id: "q-1",
        answer: "Fiber assigns priority lanes to updates allowing user interactions to preempt heavy background renders.",
      });
      expect(screen.getByText(/Excellent technical explanation of concurrent rendering priorities./i)).toBeInTheDocument();
      expect(screen.getByText(/88%/i)).toBeInTheDocument();
    });
  });

  it("User Behavior 4: User opens interview report page and views comprehensive evaluation scores", async () => {
    vi.spyOn(reportsService, "getReportApi").mockResolvedValueOnce({
      id: "1",
      session_id: "sess-100",
      overall_score: 91,
      technical_score: 95,
      communication_score: 88,
      problem_solving_score: 90,
      confidence_score: 92,
      summary: "Candidate demonstrates staff-level technical depth and articulate communication.",
      strengths: ["Distributed Caching", "Microfrontends", "Database Query Optimization"],
      improvement_areas: ["Edge Workers routing latency"],
      recommended_topics: ["Cloudflare Workers KV"],
      created_at: "2026-08-01",
    });

    renderWithProviders(<ReportPage />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /comprehensive evaluation report/i })).toBeInTheDocument();
      expect(screen.getByText("Outstanding Performance")).toBeInTheDocument();
      expect(screen.getByText("Distributed Caching")).toBeInTheDocument();
      expect(screen.getByText(/Edge Workers routing latency/i)).toBeInTheDocument();
      expect(screen.getByText(/Candidate demonstrates staff-level technical depth/i)).toBeInTheDocument();
    });
  });

  it("User Behavior 5: Network failure during answer submission preserves answer and allows candidate retry", async () => {
    vi.spyOn(interviewService, "getInterviewApi").mockResolvedValue({
      id: "1",
      status: "started",
      difficulty: "medium",
      started_at: "2026-08-01",
      questions: [
        {
          id: "q-1",
          question: "Explain database indexing strategies for high throughput writes?",
          category: "Database Design",
          order_number: 1,
          expected_topics: ["B-Tree", "LSM Tree"],
          created_at: "2026-08-01",
          answer: null,
        },
      ],
    });

    // 1st call fails with network error
    const submitSpy = vi.spyOn(interviewService, "submitAnswerApi")
      .mockRejectedValueOnce(new Error("Network Error: Connection Timed Out"))
      // 2nd call (retry) succeeds
      .mockResolvedValueOnce({
        evaluation: {
          score: 92,
          feedback: "Great answer on LSM tree append-only logs for high write throughput.",
          strengths: ["LSM vs B-Tree write amplification comparison"],
          weaknesses: [],
          improvements: [],
        },
      });

    renderWithProviders(<InterviewSessionPage />);

    await waitFor(() => {
      expect(screen.getByText(/Explain database indexing strategies for high throughput writes\?/i)).toBeInTheDocument();
    });

    const answerBox = screen.getByLabelText(/type your response/i);
    const candidateAnswer = "Use LSM trees (like RocksDB) for append-only sequential writes to avoid random I/O bottlenecks.";
    fireEvent.change(answerBox, { target: { value: candidateAnswer } });

    const submitBtn = screen.getByRole("button", { name: /submit response/i });
    fireEvent.click(submitBtn);

    // verify error alert appears, but candidate answer text remains intact in textarea
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText(/Network Error: Connection Timed Out — Your answer is preserved below./i)).toBeInTheDocument();
      expect((answerBox as HTMLTextAreaElement).value).toBe(candidateAnswer);
    });

    // click retry
    const retryBtn = screen.getByRole("button", { name: /retry submission/i });
    fireEvent.click(retryBtn);

    // verify successful evaluation on retry
    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledTimes(2);
      expect(screen.getByText(/Great answer on LSM tree append-only logs/i)).toBeInTheDocument();
      expect(screen.getByText(/92%/i)).toBeInTheDocument();
    });
  });
});
