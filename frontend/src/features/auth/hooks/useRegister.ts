import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../api/auth.api";
import type { RegisterRequest } from "../types/auth.types";

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterRequest) => registerApi(userData),
  });
};
