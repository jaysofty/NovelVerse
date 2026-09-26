import { create } from "zustand";

type NovelDraftState = {
  title: string;
  description: string;
  visibility: "PRIVATE" | "PUBLIC";

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setVisibility: (
    visibility: "PRIVATE" | "PUBLIC",
  ) => void;

  reset: () => void;
};

export const useNovelStore = create<NovelDraftState>(
  (set) => ({
    title: "",
    description: "",
    visibility: "PRIVATE",

    setTitle: (title) =>
      set({ title }),

    setDescription: (description) =>
      set({ description }),

    setVisibility: (visibility) =>
      set({ visibility }),

    reset: () =>
      set({
        title: "",
        description: "",
        visibility: "PRIVATE",
      }),
  }),
);