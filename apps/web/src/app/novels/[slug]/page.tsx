"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import BookmarkButton from "@/components/BookmarkButton";
import LikeButton from "@/components/LikeButton";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import {
  getReadingProgress,
  type ReadingProgress,
} from "@/lib/reading-progress";
import type { NovelDetails } from "@/types/novel";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default function NovelDetailsPage({ params }: Props) {
  const [novel, setNovel] = useState<NovelDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chapterSearch, setChapterSearch] = useState("");

  const [readingProgress, setReadingProgress] =
    useState<ReadingProgress | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    async function loadNovel() {
      try {
        const { slug } = await params;

        const result = await apiRequest<NovelDetails>(
          `/novels/${slug}`,
        );

        setNovel(result);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load novel",
        );
      } finally {
        setLoading(false);
      }
    }

    loadNovel();
  }, [params]);

  /*
   * Load the user's saved reading progress
   */
  useEffect(() => {
    if (!novel || authLoading || !user) {
      return;
    }

    let cancelled = false;

    async function loadReadingProgress() {
      try {
        setProgressLoading(true);

        const savedProgress = await getReadingProgress(
          novel!.id,
        );

        if (cancelled) {
          return;
        }

        /*
         * Only show progress if the saved chapter
         * actually belongs to this novel.
         */
        if (
          savedProgress &&
          savedProgress.novelId === novel!.id
        ) {
          setReadingProgress(savedProgress);
        } else {
          setReadingProgress(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Failed to load reading progress:",
            err,
          );

          setReadingProgress(null);
        }
      } finally {
        if (!cancelled) {
          setProgressLoading(false);
        }
      }
    }

    loadReadingProgress();

    return () => {
      cancelled = true;
    };
  }, [novel, user, authLoading]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="flex flex-col items-center gap-3">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm">
            Loading novel details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !novel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-20 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-8 text-center backdrop-blur-xl shadow-xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">
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

          <h1 className="text-xl font-bold">
            Novel not found
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {error || "We couldn't find this novel."}
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

  const filteredChapters = novel.chapters.filter(
    (chapter) => {
      const query = chapterSearch.toLowerCase();

      const titleMatch = chapter.title
        .toLowerCase()
        .includes(query);

      const numMatch = chapter.chapterNumber
        .toString()
        .includes(query);

      return titleMatch || numMatch;
    },
  );

  const savedChapter = readingProgress
    ? novel.chapters.find(
        (chapter) =>
          chapter.id === readingProgress.chapterId,
      )
    : null;

  const savedPercentage = readingProgress
    ? Math.round(readingProgress.progress * 100)
    : 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Ambient background glow accents */}
      <div className="pointer-events-none absolute right-1/4 top-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      {/* Navigation Bar */}
      <header className="relative z-10 border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/novels"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-white"
          >
            <svg
              className="h-4 w-4"
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

            Back to novels
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 border-b border-slate-200 dark:border-slate-900 bg-slate-100/50 dark:bg-slate-900/20 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-[300px_1fr] md:py-16">
          {/* Cover Art */}
          <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-2xl">
            {novel.coverUrl ? (
              <img
                src={novel.coverUrl}
                alt={novel.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs font-medium text-slate-400 dark:text-slate-600">
                No cover art
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          {/* Novel Info */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2">
              {novel.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              {novel.title}
            </h1>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Created by{" "}
              {novel.author.profile?.username ? (
                <Link
                  href={`/authors/${novel.author.profile.username}`}
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 transition hover:text-blue-500 dark:hover:text-blue-300"
                >
                  {novel.author.profile.displayName ??
                    novel.author.profile.username}

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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ) : (
                <span className="font-semibold text-slate-900 dark:text-slate-200">
                  Unknown author
                </span>
              )}
            </p>

            {novel.description && (
              <p className="mt-6 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {novel.description}
              </p>
            )}

            {/* Continue Reading */}
            {user &&
              !authLoading &&
              !progressLoading &&
              savedChapter &&
              readingProgress && (
                <div className="mt-8 max-w-2xl rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Continue Reading
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                        Chapter {savedChapter.chapterNumber}
                      </h2>

                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {savedChapter.title}
                      </p>
                    </div>

                    <Link
                      href={`/chapters/${savedChapter.id}`}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
                    >
                      Continue
                      <span>→</span>
                    </Link>
                  </div>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Reading progress
                      </span>

                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {savedPercentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{
                          width: `${savedPercentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              {novel.chapters.length > 0 && (
                <Link
                  href={
                    savedChapter
                      ? `/chapters/${savedChapter.id}`
                      : `/chapters/${novel.chapters[0].id}`
                  }
                  className="rounded-xl bg-slate-900 dark:bg-white px-6 py-3 font-semibold text-white dark:text-slate-950 transition hover:bg-slate-800 dark:hover:bg-slate-200"
                >
                  {savedChapter
                    ? "Continue reading"
                    : "Start reading"}
                </Link>
              )}

              <BookmarkButton novelId={novel.id} />

              <LikeButton novelId={novel.id} />
            </div>

            {/* Quick Metrics */}
            <div className="mt-8 flex items-center gap-8 border-t border-slate-200 dark:border-slate-800/80 pt-6 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <span className="block text-xl font-bold text-slate-900 dark:text-white">
                  {novel.chapters.length}
                </span>
                Chapters Published
              </div>

              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

              <div>
                <span className="block text-xl font-bold capitalize text-slate-900 dark:text-white">
                  {novel.status}
                </span>
                Publication Status
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Chapters
            </h2>

            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {novel.chapters.length} total chapters available in this series
            </p>
          </div>

          {novel.chapters.length > 0 && (
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={chapterSearch}
                onChange={(e) =>
                  setChapterSearch(e.target.value)
                }
                placeholder="Search chapter..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-inner backdrop-blur-md transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {novel.chapters.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-12 text-center text-slate-600 dark:text-slate-400 backdrop-blur-xl">
            <p className="text-sm font-medium">
              No chapters have been published yet.
            </p>
          </div>
        ) : filteredChapters.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-12 text-center text-slate-600 dark:text-slate-400 backdrop-blur-xl">
            <p className="text-sm font-medium">
              No chapters match &quot;{chapterSearch}&quot;
            </p>

            <button
              onClick={() => setChapterSearch("")}
              className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800/80 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 shadow-xl backdrop-blur-xl">
            {filteredChapters.map((chapter) => {
              const isCurrentChapter =
                savedChapter?.id === chapter.id;

              return (
                <Link
                  key={chapter.id}
                  href={`/chapters/${chapter.id}`}
                  className={`group flex items-center justify-between gap-6 px-6 py-4 transition ${
                    isCurrentChapter
                      ? "bg-blue-500/5"
                      : "hover:bg-slate-100/80 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-xs font-semibold transition ${
                        isCurrentChapter
                          ? "border-blue-500/40 bg-blue-600/10 text-blue-600 dark:text-blue-400"
                          : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:border-blue-500/40 group-hover:bg-blue-600/10 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}
                    >
                      {chapter.chapterNumber}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {chapter.title}
                        </h3>

                        {isCurrentChapter && (
                          <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                            Current
                          </span>
                        )}
                      </div>

                      {chapter.publishedAt && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {new Date(
                            chapter.publishedAt,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-slate-400 dark:text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}