import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import {
  getProfileApi,
  updateProfileApi,
  changePasswordApi,
  deleteAccountApi,
} from "../api/profile.api";
import type {
  UserUpdatePayload,
  PasswordChangePayload,
  UserProfile,
} from "../types/profile.types";
import type { User } from "@/features/auth/types/auth.types";

const mapUserProfileToUser = (profile: UserProfile): User => ({
  id: profile.id,
  email: profile.email,
  full_name: profile.full_name,
  is_active: profile.is_active ?? true,
  created_at: profile.created_at ?? "",
});

export const useProfile = () => {
  const setUser = useAuthStore((state) => state.setUser);
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const data = await getProfileApi();
      setUser(mapUserProfileToUser(data));
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: UserUpdatePayload) => updateProfileApi(data),
    onSuccess: (updatedUser) => {
      setUser(mapUserProfileToUser(updatedUser));
      queryClient.setQueryData(["profile"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: PasswordChangePayload) => changePasswordApi(data),
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => deleteAccountApi(),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
};
