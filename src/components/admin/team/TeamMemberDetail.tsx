
import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { TeamMember } from './form';
import { 
  ProfileTab, 
  AgreementsTab, 
  DealsTab, 
  MemberHeader 
} from './detail';

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
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto p-0">
        <MemberHeader member={member} />
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full grid grid-cols-3 px-6 pt-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileTab member={member} onEdit={onEdit} />
          </TabsContent>
          
          <TabsContent value="agreements">
            <AgreementsTab member={member} />
          </TabsContent>
          
          <TabsContent value="deals">
            <DealsTab member={member} onClose={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMemberDetail;
