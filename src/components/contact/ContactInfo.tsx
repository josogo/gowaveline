
import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactInfo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 className="text-2xl font-bold text-orange-500 mb-6">Contact Information</h2>
      
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <Mail className="w-6 h-6 text-orange-500 mt-1" />
          <div>
            <h3 className="font-medium text-[#0EA5E9]">Email Us</h3>
            <p className="text-gray-600">info@gowaveline.com</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <Phone className="w-6 h-6 text-orange-500 mt-1" />
          <div>
            <h3 className="font-medium text-[#0EA5E9]">Call Us</h3>
            <p className="text-gray-600">(805) 586-3591</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <MapPin className="w-6 h-6 text-orange-500 mt-1" />
          <div>
            <h3 className="font-medium text-[#0EA5E9]">Office Location</h3>
            <p className="text-gray-600">
              5100 California Ave<br />
              Suite 200<br />
              Bakersfield, CA 93309
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-4">
          <Clock className="w-6 h-6 text-orange-500 mt-1" />
          <div>
            <h3 className="font-medium text-[#0EA5E9]">Business Hours</h3>
            <p className="text-gray-600">
              Monday - Friday<br />
              9:00 AM - 5:00 PM PST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
