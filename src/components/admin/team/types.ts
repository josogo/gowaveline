
import { TeamMember as CrmTeamMember } from '@/contexts/CrmDataContext';
import { TeamMember as FormTeamMember } from './form';

// This function adapts CrmTeamMember to FormTeamMember
export const adaptCrmTeamMemberToFormTeamMember = (member: CrmTeamMember): FormTeamMember => {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    phone: member.phone,
    role: member.role,
    commissionSplit: member.commissionSplit,
    // Convert number to string as required by FormTeamMember
    processingVolume: String(member.processingVolume),
    revenueVolume: member.revenueVolume ? String(member.revenueVolume) : "0", 
    profilePicture: member.profilePicture
  };
};

// This function adapts FormTeamMember to CrmTeamMember
export const adaptFormTeamMemberToCrmTeamMember = (member: FormTeamMember): CrmTeamMember => {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    phone: member.phone,
    role: member.role,
    commissionSplit: member.commissionSplit,
    // Convert string to number as required by CrmTeamMember
    processingVolume: Number(member.processingVolume),
    revenueVolume: Number(member.revenueVolume),
    profilePicture: member.profilePicture
  };
};

// Re-export types to use in other files
export type { FormTeamMember };
