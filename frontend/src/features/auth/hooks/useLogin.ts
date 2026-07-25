import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/auth.api";
import type { LoginRequest } from "../types/auth.types";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
  });
};
