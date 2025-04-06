
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { FileIcon, Download, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AgreementUploadModal from './AgreementUploadModal';
import { Skeleton } from '@/components/ui/skeleton';
import type { TeamMember } from './TeamMemberForm';

interface Agreement {
  id: string;
  agreement_type: string;
  file_name: string;
  file_path: string;
  created_at: string;
  effective_date: string | null;
  expiration_date: string | null;
}

interface TeamAgreementsProps {
  teamMember: TeamMember;
}

const TeamAgreements: React.FC<TeamAgreementsProps> = ({ teamMember }) => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAgreements = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('agent_agreements')
        .select('*')
        .eq('agent_id', teamMember.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setAgreements(data || []);
    } catch (error) {
      console.error("Error fetching agreements:", error);
      toast.error("Failed to load agreements");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, [teamMember.id]);

  const handleDownload = async (agreement: Agreement) => {
    try {
      const { data, error } = await supabase.storage
        .from('agent_agreements')
        .download(agreement.file_path);
        
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = agreement.file_name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const handleDelete = async (agreement: Agreement) => {
    if (!confirm('Are you sure you want to delete this agreement?')) {
      return;
    }
    
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('agent_agreements')
        .remove([agreement.file_path]);
        
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('agent_agreements')
        .delete()
        .eq('id', agreement.id);
        
      if (dbError) throw dbError;
      
      toast.success("Agreement deleted successfully");
      fetchAgreements();
    } catch (error) {
      console.error("Error deleting agreement:", error);
      toast.error("Failed to delete agreement");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Team Member Agreements</h3>
        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Agreement
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : agreements.length === 0 ? (
        <p className="text-sm text-muted-foreground">No agreements found for this team member.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead>Filename</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agreements.map((agreement) => (
              <TableRow key={agreement.id}>
                <TableCell>{agreement.agreement_type}</TableCell>
                <TableCell>
                  {agreement.effective_date 
                    ? format(new Date(agreement.effective_date), 'MMM d, yyyy')
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {agreement.expiration_date 
                    ? format(new Date(agreement.expiration_date), 'MMM d, yyyy')
                    : 'No Expiration'}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4" />
                  <span className="truncate max-w-[150px]">{agreement.file_name}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDownload(agreement)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(agreement)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <AgreementUploadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teamMember={teamMember}
      />
    </>
  );
};

export default TeamAgreements;
