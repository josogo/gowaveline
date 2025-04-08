
import React from 'react';
import { Calendar, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCrmData } from '@/contexts/CrmDataContext';
import { useNavigate } from 'react-router-dom';
import { Contact } from '../types';

interface ContactInfoProps {
  contactId: string;
  name: string;
  email: string;
  phone: string;
  lastContact?: string;
  relatedDeals?: string[];
}

// Add a new interface to accept a contact object directly
interface ContactInfoWithObjectProps {
  contact: Contact;
}

// The component now accepts either individual props or a contact object
export const ContactInfo: React.FC<ContactInfoProps | ContactInfoWithObjectProps> = (props) => {
  const { deals } = useCrmData();
  const navigate = useNavigate();
  
  // Determine if we're working with a contact object or individual props
  const isContactObject = 'contact' in props;
  
  // Extract the needed properties based on which props format we received
  const contactId = isContactObject ? props.contact.id : props.contactId;
  const name = isContactObject ? props.contact.name : props.name;
  const email = isContactObject ? props.contact.email : props.email;
  const phone = isContactObject ? props.contact.phone : props.phone;
  const lastContact = isContactObject ? props.contact.lastContact : props.lastContact;
  const relatedDeals = isContactObject ? props.contact.relatedDeals : props.relatedDeals;
  
  // Get related deals info
  const relatedDealsInfo = deals.filter(deal => 
    relatedDeals?.includes(deal.id)
  );
  
  const handleViewDeal = (dealId: string) => {
    navigate(`/admin/deals?dealId=${dealId}`);
  };
  
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-medium">{name}</h3>
      </div>
      
      <div className="text-sm space-y-1 text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>📧</span>
          <a 
            href={`mailto:${email}`} 
            className="hover:text-blue-500 transition-colors"
          >
            {email}
          </a>
        </div>
        
        <div className="flex items-center gap-2">
          <span>📞</span>
          <a 
            href={`tel:${phone}`} 
            className="hover:text-blue-500 transition-colors"
          >
            {phone}
          </a>
        </div>
        
        {lastContact && (
          <div className="flex items-center gap-2 pt-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Last Contact: {new Date(lastContact).toLocaleDateString()}</span>
          </div>
        )}
        
        {relatedDealsInfo && relatedDealsInfo.length > 0 && (
          <div className="pt-2">
            <div className="text-sm font-medium mb-1">Deals:</div>
            <div className="space-y-1">
              {relatedDealsInfo.map(deal => (
                <div key={deal.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-sm">
                  <div className="flex items-center gap-1">
                    <span>{deal.name}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 rounded px-1">
                      ${deal.value.toLocaleString()}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleViewDeal(deal.id)}
                  >
                    <Link className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
