import { useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/store/auth-store";
import { getCurrentUserApi } from "@/features/auth/api/auth.api";
import Loader from "@/components/ui/Loader";

export default function AuthBootstrap({ children }: { children: ReactNode }) {
  const { accessToken, setUser, logout } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const bootstrapUser = async () => {
      if (accessToken) {
        try {
          const user = await getCurrentUserApi();
          setUser(user);
        } catch {
          logout();
        }
      }
      setIsInitializing(false);
    };

    bootstrapUser();
  }, [accessToken, setUser, logout]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
