
import { useNavigate } from 'react-router-dom';

/**
 * Hook for CRM navigation that ensures proper scrolling behavior
 * Returns navigation functions for different CRM routes
 */
export const useCrmNavigation = () => {
  const navigate = useNavigate();
  
  // Generic navigation function with scroll behavior
  const navigateTo = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Specific navigation functions for CRM sections
  const navigateToDashboard = () => navigateTo('/admin/dashboard');
  const navigateToTeams = () => navigateTo('/admin/team-management');
  const navigateToDeals = () => navigateTo('/admin/deals');
  const navigateToGmail = () => navigateTo('/admin/gmail-integration');
  const navigateToCalendar = () => navigateTo('/admin/calendar-integration');
  const navigateToCommissions = () => navigateTo('/admin/commission-tracking');
  const navigateToTraining = () => navigateTo('/admin/training-hub');
  const navigateToContacts = () => navigateTo('/admin/contacts');
  const navigateToMarketingMaterials = () => navigateTo('/admin/marketing-materials');
  const navigateToSettings = () => navigateTo('/admin/settings');
  
  return {
    navigateTo,
    navigateToDashboard,
    navigateToTeams,
    navigateToDeals,
    navigateToGmail,
    navigateToCalendar,
    navigateToCommissions,
    navigateToTraining,
    navigateToContacts,
    navigateToMarketingMaterials,
    navigateToSettings
  };
};
