import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { Toaster } from "sonner";
import AuthBootstrap from "./app/providers/auth-bootstrap";
import ErrorBoundary from "./components/common/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthBootstrap>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </AuthBootstrap>
    </ErrorBoundary>
  );
}
