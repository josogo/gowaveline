
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  MoreHorizontal, 
  Send,
  Copy,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

// Mock data for applications
const mockApplications = [
  {
    id: '1',
    businessName: 'Acme CBD Wellness',
    submissionDate: '2025-04-10',
    status: 'complete',
    industry: 'CBD',
    monthlyVolume: '$120,000',
    banks: ['First Data', 'Elavon'],
    riskScore: 'medium'
  },
  {
    id: '2',
    businessName: 'Natural Supplements Co.',
    submissionDate: '2025-04-08',
    status: 'pending',
    industry: 'Nutraceuticals',
    monthlyVolume: '$85,000',
    banks: ['Wells Fargo'],
    riskScore: 'low'
  },
  {
    id: '3',
    businessName: 'FitLife Subscription',
    submissionDate: '2025-04-05',
    status: 'complete',
    industry: 'Subscription Box',
    monthlyVolume: '$210,000',
    banks: ['Stripe', 'Authorize.net'],
    riskScore: 'low'
  },
  {
    id: '4',
    businessName: 'Premium Vapes',
    submissionDate: '2025-04-01',
    status: 'rejected',
    industry: 'Vape & E-cigarettes',
    monthlyVolume: '$65,000',
    banks: ['Chase'],
    riskScore: 'high'
  },
];

export const ApplicationsList: React.FC = () => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [applications] = useState(mockApplications);
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'complete':
        return <Badge className="bg-green-500">Complete</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getRiskBadge = (risk: string) => {
    switch(risk) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium Risk</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High Risk</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>
      
      {isMobile ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{app.businessName}</h3>
                  <p className="text-sm text-muted-foreground">{app.industry}</p>
                </div>
                {getStatusBadge(app.status)}
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Volume</p>
                  <p>{app.monthlyVolume}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Risk</p>
                  <div>{getRiskBadge(app.riskScore)}</div>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p>{app.submissionDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Banks</p>
                  <p>{app.banks.join(', ')}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm">
                  <Send className="h-4 w-4 mr-1" />
                  Submit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank(s)</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{app.businessName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{app.industry}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{app.monthlyVolume}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{app.submissionDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRiskBadge(app.riskScore)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{app.banks.join(', ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowUpRight className="mr-2 h-4 w-4" /> Send to Bank
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
