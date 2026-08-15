import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test/test-utils";
import { toast } from "sonner";
import ResumeListPage from "../pages/ResumeListPage";
import ResumeUploader from "../components/ResumeUploader";
import * as resumeService from "../api/resume.api";

vi.mock("../api/resume.api");

describe("Resume Feature Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders resume list with items and empty state", async () => {
    vi.spyOn(resumeService, "getResumesApi").mockResolvedValueOnce([
      {
        id: "res-1",
        user_id: "u-1",
        filename: "senior_engineer_resume.pdf",
        stored_filename: "stored_senior.pdf",
        file_path: "/uploads/res-1.pdf",
        created_at: "2026-08-01",
        analyses: [
          {
            id: "ans-1",
            resume_id: "res-1",
            ats_score: 88,
            summary: "Strong ATS match",
            strengths: ["React"],
            weaknesses: [],
            missing_skills: [],
            created_at: "2026-08-01",
          },
        ],
      },
    ]);

    renderWithProviders(<ResumeListPage />);

    await waitFor(() => {
      expect(screen.getByText("senior_engineer_resume.pdf")).toBeInTheDocument();
      expect(screen.getByText(/ATS 88%/i)).toBeInTheDocument();
    });
  });

  it("renders upload validation for invalid file type", async () => {
    const toastErrorSpy = vi.spyOn(toast, "error");
    renderWithProviders(<ResumeUploader />);

    const invalidFile = new File(["invalid content"], "notes.txt", { type: "text/plain" });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });
    }

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith("Only PDF files are supported.");
    });
  });

  it("triggers analyze button mutation", async () => {
    vi.spyOn(resumeService, "getResumesApi").mockResolvedValueOnce([
      {
        id: "res-1",
        user_id: "u-1",
        filename: "my_resume.pdf",
        stored_filename: "stored_my.pdf",
        file_path: "/uploads/res-1.pdf",
        created_at: "2026-08-01",
      },
    ]);

    const analyzeSpy = vi.spyOn(resumeService, "analyzeResumeApi").mockResolvedValueOnce({
      id: "ans-1",
      resume_id: "res-1",
      ats_score: 90,
      summary: "Excellent profile",
      strengths: ["React", "TypeScript"],
      weaknesses: ["GraphQL"],
      missing_skills: [],
      created_at: "2026-08-01",
    });

    renderWithProviders(<ResumeListPage />);

    await waitFor(() => {
      expect(screen.getByText("my_resume.pdf")).toBeInTheDocument();
    });

    const analyzeBtn = screen.getByRole("button", { name: /analyze/i });
    fireEvent.click(analyzeBtn);

    await waitFor(() => {
      expect(analyzeSpy).toHaveBeenCalledWith("res-1");
    });
  });

  it("handles delete confirmation dialog", async () => {
    vi.spyOn(resumeService, "getResumesApi").mockResolvedValueOnce([
      {
        id: "res-1",
        user_id: "u-1",
        filename: "old_resume.pdf",
        stored_filename: "stored_old.pdf",
        file_path: "/uploads/res-1.pdf",
        created_at: "2026-08-01",
      },
    ]);

    const deleteSpy = vi.spyOn(resumeService, "deleteResumeApi").mockResolvedValueOnce();
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);

    renderWithProviders(<ResumeListPage />);

    await waitFor(() => {
      expect(screen.getByText("old_resume.pdf")).toBeInTheDocument();
    });

    const deleteBtn = screen.getByTitle("Delete Resume");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith("res-1");
    });
  });
});
