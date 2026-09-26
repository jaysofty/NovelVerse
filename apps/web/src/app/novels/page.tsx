"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";
import type { Novel } from "@/types/novel";
import LikeButton from "@/components/LikeButton";

type NovelsResponse = Novel[];

export default function NovelsPage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadNovels() {
      try {
        setLoading(true);

        const result = await apiRequest<NovelsResponse>("/novels", {
          cache: "no-store",
        });

        setNovels(result);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load novels",
        );
      } finally {
        setLoading(false);
      }
    }

    loadNovels();
  }, []);

  const filteredNovels = novels.filter((novel) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    const titleMatch = novel.title.toLowerCase().includes(query);

    const authorName =
      novel.author.profile?.displayName ??
      novel.author.profile?.username ??
      "";

    const authorMatch = authorName.toLowerCase().includes(query);

    return titleMatch || authorMatch;
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute top-0 right-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="pointer-events-none absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              Library Explorer
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Discover novels
            </h1>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Explore curated stories, follow favorite authors, and dive into
              your next great read.
            </p>
          </div>

          {!loading && !error && novels.length > 0 && (
            <div className="w-full md:w-80">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search novels or authors..."
                  className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 shadow-sm backdrop-blur-md transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500"
                />
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-32 text-slate-500 dark:text-slate-400">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />

            <p className="text-sm">Loading library catalog...</p>
          </div>
        )}

        {error && (
          <div className="flex max-w-xl items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-600 dark:text-red-400">
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && novels.length === 0 && (
          <div className="py-32 text-center text-slate-500 dark:text-slate-400">
            <p className="text-base font-medium">
              No novels available in the library yet.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          novels.length > 0 &&
          filteredNovels.length === 0 && (
            <div className="py-24 text-center text-slate-500 dark:text-slate-400">
              <p className="text-base font-medium">
                No novels match &quot;{searchQuery}&quot;
              </p>

              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear search filter
              </button>
            </div>
          )}

        {!loading && !error && filteredNovels.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredNovels.map((novel) => (
              <article
                key={novel.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900/85"
              >
                <Link
                  href={`/novels/${novel.slug}`}
                  className="block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-900">
                    {novel.coverUrl ? (
                      <img
                        src={novel.coverUrl}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-600">
                        No cover
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-5">
                  <Link href={`/novels/${novel.slug}`}>
                    <h2 className="font-semibold text-slate-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                      {novel.title}
                    </h2>
                  </Link>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {novel.author.profile?.displayName ??
                      novel.author.profile?.username ??
                      "Unknown author"}
                  </p>

                  {novel.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {novel.description}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800/60">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {novel._count?.chapters ?? 0} chapters
                    </span>

                    <LikeButton novelId={novel.id} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}