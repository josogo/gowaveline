
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { getStoredGmailTokens } from '@/services/gmail/storageService';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '@/services/calendar/calendarService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CalendarEvent } from '@/types/supabase-custom';

interface CalendarEventDialogProps {
  isOpen: boolean;
  onClose: (refreshNeeded?: boolean) => void;
  event: any | null;
}

const CalendarEventDialog: React.FC<CalendarEventDialogProps> = ({ 
  isOpen, 
  onClose,
  event 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [attendees, setAttendees] = useState('');
  const [createMeetLink, setCreateMeetLink] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      
      const startDateTime = new Date(event.start_time);
      setStartDate(startDateTime.toISOString().split('T')[0]);
      setStartTime(startDateTime.toTimeString().substring(0, 5));
      
      const endDateTime = new Date(event.end_time);
      setEndDate(endDateTime.toISOString().split('T')[0]);
      setEndTime(endDateTime.toTimeString().substring(0, 5));
      
      if (event.attendees && Array.isArray(event.attendees)) {
        setAttendees(event.attendees.map((a: any) => a.email).join(', '));
      } else {
        setAttendees('');
      }
      
      setCreateMeetLink(!!event.meeting_link);
    } else {
      // Default values for new event
      setTitle('');
      setDescription('');
      
      const now = new Date();
      setStartDate(now.toISOString().split('T')[0]);
      
      // Round to next half hour
      const minutes = now.getMinutes();
      const roundedMinutes = minutes < 30 ? 30 : 0;
      const hours = minutes < 30 ? now.getHours() : now.getHours() + 1;
      setStartTime(`${String(hours).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`);
      
      // End time is 1 hour after start time
      const endTime = new Date(now);
      endTime.setHours(hours + 1);
      endTime.setMinutes(roundedMinutes);
      setEndDate(endTime.toISOString().split('T')[0]);
      setEndTime(`${String(endTime.getHours()).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`);
      
      setAttendees('');
      setCreateMeetLink(true);
    }
  }, [event, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const tokens = getStoredGmailTokens();
      if (!tokens?.accessToken) {
        setError('No access token available. Please reconnect your Google account.');
        setIsLoading(false);
        return;
      }
      
      // Format start and end times
      const startDateTime = `${startDate}T${startTime}:00`;
      const endDateTime = `${endDate}T${endTime}:00`;
      
      // Parse attendees
      const attendeesList = attendees.split(',').map(email => ({
        email: email.trim()
      })).filter(a => a.email);
      
      // Create event object
      const eventData: any = {
        summary: title,
        description,
        start: {
          dateTime: startDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: endDateTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        attendees: attendeesList.length > 0 ? attendeesList : undefined
      };
      
      // Add conference data if requested
      if (createMeetLink) {
        eventData.conferenceData = {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        };
      }
      
      let result;
      if (event) {
        // Update existing event
        result = await updateCalendarEvent(
          tokens.accessToken,
          event.google_event_id,
          eventData
        );
        
        // Update in database
        const calendarEventUpdate: Partial<CalendarEvent> = {
          title,
          description,
          start_time: startDateTime,
          end_time: endDateTime,
          attendees: attendeesList
        };
        
        await supabase
          .from('calendar_events')
          .update(calendarEventUpdate as any)
          .eq('google_event_id', event.google_event_id);
          
        toast.success('Event updated successfully');
      } else {
        // Create new event
        result = await createCalendarEvent(tokens.accessToken, eventData);
        
        // Save to database
        if (result && result.id) {
          const newCalendarEvent: Partial<CalendarEvent> = {
            google_event_id: result.id,
            title,
            description,
            start_time: startDateTime,
            end_time: endDateTime,
            attendees: attendeesList,
            meeting_link: result.hangoutLink,
            status: 'scheduled'
          };
          
          await supabase
            .from('calendar_events')
            .insert(newCalendarEvent as any);
        }
        
        toast.success('Event created successfully');
      }
      
      onClose(true);
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err instanceof Error ? err.message : 'Failed to save event');
      toast.error('Failed to save event');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!event || !event.google_event_id) return;
    
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const tokens = getStoredGmailTokens();
      if (!tokens?.accessToken) {
        setError('No access token available. Please reconnect your Google account.');
        setIsLoading(false);
        return;
      }
      
      // Delete from Google Calendar
      await deleteCalendarEvent(tokens.accessToken, event.google_event_id);
      
      // Delete from database
      await supabase
        .from('calendar_events')
        .delete()
        .eq('google_event_id', event.google_event_id);
      
      toast.success('Event deleted successfully');
      onClose(true);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      toast.error('Failed to delete event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event Title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event Description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attendees">Attendees (comma separated emails)</Label>
            <Input
              id="attendees"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="createMeetLink" 
              checked={createMeetLink} 
              onCheckedChange={(checked) => setCreateMeetLink(!!checked)}
            />
            <Label htmlFor="createMeetLink">Create Google Meet link</Label>
          </div>
          
          <DialogFooter className="pt-4">
            {event && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="mr-auto"
              >
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onClose()} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarEventDialog;
