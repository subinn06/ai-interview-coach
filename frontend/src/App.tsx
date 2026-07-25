import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { Toaster } from "sonner";
import AuthBootstrap from "./app/providers/auth-bootstrap";

export default function App() {
  return (
    <AuthBootstrap>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AuthBootstrap>
  );
}
