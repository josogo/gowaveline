
import React, { useState, useEffect } from 'react';
import { format, addDays, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Calendar as CalendarIcon, Plus, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getStoredGmailTokens } from '@/services/gmail/storageService';
import { getCalendarEvents, syncCalendarEvents } from '@/services/calendar/calendarService';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import CalendarEventDialog from './CalendarEventDialog';

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
  attendees?: Array<{email: string, displayName?: string}>;
  google_event_id?: string;
  meeting_link?: string;
}

const CalendarView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const formattedDate = format(selectedDate, 'MMM dd, yyyy');
  const tokens = getStoredGmailTokens();

  // Query to fetch calendar events
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['calendarEvents', selectedDate],
    queryFn: async () => {
      if (!tokens?.accessToken) {
        throw new Error('No access token available');
      }
      
      const startDate = startOfDay(selectedDate).toISOString();
      const endDate = startOfDay(addDays(selectedDate, 1)).toISOString();
      
      try {
        return await getCalendarEvents(tokens.accessToken, startDate, endDate);
      } catch (err) {
        console.error("Error fetching calendar events:", err);
        throw err;
      }
    },
    enabled: !!tokens?.accessToken,
  });

  useEffect(() => {
    if (data?.items) {
      // Transform Google Calendar events to our format
      const formattedEvents = data.items.map((event: any) => ({
        id: event.id,
        title: event.summary,
        start_time: event.start.dateTime || event.start.date,
        end_time: event.end.dateTime || event.end.date,
        description: event.description,
        attendees: event.attendees,
        google_event_id: event.id,
        meeting_link: event.hangoutLink
      }));
      setEvents(formattedEvents);
    }
  }, [data]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const success = await syncCalendarEvents();
      if (success) {
        toast.success("Calendar synced successfully");
        refetch();
      } else {
        toast.error("Failed to sync calendar");
      }
    } catch (err) {
      console.error("Error syncing calendar:", err);
      toast.error("Error syncing calendar");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (refreshNeeded = false) => {
    setIsDialogOpen(false);
    if (refreshNeeded) {
      refetch();
    }
  };

  if (!tokens?.accessToken) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Google Calendar not connected</AlertTitle>
        <AlertDescription>
          You need to connect your Google account to use Calendar features.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Calendar</h2>
          <p className="text-muted-foreground">View and manage your events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSync}
            disabled={isSyncing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Calendar
          </Button>
          <Button onClick={handleCreateEvent} className="gap-2">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>{formattedDate}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : "Failed to load events"}
                </AlertDescription>
              </Alert>
            ) : events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => handleEditEvent(event)}
                  >
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                    </div>
                    {event.meeting_link && (
                      <div className="text-sm mt-1">
                        <a 
                          href={event.meeting_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-500 hover:underline"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No events scheduled for this day
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CalendarEventDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        event={selectedEvent}
      />
    </div>
  );
};

export default CalendarView;
