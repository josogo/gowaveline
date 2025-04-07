
import React, { useState, useEffect } from 'react';
import AppointmentBooking from '@/components/admin/calendar/AppointmentBooking';
import { supabase } from '@/integrations/supabase/client';

const Booking = () => {
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminToken, setAdminToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you'd have a specific admin account 
    // or fetch this info from a settings table
    const getAdminCredentials = async () => {
      try {
        // For demo purposes, we'll get a token from the edge function
        const { data, error } = await supabase.functions.invoke('get-gmail-credentials', {
          body: { action: 'getBookingCredentials' }
        });
        
        if (error) {
          console.error('Error getting admin credentials:', error);
          return;
        }
        
        if (data?.email && data?.accessToken) {
          setAdminEmail(data.email);
          setAdminToken(data.accessToken);
        }
      } catch (err) {
        console.error('Error loading booking page:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    getAdminCredentials();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fa] py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3 text-[#0EA5E9]">Schedule a Consultation</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Select a date and time that works for you, and we'll be in touch to discuss how we can help your business.
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading booking calendar...</p>
          </div>
        ) : adminEmail && adminToken ? (
          <AppointmentBooking 
            adminEmail={adminEmail}
            adminAccessToken={adminToken}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-red-500 mb-2">Unable to load booking calendar</p>
            <p>Please contact us directly to schedule an appointment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
