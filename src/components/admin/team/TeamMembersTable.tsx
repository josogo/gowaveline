
import React from 'react';
import { Edit, Trash2, Percent } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { TeamMember } from './TeamMemberForm';

interface TeamMembersTableProps {
  members: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({ members, onEdit, onDelete }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead className="hidden md:table-cell">Volume</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length > 0 ? (
            members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell className="hidden md:table-cell">{member.phone}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Percent className="h-3 w-3 mr-1 text-orange-500" />
                    <span>{member.commissionSplit}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">${member.processingVolume}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(member)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDelete(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                No team members found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamMembersTable;
