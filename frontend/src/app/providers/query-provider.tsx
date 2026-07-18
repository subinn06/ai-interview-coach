import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  // leverage usestate initializer to guarantee the queryclient is instantiated exactly once per mount
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // prevents aggressive ai api requests on window refocus
            retry: 1,                    // limits retry attempts for failed requests
            staleTime: 5 * 60 * 1000,    // data is considered fresh for 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
