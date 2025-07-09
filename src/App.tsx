
import { Suspense, lazy, startTransition, StrictMode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load heavy components
const Index = lazy(() => import("./pages/Index"));
const ExamPage = lazy(() => import("./pages/ExamPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimize React Query configuration for 2025
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: 1,
      networkMode: 'offlineFirst',
    },
  },
});

const App = () => (
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={200}>
          <Toaster />
          <Sonner position="top-right" expand={true} richColors closeButton />
          <AuthProvider>
            <BrowserRouter>
              <Suspense 
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <LoadingSpinner size="large" message="Loading SmartExam NG..." />
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/exam" element={<ExamPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);

export default App;
