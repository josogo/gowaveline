
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStoredGmailTokens } from '@/services/gmail/storageService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GmailConnectPrompt from '../gmail/GmailConnectPrompt';
import CalendarView from './CalendarView';
import AppointmentBooking from './AppointmentBooking';

const CalendarIntegration = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if the user is authenticated with Google
  useEffect(() => {
    const tokens = getStoredGmailTokens();
    const storedProfile = localStorage.getItem('gmail_user_profile');
    
    if (tokens?.accessToken) {
      setIsAuthenticated(true);
      if (storedProfile) {
        try {
          setUserProfile(JSON.parse(storedProfile));
        } catch (err) {
          console.error('Error parsing user profile:', err);
        }
      }
    }
    
    setIsLoading(false);
  }, []);
  
  const handleAuthenticate = async () => {
    // Reuse the Gmail auth flow
    try {
      setIsLoading(true);
      setError(null);
      
      // This will redirect to Google's OAuth page
      // On return, the Gmail integration will handle the authentication
      const authUrl = await fetch('/api/auth/google/url').then(res => res.json());
      window.location.href = authUrl.url;
    } catch (err) {
      console.error('Google auth error:', err);
      setError('Failed to initiate Google authentication');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Google Calendar Integration</h1>
          <p className="text-muted-foreground">
            Connect your Google Calendar to manage meetings and appointments
          </p>
        </div>
        
        <GmailConnectPrompt 
          isLoading={isLoading}
          handleAuthenticate={handleAuthenticate}
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Google Calendar Integration</h1>
          <p className="text-muted-foreground">
            Manage meetings and appointments with Google Calendar
          </p>
        </div>
        
        {userProfile && (
          <div className="flex items-center gap-2">
            {userProfile.picture && (
              <img 
                src={userProfile.picture} 
                alt={userProfile.name || userProfile.email} 
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="text-sm">
              <p className="font-medium">{userProfile.name || 'User'}</p>
              <p className="text-muted-foreground">{userProfile.email}</p>
            </div>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="booking">Booking Page</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-6 pt-6">
          <CalendarView />
        </TabsContent>
        
        <TabsContent value="booking" className="space-y-6 pt-6">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Booking Page Preview</AlertTitle>
            <AlertDescription>
              This is a preview of how your booking page will appear to clients.
              <br />
              You can embed this page on your website or share the direct link.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center">
            <AppointmentBooking 
              adminEmail={userProfile?.email || ''} 
              adminAccessToken={getStoredGmailTokens()?.accessToken}
            />
          </div>
          
          <div className="border-t pt-6 mt-8">
            <h3 className="text-lg font-medium mb-3">Embedding Options</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Share Direct Link</h4>
                <code className="text-xs bg-muted p-2 rounded block overflow-auto">
                  {window.location.origin}/booking
                </code>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/booking`);
                    alert('Link copied to clipboard!');
                  }}
                >
                  Copy Link
                </Button>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Embed via iFrame</h4>
                <code className="text-xs bg-muted p-2 rounded block overflow-auto whitespace-pre-wrap">
                  {`<iframe 
  src="${window.location.origin}/booking" 
  width="100%" 
  height="600px" 
  frameBorder="0"
></iframe>`}
                </code>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(`<iframe src="${window.location.origin}/booking" width="100%" height="600px" frameBorder="0"></iframe>`);
                    alert('iFrame code copied to clipboard!');
                  }}
                >
                  Copy iFrame
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-medium">Google Account</h3>
                <p className="text-sm text-muted-foreground">
                  {userProfile?.email || 'Connected to Google Calendar'}
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('gmail_tokens');
                  localStorage.removeItem('gmail_user_profile');
                  setIsAuthenticated(false);
                  setUserProfile(null);
                }}
              >
                Disconnect
              </Button>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Calendar Sync Settings</h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    Auto-sync interval
                    <p className="text-xs text-muted-foreground">
                      How often to check for calendar changes
                    </p>
                  </div>
                  <select className="border rounded p-1 text-sm">
                    <option>5 minutes</option>
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Booking Page Settings</h3>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    Appointment duration
                  </div>
                  <select className="border rounded p-1 text-sm">
                    <option>15 minutes</option>
                    <option selected>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    Advance notice required
                  </div>
                  <select className="border rounded p-1 text-sm">
                    <option>None</option>
                    <option>1 hour</option>
                    <option selected>24 hours</option>
                    <option>48 hours</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    Maximum booking window
                  </div>
                  <select className="border rounded p-1 text-sm">
                    <option>7 days</option>
                    <option>14 days</option>
                    <option selected>30 days</option>
                    <option>60 days</option>
                  </select>
                </div>
                
                <div className="mt-2">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarIntegration;
