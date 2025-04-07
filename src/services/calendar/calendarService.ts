
import { supabase } from '@/integrations/supabase/client';
import { getStoredGmailTokens } from '../gmail/storageService';

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  conferenceData?: {
    createRequest?: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      }
    }
  };
}

/**
 * Create an event in Google Calendar
 */
export const createCalendarEvent = async (
  accessToken: string, 
  eventData: CalendarEvent
): Promise<any> => {
  try {
    console.log("Creating calendar event:", eventData);
    
    const { data, error } = await supabase.functions.invoke('google-calendar', {
      body: { 
        action: 'create',
        accessToken,
        event: eventData
      }
    });

    if (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create calendar event');
    }

    return data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

/**
 * Get events from Google Calendar
 */
export const getCalendarEvents = async (
  accessToken: string, 
  timeMin?: string,
  timeMax?: string,
  syncToken?: string
): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar', {
      body: { 
        action: 'list',
        accessToken,
        timeMin,
        timeMax,
        syncToken
      }
    });

    if (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }

    return data;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};

/**
 * Update an event in Google Calendar
 */
export const updateCalendarEvent = async (
  accessToken: string, 
  eventId: string,
  eventData: Partial<CalendarEvent>
): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar', {
      body: { 
        action: 'update',
        accessToken,
        eventId,
        event: eventData
      }
    });

    if (error) {
      console.error('Error updating calendar event:', error);
      throw new Error('Failed to update calendar event');
    }

    return data;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw error;
  }
};

/**
 * Delete an event from Google Calendar
 */
export const deleteCalendarEvent = async (
  accessToken: string, 
  eventId: string
): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar', {
      body: { 
        action: 'delete',
        accessToken,
        eventId
      }
    });

    if (error) {
      console.error('Error deleting calendar event:', error);
      throw new Error('Failed to delete calendar event');
    }

    return data;
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw error;
  }
};

/**
 * Get free/busy information for a calendar
 */
export const getFreeBusyInfo = async (
  accessToken: string,
  timeMin: string,
  timeMax: string
): Promise<any> => {
  try {
    const { data, error } = await supabase.functions.invoke('google-calendar', {
      body: {
        action: 'freeBusy',
        accessToken,
        timeMin,
        timeMax
      }
    });

    if (error) {
      console.error('Error fetching free/busy info:', error);
      throw new Error('Failed to fetch free/busy information');
    }

    return data;
  } catch (error) {
    console.error('Error fetching free/busy info:', error);
    throw error;
  }
};

/**
 * Sync calendar events with local database
 */
export const syncCalendarEvents = async (): Promise<boolean> => {
  try {
    // Get the stored tokens
    const tokens = getStoredGmailTokens();
    if (!tokens || !tokens.accessToken) {
      console.error("No access token available for calendar sync");
      return false;
    }

    // Get the last sync token from database (or local storage for demo)
    const lastSyncToken = localStorage.getItem('calendar_sync_token') || undefined;
    
    // Fetch events from Google Calendar
    const eventsData = await getCalendarEvents(tokens.accessToken, undefined, undefined, lastSyncToken);
    
    if (!eventsData || !eventsData.items) {
      console.error("Failed to fetch calendar events for sync");
      return false;
    }
    
    // Store the new sync token
    if (eventsData.nextSyncToken) {
      localStorage.setItem('calendar_sync_token', eventsData.nextSyncToken);
    }
    
    // Process the events (create/update/delete in local database)
    for (const event of eventsData.items) {
      if (event.status === 'cancelled') {
        // Handle deleted events
        await supabase.from('calendar_events').delete().eq('google_event_id', event.id);
      } else if (event.updated) {
        // Check if the event exists in our database
        const { data: existingEvent } = await supabase
          .from('calendar_events')
          .select('*')
          .eq('google_event_id', event.id)
          .maybeSingle();
        
        if (existingEvent) {
          // Update existing event
          await supabase
            .from('calendar_events')
            .update({
              title: event.summary,
              description: event.description,
              start_time: event.start.dateTime || event.start.date,
              end_time: event.end.dateTime || event.end.date,
              attendees: event.attendees || [],
              meeting_link: event.hangoutLink || null
            })
            .eq('google_event_id', event.id);
        } else {
          // Insert new event
          await supabase
            .from('calendar_events')
            .insert({
              google_event_id: event.id,
              title: event.summary,
              description: event.description,
              start_time: event.start.dateTime || event.start.date,
              end_time: event.end.dateTime || event.end.date,
              attendees: event.attendees || [],
              meeting_link: event.hangoutLink || null,
              status: 'confirmed'
            });
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing calendar events:', error);
    return false;
  }
};
