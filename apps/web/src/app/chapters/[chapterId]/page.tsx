"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CommentSection from "@/components/CommentsSection";
import { apiRequest } from "@/lib/api";

import {
  getReadingProgress,
  updateReadingProgress,
} from "@/lib/reading-progress";
import type { Chapter } from "@/types/chapter";

type Props = {
  params: Promise<{
    chapterId: string;
  }>;
};

export default function ChapterReaderPage({ params }: Props) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const maxProgressRef = useRef(0);
  const progressRestoredRef = useRef(false);

  useEffect(() => {
    async function loadChapter() {
      try {
        setLoading(true);
        setError("");

        const { chapterId } = await params;
        const result = await apiRequest<Chapter>(`/chapters/${chapterId}`);
        setChapter(result);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load chapter");
      } finally {
        setLoading(false);
      }
    }

    loadChapter();
  }, [params]);

  /*
   * Restore saved reading progress
   */
  useEffect(() => {
    if (!chapter) {
      return;
    }

    const currentChapter = chapter;
    let cancelled = false;

    maxProgressRef.current = 0;
    progressRestoredRef.current = false;

    async function restoreProgress() {
      try {
        const savedProgress = await getReadingProgress(
          currentChapter.novel.id,
        );

        if (cancelled) {
          return;
        }

        if (
          !savedProgress ||
          savedProgress.chapterId !== currentChapter.id
        ) {
          progressRestoredRef.current = true;
          return;
        }

        const progress = Math.min(
          Math.max(savedProgress.progress, 0),
          1,
        );

        maxProgressRef.current = progress;
        setReadingProgress(progress);

        requestAnimationFrame(() => {
          if (cancelled) {
            return;
          }

          const content = contentRef.current;
          if (!content) {
            progressRestoredRef.current = true;
            return;
          }

          const rect = content.getBoundingClientRect();
          const contentTop = window.scrollY + rect.top;
          const contentHeight = content.offsetHeight;
          const targetScroll =
            contentTop +
            contentHeight * progress -
            window.innerHeight;

          window.scrollTo({
            top: Math.max(0, targetScroll),
            behavior: "instant",
          });

          progressRestoredRef.current = true;
        });
      } catch (err) {
        console.error("Failed to restore reading progress:", err);
        progressRestoredRef.current = true;
      }
    }

    restoreProgress();

    return () => {
      cancelled = true;
    };
  }, [chapter]);

  /*
   * Reading progress tracking
   */
  useEffect(() => {
    if (!chapter) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    const saveProgress = () => {
      if (!progressRestoredRef.current) {
        return;
      }

      const content = contentRef.current;
      if (!content) {
        return;
      }

      const rect = content.getBoundingClientRect();
      const contentTop = window.scrollY + rect.top;
      const contentHeight = content.offsetHeight;

      if (contentHeight <= 0) {
        return;
      }

      const viewportBottom = window.scrollY + window.innerHeight;
      const distanceRead = viewportBottom - contentTop;

      const currentProgress = Math.min(
        Math.max(distanceRead / contentHeight, 0),
        1,
      );

      maxProgressRef.current = Math.max(
        maxProgressRef.current,
        currentProgress,
      );

      const maxProgress = maxProgressRef.current;
      setReadingProgress(maxProgress);

      if (maxProgress < 0.01) {
        return;
      }

      updateReadingProgress(
        chapter.novel.id,
        chapter.id,
        maxProgress,
      ).catch((err) => {
        console.error("Failed to save reading progress:", err);
      });
    };

    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        saveProgress();
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [chapter]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="flex flex-col items-center gap-3">
          <span className="h-6 w-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-sm">Loading chapter...</p>
        </div>
      </main>
    );
  }

  if (error || !chapter) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-20 text-slate-900 dark:text-slate-100 flex items-center justify-center transition-colors duration-200">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-8 text-center backdrop-blur-xl shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 mb-4">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Chapter unavailable</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {error || "We couldn't find this chapter."}
          </p>
          <Link
            href="/novels"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
          >
            Back to novels
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-200">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* Reader header with progress */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={`/novels/${chapter.novel.slug}`}
              className="group inline-flex items-center gap-2 min-w-0 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-white"
            >
              <svg
                className="h-4 w-4 shrink-0 transition group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="truncate">{chapter.novel.title}</span>
            </Link>

            <div className="shrink-0 text-right">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {Math.round(readingProgress * 100)}% completed
              </span>
            </div>
          </div>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300 shadow-sm shadow-blue-500/50"
              style={{
                width: `${readingProgress * 100}%`,
              }}
            />
          </div>
        </div>
      </header>

      {/* Reader Content Article */}
      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20 relative z-10">
        {/* Chapter heading */}
        <header className="mb-14 text-center border-b border-slate-200 dark:border-slate-900 pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Chapter {chapter.chapterNumber}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900 dark:text-white">
            {chapter.title}
          </h1>

          {chapter.novel.author.profile && (
            <p className="mt-4 text-xs font-medium text-slate-600 dark:text-slate-400">
              From{" "}
              <Link
                href={`/novels/${chapter.novel.slug}`}
                className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {chapter.novel.title}
              </Link>
              {" by "}
              <span className="text-slate-900 dark:text-slate-200">
                {chapter.novel.author.profile.displayName ??
                  chapter.novel.author.profile.username}
              </span>
            </p>
          )}

          {chapter.publishedAt && (
            <p className="mt-2 text-xs text-slate-500">
              Published on{" "}
              {new Date(chapter.publishedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </header>

        {/* Story content */}
        <div
          ref={contentRef}
          className="whitespace-pre-wrap text-lg leading-relaxed text-slate-700 dark:text-slate-300 sm:text-xl sm:leading-loose font-normal"
        >
          {chapter.content}
        </div>

        {/* Comments Section */}
        <div className="mt-20 border-t border-slate-200 dark:border-slate-900 pt-16">
          <CommentSection chapterId={chapter.id} />
        </div>

        {/* Chapter navigation footer */}
        <div className="mt-16 border-t border-slate-200 dark:border-slate-900 pt-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {chapter.previousChapter ? (
              <Link
                href={`/chapters/${chapter.previousChapter.id}`}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-slate-900/80 shadow-lg"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Previous chapter
                </p>
                <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  Chapter {chapter.previousChapter.chapterNumber}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white transition group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  ← {chapter.previousChapter.title}
                </p>
              </Link>
            ) : (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-slate-100/50 dark:bg-slate-950/40 p-5 opacity-40">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                  Previous chapter
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  You are at the beginning of the series
                </p>
              </div>
            )}

            {chapter.nextChapter ? (
              <Link
                href={`/chapters/${chapter.nextChapter.id}`}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-5 text-right backdrop-blur-xl transition hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-slate-900/80 shadow-lg"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Next chapter
                </p>
                <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                  Chapter {chapter.nextChapter.chapterNumber}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white transition group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {chapter.nextChapter.title} →
                </p>
              </Link>
            ) : (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-slate-100/50 dark:bg-slate-950/40 p-5 text-right opacity-40">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                  Next chapter
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  You have reached the latest chapter
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link
              href={`/novels/${chapter.novel.slug}`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              View all chapters in catalog
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}