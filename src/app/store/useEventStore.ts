import { create } from "zustand";
import { supabase } from "../utils/supabase";

export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  //   extendedProps: {
  partnerName: string;
  partnerColor: string;
  //   };
}

interface EventStore {
  events: Event[];
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, "id">) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  fetchEvents: async () => {
    const { data, error } = await supabase.from("events").select("*");
    if (error) {
      console.error("Error fetching events:", error);
    } else {
      const formattedEvents =
        data?.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          //   extendedProps: {
          partnerName: event.partnerName,
          partnerColor: event.partnerColor,
          //   },
        })) || [];
      set({ events: formattedEvents });
      //   set({ events: data || [] });
    }
  },
  addEvent: async (event: Omit<Event, "id">) => {
    const { data, error } = await supabase
      .from("events")
      .insert([event])
      .select();
    if (error) {
      console.error("Error adding event:", error);
      throw error;
    } else if (data) {
      set((state) => ({ events: [...state.events, data[0] as Event] }));
    }
  },
  //   addEvent: async (event) => {
  //     const { data, error } = await supabase
  //       .from("events")
  //       .insert([event])
  //       .select();
  //     if (error) {
  //       console.error("Error adding event:", error);
  //     } else if (data) {
  //       set((state) => ({ events: [...state.events, data[0]] }));
  //     }
  //   },
  updateEvent: async (id, event) => {
    const { error } = await supabase.from("events").update(event).eq("id", id);
    if (error) {
      console.error("Error updating event:", error);
    } else {
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
      }));
    }
  },
  deleteEvent: async (id) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      console.error("Error deleting event:", error);
    } else {
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
      }));
    }
  },
}));
