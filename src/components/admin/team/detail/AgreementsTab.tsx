
import React from 'react';
import TeamAgreements from '../TeamAgreements';
import type { TeamMember } from '../form';

interface AgreementsTabProps {
  member: TeamMember;
}

const AgreementsTab: React.FC<AgreementsTabProps> = ({ member }) => {
  return (
    <div className="p-6">
      <TeamAgreements teamMember={member} />
    </div>
  );
};

export default AgreementsTab;
