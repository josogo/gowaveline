
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CrmDataProvider } from "./contexts/CrmDataContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Industries from "./pages/Industries";
import HighRisk from "./pages/HighRisk";
import Contact from "./pages/Contact";
import GetStarted from "./pages/GetStarted";
import Results from "./pages/Results";
import Comparison from "./pages/Comparison";
import CaseStudies from "./pages/CaseStudies";
import Partners from "./pages/Partners";
import PartnershipGuide from "./pages/PartnershipGuide";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Booking from "./pages/Booking";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TeamManagement from "./pages/admin/TeamManagement";
import Deals from "./pages/admin/Deals";
import CommissionTracking from "./pages/admin/CommissionTracking";
import TrainingHub from "./pages/admin/TrainingHub";
import ContactManagement from "./pages/admin/ContactManagement";
import GmailIntegration from "./pages/admin/GmailIntegration";
import CalendarIntegration from "./pages/admin/CalendarIntegration";
import Settings from "./pages/admin/Settings";
import DocumentsPage from "./pages/admin/DocumentsPage";
import IndustryDocuments from "./pages/admin/IndustryDocuments";
import OneClickSubmit from "./pages/admin/OneClickSubmit";
import MarketingMaterials from "./pages/admin/MarketingMaterials";
import MerchantApplication from "./pages/MerchantApplication";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CrmDataProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/high-risk" element={<HighRisk />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/results" element={<Results />} />
              <Route path="/comparison" element={<Comparison />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/partnership-guide" element={<PartnershipGuide />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/team-management" element={<TeamManagement />} />
              <Route path="/admin/deals" element={<Deals />} />
              <Route path="/admin/commission-tracking" element={<CommissionTracking />} />
              <Route path="/admin/training-hub" element={<TrainingHub />} />
              <Route path="/admin/contacts" element={<ContactManagement />} />
              <Route path="/admin/gmail-integration" element={<GmailIntegration />} />
              <Route path="/admin/calendar-integration" element={<CalendarIntegration />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/documents" element={<DocumentsPage />} />
              <Route path="/admin/industry-documents" element={<IndustryDocuments />} />
              <Route path="/admin/one-click-submit" element={<OneClickSubmit />} />
              <Route path="/admin/marketing-materials" element={<MarketingMaterials />} />
              <Route path="/merchant-application/:id" element={<MerchantApplication />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CrmDataProvider>
    </QueryClientProvider>
  );
}

export default App;
