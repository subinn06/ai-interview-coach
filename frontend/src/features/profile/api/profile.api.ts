import api from "@/lib/axios";
import type {
  UserProfile,
  UserUpdatePayload,
  PasswordChangePayload,
} from "../types/profile.types";

export const getProfileApi = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("/auth/me");
  return response.data;
};

export const updateProfileApi = async (
  data: UserUpdatePayload
): Promise<UserProfile> => {
  const response = await api.put<UserProfile>("/auth/me", data);
  return response.data;
};

export const changePasswordApi = async (
  data: PasswordChangePayload
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    "/auth/change-password",
    data
  );
  return response.data;
};

export const deleteAccountApi = async (): Promise<void> => {
  await api.delete("/auth/me");
};
