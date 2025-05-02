import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CalendarIcon, CheckCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { addDays, format, isBefore, setHours, setMinutes, startOfDay } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { createCalendarEvent } from '@/services/calendar/calendarService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CalendarEvent } from '@/types/supabase-custom';

// Define available time slots (9AM to 5PM, 30 min intervals)
const AVAILABLE_HOURS = [9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5];

interface AppointmentBookingProps {
  adminEmail: string; // Email of the calendar owner
  adminAccessToken?: string; // Access token for the admin's calendar
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  adminEmail,
  adminAccessToken
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Date selection, 2: Time selection, 3: Contact info, 4: Confirmation
  const [error, setError] = useState<string | null>(null);
  const [disabledTimes, setDisabledTimes] = useState<number[]>([]);
  const [booked, setBooked] = useState(false);
  const [eventDetails, setEventDetails] = useState<any>(null);
  
  useEffect(() => {
    // Reset time selection when date changes
    setSelectedTime(null);
    
    // If we have a date selected, check for busy times
    if (selectedDate && adminAccessToken) {
      checkBusyTimes(selectedDate);
    }
  }, [selectedDate, adminAccessToken]);
  
  const checkBusyTimes = async (date: Date) => {
    try {
      // Get the start and end of the selected day
      const startTime = startOfDay(date).toISOString();
      const endTime = startOfDay(addDays(date, 1)).toISOString();
      
      // Call the API to get events for the selected day
      const { data } = await supabase.functions.invoke('google-calendar', {
        body: {
          action: 'freeBusy',
          accessToken: adminAccessToken,
          timeMin: startTime,
          timeMax: endTime
        }
      });
      
      if (data && data.calendars && data.calendars.primary && data.calendars.primary.busy) {
        const busyPeriods = data.calendars.primary.busy;
        
        // Calculate which time slots overlap with busy periods
        const disabled = AVAILABLE_HOURS.filter(slot => {
          // Convert slot to Date object for comparison
          const slotStart = new Date(date);
          const hour = Math.floor(slot);
          const minutes = (slot % 1) * 60;
          slotStart.setHours(hour, minutes, 0, 0);
          
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotStart.getMinutes() + 30);
          
          // Check if this slot overlaps with any busy period
          return busyPeriods.some((period: any) => {
            const busyStart = new Date(period.start);
            const busyEnd = new Date(period.end);
            
            // Slot overlaps if:
            // - slot starts during busy period (slotStart >= busyStart && slotStart < busyEnd)
            // - or busy period starts during slot (busyStart >= slotStart && busyStart < slotEnd)
            return (
              (slotStart >= busyStart && slotStart < busyEnd) ||
              (busyStart >= slotStart && busyStart < slotEnd)
            );
          });
        });
        
        // Also disable past times for today
        const now = new Date();
        if (date.toDateString() === now.toDateString()) {
          const currentHour = now.getHours();
          const currentMinutes = now.getMinutes();
          const currentTimeDecimal = currentHour + (currentMinutes / 60);
          
          // Disable time slots that are in the past (adding a small buffer)
          const pastTimes = AVAILABLE_HOURS.filter(
            slot => slot <= currentTimeDecimal + 0.25
          );
          
          setDisabledTimes([...disabled, ...pastTimes]);
        } else {
          setDisabledTimes(disabled);
        }
      }
    } catch (err) {
      console.error('Error checking busy times:', err);
      // If there's an error, we don't disable any times
      setDisabledTimes([]);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep(2);
    }
  };
  
  const handleTimeSelect = (time: number) => {
    setSelectedTime(time);
    setStep(3);
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || selectedTime === null || !name || !email) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const selectedDateTime = new Date(selectedDate);
      const hour = Math.floor(selectedTime);
      const minute = (selectedTime % 1) * 60;
      selectedDateTime.setHours(hour, minute, 0, 0);
      
      // End time is 30 minutes later
      const endDateTime = new Date(selectedDateTime);
      endDateTime.setMinutes(selectedDateTime.getMinutes() + 30);
      
      // Format the event
      const eventData = {
        summary: `Meeting with ${name}`,
        description: notes || `Meeting booked via website.`,
        start: {
          dateTime: selectedDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        attendees: [
          { email, displayName: name },
          { email: adminEmail }
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        }
      };
      
      // Create the event in Google Calendar
      const result = await createCalendarEvent(adminAccessToken!, eventData);
      
      if (result && result.id) {
        // Save the meeting in our database
        const calendarEvent: Partial<CalendarEvent> = {
          google_event_id: result.id,
          title: `Meeting with ${name}`,
          description: notes,
          start_time: selectedDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          attendees: [{ email, name }],
          meeting_link: result.hangoutLink,
          status: 'scheduled'
        };
        
        await supabase
          .from('calendar_events')
          .insert(calendarEvent as any);
        
        // Store details for confirmation screen
        setEventDetails({
          date: format(selectedDateTime, 'EEEE, MMMM d, yyyy'),
          time: format(selectedDateTime, 'h:mm a'),
          meetLink: result.hangoutLink
        });
        
        setBooked(true);
        setStep(4);
        toast.success('Appointment booked successfully');
      } else {
        throw new Error('Failed to create event');
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError('Failed to book appointment. Please try again later.');
      toast.error('Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };

  // Format time from decimal to display string (e.g. 9.5 -> "9:30 AM")
  const formatTime = (time: number) => {
    const hour = Math.floor(time);
    const minute = (time % 1) * 60;
    
    return format(
      setMinutes(setHours(new Date(), hour), minute),
      'h:mm a'
    );
  };
  
  // Disable dates in the past or more than 30 days in the future
  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 30);
    return isBefore(date, today) || date > maxDate;
  };
  
  // Render the booking steps
  const renderStepContent = () => {
    switch (step) {
      case 1: // Date selection
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">Select a Date</h3>
              <p className="text-sm text-muted-foreground">Pick a day for your appointment</p>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              className="rounded-md border mx-auto"
            />
          </div>
        );
        
      case 2: // Time selection
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">Select a Time</h3>
              <p className="text-sm text-muted-foreground">
                {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </p>
              <Button 
                variant="ghost" 
                className="mt-1 p-0 h-auto text-xs text-muted-foreground"
                onClick={handleBack}
              >
                Change date
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_HOURS.map((time) => {
                const isDisabled = disabledTimes.includes(time);
                return (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={`h-12 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !isDisabled && handleTimeSelect(time)}
                    disabled={isDisabled}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {formatTime(time)}
                  </Button>
                );
              })}
            </div>
          </div>
        );
        
      case 3: // Contact information
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">Your Contact Information</h3>
              <p className="text-sm text-muted-foreground">
                {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime !== null && formatTime(selectedTime)}
              </p>
              <Button 
                variant="ghost" 
                className="mt-1 p-0 h-auto text-xs text-muted-foreground"
                onClick={handleBack}
              >
                Change time
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Any specific topics you'd like to discuss"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="pt-2 space-x-3">
              <Button 
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </form>
        );
        
      case 4: // Confirmation
        return (
          <div className="space-y-4 text-center">
            <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-medium">Appointment Confirmed!</h3>
              <p className="text-muted-foreground mt-1">
                You'll receive an email confirmation shortly.
              </p>
            </div>
            
            {eventDetails && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{eventDetails.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{eventDetails.time}</span>
                    </div>
                    
                    {eventDetails.meetLink && (
                      <>
                        <Separator className="my-2" />
                        <div>
                          <span className="text-muted-foreground block text-sm mb-1">Meeting Link:</span>
                          <a 
                            href={eventDetails.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm break-all"
                          >
                            {eventDetails.meetLink}
                          </a>
                          <p className="text-xs text-muted-foreground mt-1">
                            This link will also be in your calendar invitation
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="pt-2">
              <Button 
                onClick={() => {
                  // Reset everything for a new booking
                  setSelectedDate(undefined);
                  setSelectedTime(null);
                  setName('');
                  setEmail('');
                  setNotes('');
                  setBooked(false);
                  setStep(1);
                }}
              >
                Book Another Appointment
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Schedule an Appointment
        </CardTitle>
        <CardDescription>
          Book a 30-minute consultation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!adminAccessToken ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Calendar not configured</AlertTitle>
            <AlertDescription>
              The booking system is not properly configured. Please contact the administrator.
            </AlertDescription>
          </Alert>
        ) : renderStepContent()}
      </CardContent>
    </Card>
  );
};

export default AppointmentBooking;
