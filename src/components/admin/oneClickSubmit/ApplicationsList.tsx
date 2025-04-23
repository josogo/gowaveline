import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  FileText,
  Plus,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ApplicationCard } from './ApplicationCard';
import { ApplicationFilters } from './ApplicationFilters';
import { ApplicationDialog } from './ApplicationDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const ApplicationsList: React.FC = () => {
  const isMobile = useIsMobile();
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchApplications();
  }, []);
  
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('merchant_applications')
        .select('*')
        .order('updated_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Transform the data to match our application card format
      const formattedData = data.map(app => {
        // Safely access businessName from application_data, which might be a JSON object or string
        let businessName = 'Unknown Business';
        if (app.application_data) {
          // If it's a string, parse it to an object
          const appData = typeof app.application_data === 'string' 
            ? JSON.parse(app.application_data) 
            : app.application_data;
          
          businessName = appData?.businessName || app.merchant_name || 'Unknown Business';
        } else if (app.merchant_name) {
          businessName = app.merchant_name;
        }
        
        return {
          id: app.id,
          businessName: businessName,
          status: app.completed ? 'complete' : 'incomplete',
          lastEdited: app.updated_at,
          progress: calculateProgress(app.application_data),
          rawData: app
        };
      });
      
      setApplications(formattedData);
      setFilteredApplications(formattedData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
      
      // Show mock data in case of error
      const mockApps = generateMockApplications();
      setApplications(mockApps);
      setFilteredApplications(mockApps);
    } finally {
      setLoading(false);
    }
  };
  
  const calculateProgress = (applicationData: any): number => {
    if (!applicationData) return 0;
    
    // Simple calculation based on fields filled
    const totalFields = 20; // Estimate of total fields across all tabs
    const filledFields = Object.keys(applicationData).length;
    
    return Math.min(100, Math.round((filledFields / totalFields) * 100));
  };
  
  const generateMockApplications = () => {
    return [
      {
        id: '1',
        businessName: 'Acme CBD Wellness',
        status: 'complete',
        lastEdited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        progress: 100,
      },
      {
        id: '2',
        businessName: 'Natural Supplements Co.',
        status: 'incomplete',
        lastEdited: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        progress: 65,
      },
      {
        id: '3',
        businessName: 'FitLife Subscription',
        status: 'incomplete',
        lastEdited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        progress: 30,
      },
    ];
  };
  
  const handleFilterChange = ({ searchTerm, status, sortBy }: { searchTerm: string; status: string; sortBy: string }) => {
    let filtered = [...applications];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.businessName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(app => app.status === status);
    }
    
    // Sort
    filtered = sortApplications(filtered, sortBy);
    
    setFilteredApplications(filtered);
  };
  
  const sortApplications = (apps: any[], sortBy: string) => {
    const sorted = [...apps];
    
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.lastEdited).getTime() - new Date(b.lastEdited).getTime());
      case 'name-asc':
        return sorted.sort((a, b) => a.businessName.localeCompare(b.businessName));
      case 'name-desc':
        return sorted.sort((a, b) => b.businessName.localeCompare(a.businessName));
      case 'progress-high':
        return sorted.sort((a, b) => b.progress - a.progress);
      case 'progress-low':
        return sorted.sort((a, b) => a.progress - b.progress);
      default:
        return sorted;
    }
  };
  
  const handleOpenApplication = (app: any) => {
    setSelectedApplication(app);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <ApplicationFilters onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApplications.map(app => (
          <ApplicationCard 
            key={app.id}
            application={app}
            onClick={() => handleOpenApplication(app)}
          />
        ))}
        
        {filteredApplications.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">No applications found</h3>
            <p className="text-gray-500 mb-4">
              {applications.length > 0 
                ? 'Try changing your filters to see more results' 
                : 'Start by creating a new application'}
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Application
            </Button>
          </div>
        )}
      </div>
      
      <ApplicationDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        application={selectedApplication?.rawData || selectedApplication}
      />
    </div>
  );
};

export default ApplicationsList;
