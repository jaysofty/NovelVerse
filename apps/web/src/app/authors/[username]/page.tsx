"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import FollowButton from "@/components/FollowButton";

type AuthorNovel = {
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
};

type AuthorReview = {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  novel: {
    title: string;
    slug: string;
    coverUrl: string | null;
  };
};

type Author = {
  id: string;
  profile: {
    username: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    location?: string | null;
  };
  novels: AuthorNovel[];
  reviews?: AuthorReview[];
  novelCount: number;
  followerCount: number;
};

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default function AuthorProfilePage({ params }: Props) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followerCount, setFollowerCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    async function loadAuthor() {
      try {
        const resolvedParams = await params;
        const result = await apiRequest<Author>(
          `/authors/${resolvedParams.username}`,
        );

        setAuthor(result);
        setFollowerCount(result.followerCount);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load author profile",
        );
      } finally {
        setLoading(false);
      }
    }

    loadAuthor();
  }, [params]);

  // --- Loading State ---
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-400">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium tracking-wide">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  // --- Error/Not Found State ---
  if (error || !author) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/55 text-red-500">
            <svg
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-slate-50">
            Author not found
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {error ||
              "We couldn't find an author profile matching this username."}
          </p>
          <Link
            href="/community"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Go to Community
          </Link>
        </div>
      </main>
    );
  }

  const displayName = author.profile.displayName || author.profile.username;
  const isOwnProfile = user?.id === author.id;
  const reviews = author.reviews || [];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 pb-16">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/novels"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
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

      {/* Main Container */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
          {/* Top Profile Section */}
          <div className="flex flex-col-reverse justify-between gap-6 sm:flex-row sm:items-start">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                {displayName}
              </h1>
              {author.profile.bio ? (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                  {author.profile.bio}
                </p>
              ) : (
                <p className="mt-3 text-sm text-slate-400 dark:text-slate-500 italic">
                  No bio provided yet.
                </p>
              )}

              {/* Location display */}
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <svg
                  className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{author.profile.location || "Shanghai · China"}</span>
              </div>
            </div>

            {/* Right-aligned Avatar */}
            <div className="shrink-0 self-center sm:self-start">
              {author.profile.avatarUrl ? (
                <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={author.profile.avatarUrl}
                    alt={displayName}
                    sizes="(max-width: 640px) 112px, 128px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950 text-4xl font-bold text-blue-600 dark:text-blue-400 shadow-md">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Stats & Follow Button Row */}
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
            <div className="flex items-center gap-10">
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                  0
                </span>
                <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Following
                </span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold text-slate-950 dark:text-white">
                  {followerCount}
                </span>
                <span className="block text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Follower
                </span>
              </div>
            </div>

            <div>
              <FollowButton
                username={author.profile.username}
                isAuthorProfile={isOwnProfile}
                followerCount={followerCount}
                onFollowerCountChange={setFollowerCount}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-blue-400 hover:bg-blue-500 px-8 py-3 text-sm font-bold text-white shadow-sm transition"
                followingClassName="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-8 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-700"
              />
            </div>
          </div>

          {/* Books Section */}
          <div className="mt-10 border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                All books ({author.novelCount})
              </h2>
            </div>

            {author.novels.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                No books available yet.
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {author.novels.map((novel) => (
                  <Link
                    key={novel.id}
                    href={`/novels/${novel.slug}`}
                    className="group flex flex-col"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 aspect-3/4 shadow-sm transition group-hover:shadow-md">
                      {novel.coverUrl ? (
                        <img
                          src={novel.coverUrl}
                          alt={novel.title}
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-medium p-2 text-center">
                          {novel.title}
                        </div>
                      )}
                    </div>
                    <span className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {novel.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-12 border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                All reviews ({reviews.length})
              </h2>
            </div>

            {reviews.length === 0 ? (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                      This book is fantastic. It has the misfortune of ...
                    </p>
                    <Link
                      href="#"
                      className="mt-3 inline-block text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      See full review &gt;
                    </Link>
                    <div className="mt-4 flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <span>★ ★ ★ ★ ☆</span>
                      <span className="ml-2 text-slate-500 dark:text-slate-400 font-medium">
                        8.6
                      </span>
                    </div>
                  </div>
                  <div className="h-24 w-16 shrink-0 rounded-lg bg-slate-900 dark:bg-slate-700 shadow-sm overflow-hidden flex items-center justify-center text-[10px] text-white p-1 text-center font-bold">
                    PROMISE OF SHADOWS
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                      Such an immersive and grandmaster reading review....
                    </p>
                    <Link
                      href="#"
                      className="mt-3 inline-block text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      See full review &gt;
                    </Link>
                    <div className="mt-4 flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <span>★ ★ ★ ★ ☆</span>
                      <span className="ml-2 text-slate-500 dark:text-slate-400 font-medium">
                        8.6
                      </span>
                    </div>
                  </div>
                  <div className="h-24 w-16 shrink-0 rounded-lg bg-slate-900 dark:bg-slate-700 shadow-sm overflow-hidden flex items-center justify-center text-[10px] text-white p-1 text-center font-bold">
                    PROMISE OF SHADOWS
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {review.content}
                      </p>
                      <Link
                        href={`/novels/${review.novel.slug}`}
                        className="mt-3 inline-block text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        See full review &gt;
                      </Link>
                      <div className="mt-4 flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <span>
                          {"★".repeat(Math.floor(review.rating))}
                          {"☆".repeat(5 - Math.floor(review.rating))}
                        </span>
                        <span className="ml-2 text-slate-500 dark:text-slate-400 font-medium">
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    {review.novel.coverUrl && (
                      <div className="relative h-24 w-16 shrink-0 rounded-lg overflow-hidden shadow-sm">
                        <img
                          src={review.novel.coverUrl}
                          alt={review.novel.title}
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
