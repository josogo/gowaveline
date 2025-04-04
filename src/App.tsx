
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Results from "./pages/Results";
import Industries from "./pages/Industries";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import GetStarted from "./pages/GetStarted";
import HighRisk from "./pages/HighRisk";
import CaseStudies from "./pages/CaseStudies";
import Blog from "./pages/Blog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Comparison from "./pages/Comparison";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Partners from "./pages/Partners";
import TeamManagement from "./pages/admin/TeamManagement";
import Deals from "./pages/admin/Deals";
import GmailIntegration from "./pages/admin/GmailIntegration";
import CommissionTracking from "./pages/admin/CommissionTracking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/results" element={<Results />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/high-risk" element={<HighRisk />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/team-management" element={<TeamManagement />} />
          <Route path="/admin/deals" element={<Deals />} />
          <Route path="/admin/gmail-integration" element={<GmailIntegration />} />
          <Route path="/admin/commission-tracking" element={<CommissionTracking />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
