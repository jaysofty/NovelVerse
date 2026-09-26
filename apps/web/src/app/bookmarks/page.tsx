"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { deleteBookmark, getUserBookmarks } from "@/lib/bookmarks";
import type { Bookmark } from "@/lib/bookmarks";

export default function BookmarksPage() {
  const { user, loading: authLoading } = useAuth();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let cancelled = false;

    async function loadBookmarks() {
      try {
        setLoading(true);
        setError("");

        const result = await getUserBookmarks();

        if (!cancelled) {
          setBookmarks(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load bookmarks",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBookmarks();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  async function handleRemove(novelId: string) {
    const previousBookmarks = bookmarks;

    setBookmarks((current) =>
      current.filter((bookmark) => bookmark.novelId !== novelId),
    );

    try {
      await deleteBookmark(novelId);
    } catch (err) {
      setBookmarks(previousBookmarks);
      setError(
        err instanceof Error ? err.message : "Failed to remove bookmark",
      );
    }
  }

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-16 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-200">
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800/80" />
          <div className="mt-4 h-6 w-72 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-900" />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 p-5 backdrop-blur-xl"
              >
                <div className="h-56 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="mt-6 h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-3 h-7 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="mt-2 h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-800/60" />
                <div className="mt-6 flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-20 text-slate-900 dark:text-slate-100 flex items-center justify-center relative overflow-hidden transition-colors duration-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0,transparent_70%)] pointer-events-none" />
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 p-8 text-center backdrop-blur-xl shadow-2xl relative z-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 mb-6 shadow-inner">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Your Reading Library</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Sign in to save novels, track your reading progress, and access your personal collection from anywhere.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 hover:shadow-blue-500/40"
          >
            Sign in to account
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-16 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">
              Personal Collection
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
              Your Bookmarks
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Manage stories you&apos;ve saved to read later in your library.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2">
              <strong className="text-slate-900 dark:text-white font-semibold">{bookmarks.length}</strong> saved novels
            </span>
          </div>
        </header>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-600 dark:text-red-400 backdrop-blur-xl flex items-center gap-3 shadow-lg">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {bookmarks.length === 0 ? (
          <div className="mt-16 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/30 px-6 py-20 text-center backdrop-blur-xl max-w-xl mx-auto shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 mb-5 shadow-inner">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No bookmarks yet</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your library is empty. Discover exceptional novels across our catalog and bookmark your favorites to read them later.
            </p>
            <Link
              href="/novels"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 hover:shadow-blue-500/40"
            >
              Discover novels
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => {
              const novel = bookmark.novel;
              const author =
                novel.author.profile?.displayName ??
                novel.author.profile?.username ??
                "Unknown author";

              return (
                <article
                  key={bookmark.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/85 hover:shadow-2xl hover:shadow-blue-500/5"
                >
                  <Link
                    href={`/novels/${novel.slug}`}
                    className="relative block overflow-hidden"
                  >
                    {novel.coverUrl ? (
                      <img
                        src={novel.coverUrl}
                        alt={novel.title}
                        className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center bg-slate-100 dark:bg-slate-950/60 text-slate-400 dark:text-slate-600 font-medium">
                        No cover available
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                    {novel.status && (
                      <span className="absolute top-3 right-3 rounded-full bg-slate-950/75 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400 border border-slate-800">
                        {novel.status}
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <Link
                        href={`/novels/${novel.slug}`}
                        className="block text-xl font-bold text-slate-900 dark:text-white transition group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1"
                      >
                        {novel.title}
                      </Link>

                      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        by <span className="text-slate-700 dark:text-slate-300">{author}</span>
                      </p>

                      {novel.description && (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {novel.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4">
                      <Link
                        href={`/novels/${novel.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 transition hover:text-blue-500 dark:hover:text-blue-300"
                      >
                        Read novel
                        <svg className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleRemove(novel.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-red-600 dark:hover:text-red-400 py-1 px-2 rounded-lg hover:bg-red-500/10"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}