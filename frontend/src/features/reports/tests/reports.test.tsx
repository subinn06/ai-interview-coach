import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "@/test/test-utils";
import ReportsPage from "../pages/ReportsPage";
import ReportPage from "../pages/ReportPage";
import * as reportsService from "../api/reports.api";

vi.mock("../api/reports.api");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "rep-1" }),
  };
});

describe("Reports Feature Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty report state when candidate has no evaluation reports", async () => {
    vi.spyOn(reportsService, "getReportsApi").mockResolvedValueOnce([]);

    renderWithProviders(<ReportsPage />);

    await waitFor(() => {
      expect(screen.getByText("Your interview reports will appear here.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /start interview/i })).toBeInTheDocument();
    });
  });

  it("renders score, strengths, and improvement areas in detailed report", async () => {
    vi.spyOn(reportsService, "getReportApi").mockResolvedValueOnce({
      id: "rep-1",
      session_id: "sess-123",
      overall_score: 88,
      technical_score: 90,
      communication_score: 85,
      problem_solving_score: 88,
      confidence_score: 89,
      strengths: ["Clean code principles", "State management", "RESTful design"],
      improvement_areas: ["Database indexing", "System caching"],
      recommended_topics: ["PostgreSQL Optimization"],
      summary: "Demonstrated strong frontend engineering skills with clear architectural understanding.",
      created_at: "2026-08-01",
    });

    renderWithProviders(<ReportPage />);

    await waitFor(() => {
      expect(screen.getByText("Outstanding Performance")).toBeInTheDocument();
      expect(screen.getAllByText((content) => content.includes("88"))[0]).toBeInTheDocument();
      expect(screen.getByText("Clean code principles")).toBeInTheDocument();
      expect(screen.getByText("Database indexing")).toBeInTheDocument();
      expect(screen.getByText(/Demonstrated strong frontend engineering skills/i)).toBeInTheDocument();
    });
  });
});
