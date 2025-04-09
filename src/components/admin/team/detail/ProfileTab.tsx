
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Briefcase, PieChart, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TeamMember } from '../form';

interface ProfileTabProps {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ member, onEdit }) => {
  return (
    <div className="space-y-4 p-6">
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
    </div>
  );
};

export default ProfileTab;
