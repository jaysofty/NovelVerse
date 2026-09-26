export type ChapterNavigation = {
  id: string;
  title: string;
  chapterNumber: number;
};

export type Chapter = {
  id: string;
  title: string;
  chapterNumber: number;
  content: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;

  novel: {
    id: string;
    title: string;
    slug: string;

    author: {
      profile: {
        username: string;
        displayName: string | null;
      } | null;
    };
  };

  previousChapter?: ChapterNavigation | null;
  nextChapter?: ChapterNavigation | null;
};