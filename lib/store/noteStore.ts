import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

export type NoteDraft = {
  title: string;
  content: string;
  tag: NoteTag;
};

export const initialDraft: NoteDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteStoreState = {
  draft: NoteDraft;
  setDraft: (note: Partial<NoteDraft>) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStoreState>()(
  persist(
    (set) => ({
      draft: initialDraft,

      setDraft: (note) =>
        set((state) => ({
          draft: { ...state.draft, ...note },
        })),

      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "notehub_draft",
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);