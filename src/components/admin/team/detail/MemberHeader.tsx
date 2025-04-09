
import React from 'react';
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar } from '@/components/ui/avatar';
import type { TeamMember } from '../form';

interface MemberHeaderProps {
  member: TeamMember;
}

const MemberHeader: React.FC<MemberHeaderProps> = ({ member }) => {
  return (
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
  );
};

export default MemberHeader;
