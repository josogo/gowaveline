
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Briefcase, PieChart, FileText, Banknote, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import TeamAgreements from './TeamAgreements';
import type { TeamMember } from './TeamMemberForm';
import { useCrmData } from '@/contexts/CrmDataContext';

interface TeamMemberDetailProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
}

const TeamMemberDetail: React.FC<TeamMemberDetailProps> = ({
  isOpen,
  onClose,
  member,
  onEdit,
}) => {
  const navigate = useNavigate();
  const { deals } = useCrmData();
  
  // Filter deals assigned to this team member
  const memberDeals = deals.filter(deal => deal.assignedTo === member.id);
  
  const handleViewDeal = (dealId: string) => {
    navigate(`/admin/deals?dealId=${dealId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-orange-500">
              <img 
                src={member.profilePicture || "https://i.pravatar.cc/150?img=1"} 
                alt={member.name}
              />
            </Avatar>
            <div>
              <DialogTitle className="text-2xl font-bold">{member.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full grid grid-cols-3 px-6 pt-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold">Sales Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>Commission Split: <Badge className="bg-orange-500 hover:bg-orange-600">{member.commissionSplit}</Badge></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                    <span>Processing Volume: ${member.processingVolume}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Revenue Volume: ${member.revenueVolume}</span>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => onEdit(member)} className="bg-orange-500 hover:bg-orange-600">
                Edit Team Member
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="agreements" className="p-6">
            <TeamAgreements teamMember={member} />
          </TabsContent>
          
          <TabsContent value="deals" className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Banknote className="h-5 w-5 text-orange-500" />
              Assigned Deals
            </h3>
            
            {memberDeals.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-muted-foreground">No deals assigned to this team member yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {memberDeals.map(deal => (
                  <Card key={deal.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{deal.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Contact: {deal.contactName} • Revenue: ${deal.value}
                        </p>
                        {deal.processingVolume && (
                          <p className="text-sm text-muted-foreground">
                            Monthly Processing: ${deal.processingVolume}
                          </p>
                        )}
                      </div>
                      <Badge className={`${
                        deal.status === 'closed' ? 'bg-green-100 text-green-800' :
                        deal.status === 'lost' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {deal.status}
                      </Badge>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDeal(deal.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberDetail;
