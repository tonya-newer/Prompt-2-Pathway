import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AssessmentEditor } from "./components/admin/AssessmentEditor";
import Assessment from "./pages/Assessment";
import ContactForm from "./pages/ContactForm";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; 
import Signup from "./pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import { SettingsProvider } from "./SettingsContext";
import { Footer } from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SettingsProvider>
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
            <Route path="/assessment/:slug" element={<Assessment />} />
            <Route path="/assessment/add" element={<AssessmentEditor mode="add" />} />
            <Route path="/assessment/update/:slug" element={<AssessmentEditor mode="update" />} />
            <Route path="/contact-form" element={<ContactForm />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </SettingsProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
