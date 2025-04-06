
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
import { Mail, Phone, Briefcase, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TeamAgreements from './TeamAgreements';
import type { TeamMember } from './TeamMemberForm';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-[#0EA5E9]">
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
        
        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 pt-4">
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
                    <span>Commission Split: <Badge>{member.commissionSplit}</Badge></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                    <span>Processing Volume: ${member.processingVolume}</span>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => onEdit(member)}>
                Edit Team Member
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="agreements" className="pt-4">
            <TeamAgreements teamMember={member} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberDetail;
