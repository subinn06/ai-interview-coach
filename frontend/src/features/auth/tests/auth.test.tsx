import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test/test-utils";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useAuthStore } from "@/store/auth-store";
import * as authService from "../api/auth.api";

vi.mock("../api/auth.api");

describe("Authentication Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  });

  describe("LoginForm", () => {
    it("renders login form validation errors when submitted empty", async () => {
      renderWithProviders(<LoginForm />);

      const submitBtn = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });
    });

    it("handles successful login", async () => {
      vi.spyOn(authService, "loginApi").mockResolvedValueOnce({
        access_token: "mock-jwt-token",
        token_type: "bearer",
      });

      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitBtn = screen.getByRole("button", { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(useAuthStore.getState().accessToken).toBe("mock-jwt-token");
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
      });
    });

    it("handles invalid credentials error response", async () => {
      vi.spyOn(authService, "loginApi").mockRejectedValueOnce({
        response: { status: 401, data: { detail: "Invalid credentials" } },
      });

      renderWithProviders(<LoginForm />);

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const submitBtn = screen.getByRole("button", { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(useAuthStore.getState().isAuthenticated).toBe(false);
      });
    });
  });

  describe("RegisterForm", () => {
    it("renders registration validation errors when submitted empty", async () => {
      renderWithProviders(<RegisterForm onSuccess={() => {}} />);

      const submitBtn = screen.getByRole("button", { name: /create account/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });
  });

  describe("Logout", () => {
    it("clears user authentication state on logout", () => {
      useAuthStore.setState({
        accessToken: "existing-token",
        user: { id: "1", email: "test@example.com", full_name: "Test User", is_active: true, created_at: "2026-01-01" },
        isAuthenticated: true,
      });

      useAuthStore.getState().logout();

      expect(useAuthStore.getState().accessToken).toBeNull();
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });
});
