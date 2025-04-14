import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { CrmDataProvider } from './contexts/CrmDataContext';

import Index from './pages/Index';
import GetStarted from './pages/GetStarted';
import Services from './pages/Services';
import HighRisk from './pages/HighRisk';
import Industries from './pages/Industries';
import Partners from './pages/Partners';
import About from './pages/About';
import Results from './pages/Results';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Comparison from './pages/Comparison';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CaseStudies from './pages/CaseStudies';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import TeamManagement from './pages/admin/TeamManagement';
import Deals from './pages/admin/Deals';
import GmailIntegration from './pages/admin/GmailIntegration';
import CalendarIntegration from './pages/admin/CalendarIntegration';
import Booking from './pages/Booking';
import CommissionTracking from './pages/admin/CommissionTracking';
import TrainingHub from './pages/admin/TrainingHub';
import ContactManagement from './pages/admin/ContactManagement';
import SettingsPage from './pages/admin/Settings';
import IndustryDocuments from './pages/admin/IndustryDocuments';
import DocumentsPage from './pages/admin/DocumentsPage';
import OneClickSubmit from './pages/admin/OneClickSubmit';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/services" element={<Services />} />
      <Route path="/high-risk" element={<HighRisk />} />
      <Route path="/industries" element={<Industries />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/about" element={<About />} />
      <Route path="/results" element={<Results />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/comparison" element={<Comparison />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/case-studies" element={<CaseStudies />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/team-management" element={<TeamManagement />} />
      <Route path="/admin/deals" element={<Deals />} />
      <Route path="/admin/gmail-integration" element={<GmailIntegration />} />
      <Route path="/admin/calendar-integration" element={<CalendarIntegration />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/admin/commission-tracking" element={<CommissionTracking />} />
      <Route path="/admin/training-hub" element={<TrainingHub />} />
      <Route path="/admin/contacts" element={<ContactManagement />} />
      <Route path="/admin/settings" element={<SettingsPage />} />
      <Route path="/admin/industry-documents" element={<IndustryDocuments />} />
      <Route path="/admin/documents" element={<DocumentsPage />} />
      <Route path="/admin/one-click-submit" element={<OneClickSubmit />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  console.log("App rendering with CrmDataProvider");
  
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <CrmDataProvider>
        <BrowserRouter>
          <div className="app-wrapper">
            <AppRoutes />
            <Toaster />
          </div>
        </BrowserRouter>
      </CrmDataProvider>
    </ThemeProvider>
  );
};

export default App;
