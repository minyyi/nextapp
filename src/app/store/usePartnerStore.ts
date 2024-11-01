import { create } from "zustand";
// import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabase";

export interface Partner {
  id: string;
  name: string;
  hourlyRate: number;
  color: string;
}

interface PartnerStore {
  partners: Partner[];
  addPartner: (partner: Omit<Partner, "id">) => void;
  //   updatePartner: (id: string, partner: Partial<Partner>) => void;
  deletePartner: (id: string) => void;
  fetchPartners: () => Promise<void>;
}

export const usePartnerStore = create<PartnerStore>((set) => ({
  partners: [],
  fetchPartners: async () => {
    const { data, error } = await supabase.from("partners").select("*");
    if (error) {
      console.error("Error fetching partners:", error);
    } else {
      set({ partners: data || [] });
    }
  },
  addPartner: async (partner) => {
    const { data, error } = await supabase
      .from("partners")
      .insert([partner])
      .select();
    if (error) {
      console.error("Error adding partner:", error);
    } else if (data) {
      set((state) => ({ partners: [...state.partners, data[0]] }));
    }
  },
  deletePartner: async (id) => {
    const { error } = await supabase.from("partners").delete().match({ id });
    if (error) {
      console.error("Error deleting partner:", error);
    } else {
      set((state) => ({
        partners: state.partners.filter((p) => p.id !== id),
      }));
    }
  },
}));

// export const usePartnerStore = create<PartnerStore>((set) => ({
//   partners: [],
//   addPartner: (partner) =>
//     set((state) => ({
//       partners: [...state.partners, { ...partner, id: uuidv4() }],
//     })),
//   updatePartner: (id, updatedPartner) =>
//     set((state) => ({
//       partners: state.partners.map((p) =>
//         p.id === id ? { ...p, ...updatedPartner } : p
//       ),
//     })),
//   deletePartner: (id) =>
//     set((state) => ({
//       partners: state.partners.filter((partner) => partner.id !== id),
//     })),
// }));
