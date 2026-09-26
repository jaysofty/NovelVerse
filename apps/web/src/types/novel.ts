export type Novel = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "COMPLETED";
  visibility: "PUBLIC" | "PRIVATE";
  publishedAt: string | null;

  author: {
    id: string;
    profile: {
      username: string;
      displayName: string | null;
      avatarUrl: string | null;
    } | null;
  };

  genres: {
    id: string;
    name: string;
    slug: string;
  }[];

  _count?: {
    chapters: number;
    likes: number;
    bookmarks: number;
  };
};

export type ChapterSummary = {
  id: string;
  title: string;
  chapterNumber: number;
  publishedAt: string | null;
  createdAt: string;
};

export type NovelDetails = Omit<Novel, "_count"> & {
  chapters: ChapterSummary[];
};