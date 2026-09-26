"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

type AuthorProfile = {
  id: string;
  profile: {
    username: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
  } | null;
  novels: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    coverUrl: string | null;
    status: "DRAFT" | "PUBLISHED" | "COMPLETED";
    publishedAt: string | null;
    _count: {
      chapters: number;
      likes: number;
    };
  }[];
  stats: {
    novelCount: number;
    publishedCount: number;
    draftCount: number;
    totalLikes: number;
  };
};

export default function AuthorDashboardPage() {
  const { user, loading: authLoading } = useAuth();

  const [author, setAuthor] = useState<AuthorProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    if (user.role !== "AUTHOR") {
      return;
    }

    async function loadAuthorProfile() {
      try {
        setLoading(true);
        setError("");

        const result = await apiRequest<AuthorProfile>("/authors/me");

        setAuthor(result);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load author profile",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAuthorProfile();
  }, [authLoading, user]);

  /*
   * Authentication is still being initialized.
   */
  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <p className="text-sm">Loading your account...</p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * User is not logged in.
   */
  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold">Sign in required</h1>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              You must be signed in to access the author dashboard.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 shadow-lg shadow-blue-600/25"
            >
              Sign in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * User is authenticated but is not an author.
   */
  if (user.role !== "AUTHOR") {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold">Author access required</h1>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              This dashboard is only available to authors.
            </p>

            <Link
              href="/novels"
              className="mt-6 inline-flex rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm"
            >
              Browse novels
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Author API request is loading.
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <p className="text-sm">Loading author dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * API request failed.
   */
  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        </div>
      </main>
    );
  }

  /*
   * Author response has not arrived yet.
   */
  if (!author) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
              {author.profile?.avatarUrl ? (
                <img
                  src={author.profile.avatarUrl}
                  alt={author.profile.displayName ?? "Author"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-slate-600 dark:text-slate-400">
                  {(
                    author.profile?.displayName ??
                    author.profile?.username ??
                    "A"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Author Dashboard
              </p>

              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {author.profile?.displayName ?? author.profile?.username}
              </h1>

              {author.profile?.bio && (
                <p className="mt-1 max-w-xl text-sm text-slate-600 dark:text-slate-400">
                  {author.profile.bio}
                </p>
              )}
            </div>
          </div>

          <Link
            href="/authors/me/novels/new"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 shadow-lg shadow-blue-600/25"
          >
            Create novel
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm dark:shadow-none">
            <p className="text-sm text-slate-500">Total novels</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {author.stats.novelCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm dark:shadow-none">
            <p className="text-sm text-slate-500">Published</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {author.stats.publishedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm dark:shadow-none">
            <p className="text-sm text-slate-500">Drafts</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {author.stats.draftCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm dark:shadow-none">
            <p className="text-sm text-slate-500">Total likes</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {author.stats.totalLikes}
            </p>
          </div>
        </div>

        {/* Novels */}
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Your novels
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your stories and chapters.
              </p>
            </div>

            <Link
              href="/authors/me/novels"
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition"
            >
              View all
            </Link>
          </div>

          {author.novels.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-white/[0.02] px-6 py-16 text-center">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                You havent created any novels yet.
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Start writing your first story.
              </p>

              <Link
                href="/authors/me/novels/new"
                className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition"
              >
                Create your first novel
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {author.novels.map((novel) => (
                <article
                  key={novel.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-sm dark:shadow-none"
                >
                  <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-900">
                    {novel.coverUrl ? (
                      <img
                        src={novel.coverUrl}
                        alt={novel.title}
                        sizes="(max-width: 768px) 100vw, 224px"        
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 px-4 text-center">
                        <svg
                          className="h-10 w-10 text-slate-400 dark:text-slate-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>

                        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">
                          No cover image
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {novel.title}
                      </h3>

                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {novel.status}
                      </span>
                    </div>

                    {novel.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {novel.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-center gap-4 text-xs text-slate-500">
                      <span>{novel._count.chapters} chapters</span>

                      <span>{novel._count.likes} likes</span>
                    </div>

                    <Link
                      href={`/authors/me/novels/${novel.id}`}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                    >
                      Manage novel
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
