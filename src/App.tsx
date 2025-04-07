
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

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

// Instead of using ChakraProvider with the Chakra UI v3 features,
// let's transition to using the components directly without the theme provider
// since there seem to be compatibility issues with the current version

const App = () => {
  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <Toaster position="top-right" />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
