
import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Edit2,
  Trash2, 
  Eye,
  MoreHorizontal 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TeamMember } from './form';
import TeamMemberDetail from './TeamMemberDetail';

interface TeamMembersTableProps {
  members: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
  onViewDetails: (member: TeamMember) => void;
}

const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="border rounded-md mt-4 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No team members found. Add your first team member to get started.
              </TableCell>
            </TableRow>
          ) : (
            members.map(member => (
              <TableRow 
                key={member.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onViewDetails(member)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-gray-200">
                      <img 
                        src={member.profilePicture || "https://i.pravatar.cc/150?img=1"} 
                        alt={member.name}
                      />
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.phone}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(member);
                      }}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(member)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => confirmDelete(member.id, member.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamMembersTable;
