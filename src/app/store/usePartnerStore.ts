import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface Partner {
  id: string;
  name: string;
  hourlyRate: number;
  color: string;
  user_id?: string;
}

interface PartnerStore {
  partners: Partner[];
  fetchPartners: () => Promise<void>;
  addPartner: (partner: Omit<Partner, "id">) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
}

export const usePartnerStore = create<PartnerStore>((set) => ({
  partners: [],
  fetchPartners: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user_id = session?.user?.id;

    if (!user_id) {
      console.error("No user logged in");
      return;
    }

    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("user_id", user_id); // Filter by user_id

    if (error) {
      console.error("Error fetching partners:", error);
    } else {
      set({ partners: data || [] });
    }
  },
  addPartner: async (partner) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user_id = session?.user?.id;

    if (!user_id) {
      console.error("No user logged in");
      return;
    }

    const { data, error } = await supabase
      .from("partners")
      .insert([{ ...partner, user_id }])
      .select();

    if (error) {
      console.error("Error adding partner:", error);
    } else if (data) {
      set((state) => ({ partners: [...state.partners, data[0]] }));
    }
  },
  deletePartner: async (id) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user_id = session?.user?.id;

    if (!user_id) {
      console.error("No user logged in");
      return;
    }

    const { error } = await supabase
      .from("partners")
      .delete()
      .eq("id", id)
      .eq("user_id", user_id); // Ensure user owns this partner

    if (error) {
      console.error("Error deleting partner:", error);
    } else {
      set((state) => ({
        partners: state.partners.filter((p) => p.id !== id),
      }));
    }
  },
}));
