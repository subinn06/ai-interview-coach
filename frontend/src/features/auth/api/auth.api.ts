import api from "@/lib/axios";
import type { LoginRequest, LoginResponse, RegisterRequest, User } from "../types/auth.types";

export const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);

  const response = await api.post<LoginResponse>("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

export const registerApi = async (userData: RegisterRequest): Promise<User> => {
  const response = await api.post<User>("/auth/register", userData);
  return response.data;
};

export const getCurrentUserApi = async (): Promise<User> => {
  const response = await api.get<User>("/auth/me");
  return response.data;
};
