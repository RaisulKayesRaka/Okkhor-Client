import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./routes/Routes";
import { HelmetProvider } from "react-helmet-async";
import AuthProvider from "./providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import ThemeProvider from "./providers/ThemeProvider";
import toast from "react-hot-toast";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "An error occurred while updating data.", { id: "mutation-error" });
    },
  }),
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </QueryClientProvider>
        <Toaster position="top-center" reverseOrder={false} />
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
