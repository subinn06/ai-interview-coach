import { useAuthStore } from "@/store/auth-store";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return { handleLogout };
};
