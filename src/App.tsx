import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AssessmentEditor } from "./components/admin/AssessmentEditor";
import Assessment from "./pages/Assessment";
import ContactForm from "./pages/ContactForm";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; 
import Signup from "./pages/Signup";
import ProtectedRoute from "./ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route path="/assessment/:id" element={<Assessment />} />
          <Route path="/assessment/add" element={<AssessmentEditor mode="add" />} />
          <Route path="/assessment/update/:id" element={<AssessmentEditor mode="update" />} />
          <Route path="/contact-form" element={<ContactForm />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
