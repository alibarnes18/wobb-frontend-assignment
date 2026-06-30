import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

export interface SelectedProfile extends UserProfileSummary {
  platform: Platform;
  addedAt: number;
}

interface ListState {
  selectedProfiles: SelectedProfile[];
  addProfile: (profile: UserProfileSummary, platform: Platform) => void;
  removeProfile: (userId: string) => void;
  clearList: () => void;
  reorderProfiles: (startIndex: number, endIndex: number) => void;
  isProfileSelected: (userId: string) => boolean;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],

      addProfile: (profile, platform) => {
        const { selectedProfiles } = get();
        const exists = selectedProfiles.some((p) => p.user_id === profile.user_id);
        if (exists) return;

        const newProfile: SelectedProfile = {
          ...profile,
          platform,
          addedAt: Date.now(),
        };

        set({ selectedProfiles: [...selectedProfiles, newProfile] });
      },

      removeProfile: (userId) => {
        const { selectedProfiles } = get();
        set({
          selectedProfiles: selectedProfiles.filter((p) => p.user_id !== userId),
        });
      },

      clearList: () => set({ selectedProfiles: [] }),

      reorderProfiles: (startIndex, endIndex) => {
        const { selectedProfiles } = get();
        const result = Array.from(selectedProfiles);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        set({ selectedProfiles: result });
      },

      isProfileSelected: (userId) => {
        return get().selectedProfiles.some((p) => p.user_id === userId);
      },
    }),
    {
      name: "wobb-influencer-list", // localStorage key
    }
  )
);
