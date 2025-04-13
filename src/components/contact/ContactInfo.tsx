
import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const ContactInfo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-4 sm:mb-6">Contact Information</h2>
      
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Mail className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-[#0EA5E9] text-sm sm:text-base">Email Us</h3>
            <p className="text-gray-600 break-words">info@gowaveline.com</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Phone className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-[#0EA5E9] text-sm sm:text-base">Call Us</h3>
            <p className="text-gray-600">(805) 586-3591</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 sm:space-x-4">
          <MapPin className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-[#0EA5E9] text-sm sm:text-base">Office Location</h3>
            <p className="text-gray-600">
              Venice Beach<br />
              California
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Clock className="w-5 sm:w-6 h-5 sm:h-6 text-orange-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-[#0EA5E9] text-sm sm:text-base">Business Hours</h3>
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
