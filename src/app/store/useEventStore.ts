import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  partnerName: string;
  partnerColor: string;
  user_id?: string;
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
    // Get current user
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user_id = session?.user?.id;

    if (!user_id) {
      console.error("No user logged in");
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", user_id); // Filter by user_id

    if (error) {
      console.error("Error fetching events:", error);
    } else {
      const formattedEvents =
        data?.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          partnerName: event.partnerName,
          partnerColor: event.partnerColor,
          user_id: event.user_id,
        })) || [];
      set({ events: formattedEvents });
    }
  },
  addEvent: async (event: Omit<Event, "id">) => {
    // 세션 확인 로그
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("Current session:", session); // 세션 정보 확인

    const user_id = session?.user?.id;
    console.log("User ID:", user_id); // 사용자 ID 확인

    if (!user_id) {
      console.error("No user logged in");
      return;
    }

    try {
      // 이벤트 데이터에 user_id 추가
      const eventWithUserId = {
        ...event,
        user_id,
      };

      console.log("Attempting to insert event with data:", eventWithUserId); // 삽입할 데이터 확인

      const { data, error } = await supabase
        .from("events")
        .insert([eventWithUserId])
        .select();

      if (error) {
        console.error("Error adding event:", error);
        throw error;
      } else if (data) {
        console.log("Successfully inserted event:", data); // 성공적으로 삽입된 데이터 확인
        set((state) => ({ events: [...state.events, data[0] as Event] }));
      }
    } catch (error) {
      console.error("Error in addEvent:", error);
      throw error;
    }
  },
  // addEvent: async (event: Omit<Event, "id">) => {
  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession();
  //   const user_id = session?.user?.id;

  //   if (!user_id) {
  //     console.error("No user logged in");
  //     return;
  //   }

  //   const { data, error } = await supabase
  //     .from("events")
  //     .insert([{ ...event, user_id }])
  //     .select();

  //   if (error) {
  //     console.error("Error adding event:", error);
  //     throw error;
  //   } else if (data) {
  //     set((state) => ({ events: [...state.events, data[0] as Event] }));
  //   }
  // },
  updateEvent: async (id, event) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user_id = session?.user?.id;

    if (!user_id) {
      console.error("No user logged in");
      return;
    }

    const { error } = await supabase
      .from("events")
      .update(event)
      .eq("id", id)
      .eq("user_id", user_id); // Ensure user owns this event

    if (error) {
      console.error("Error updating event:", error);
    } else {
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
      }));
    }
  },
  deleteEvent: async (id) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user_id = session?.user?.id;

    if (!user_id) {
      console.error("No user logged in");
      return;
    }

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)
      .eq("user_id", user_id); // Ensure user owns this event

    if (error) {
      console.error("Error deleting event:", error);
    } else {
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
      }));
    }
  },
}));
