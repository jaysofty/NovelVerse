"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useAuthorChapter } from "@/hooks/useAuthorChapter";
import { usePublishChapter } from "@/hooks/usePublishChapter";
import { useUnpublishChapter } from "@/hooks/useUnpublishChapter";
import { useDeleteChapter } from "@/hooks/useDeleteChapter";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AuthorChapterPage() {
  const params = useParams<{
    id: string;
    chapterId: string;
    chapter: string;
  }>();

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const chapterId =
    typeof params.chapterId === "string" ? params.chapterId : "";
  const novelId = typeof params.id === "string" ? params.id : "";

  const {
    data: chapter,
    isLoading,
    isError,
    error,
  } = useAuthorChapter(chapterId);

  const publishChapter = usePublishChapter(novelId, chapterId);
  const unpublishChapter = useUnpublishChapter(novelId, chapterId);
  const deleteChapter = useDeleteChapter(novelId, chapterId);

  const isUpdatingPublication =
    publishChapter.isPending || unpublishChapter.isPending;

  /*
   * Authentication loading state
   */
  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400 relative z-10">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <p className="text-sm font-medium tracking-wide">
            Loading your account...
          </p>
        </div>
      </main>
    );
  }

  /*
   * Not authenticated
   */
  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0,transparent_70%)] pointer-events-none" />
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 text-center backdrop-blur-2xl shadow-2xl relative z-10 shadow-blue-500/10 dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-inner">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Sign in required
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            You must be signed in to manage and view this chapter.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:shadow-blue-500/40"
          >
            Sign in to dashboard
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Author-only check
   */
  if (user.role !== "AUTHOR") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06)_0,transparent_70%)] pointer-events-none" />
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 text-center backdrop-blur-2xl shadow-2xl relative z-10 shadow-amber-500/5 dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-inner">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Author access required
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Only verified author accounts can access and manage chapter
            manuscripts.
          </p>

          <Link
            href="/novels"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Browse public library
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Loading chapter state
   */
  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400 relative z-10">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          <p className="text-sm font-medium tracking-wide">
            Loading chapter details...
          </p>
        </div>
      </main>
    );
  }

  /*
   * Error state
   */
  if (isError || !chapter) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06)_0,transparent_70%)] pointer-events-none" />
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 text-center backdrop-blur-2xl shadow-2xl relative z-10 shadow-red-500/10 dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 shadow-inner">
            <svg
              className="h-8 w-8"
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

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Chapter not found
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {error instanceof Error
              ? error.message
              : "We couldn't locate this chapter in the database."}
          </p>

          <Link
            href={novelId ? `/authors/me/novels/${novelId}` : "/authors/me"}
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
          >
            ← Back to novel overview
          </Link>
        </div>
      </main>
    );
  }
  const currentChapter = chapter;

  function handleDelete() {
    deleteChapter.mutate(undefined, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        router.push(`/authors/me/novels/${novelId}`);
      },
    });
  }

  const isPublished = Boolean(chapter.publishedAt);

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 pb-28 selection:bg-blue-500 selection:text-white">
      {/* Immersive background glow decorations */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-140 w-140 rounded-full bg-blue-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute right-10 top-1/4 h-120 w-120 rounded-full bg-indigo-600/10 blur-[140px]" />
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-12">
        {/* Back Navigation */}
        <button
          type="button"
          onClick={() => router.push(`/authors/me/novels/${chapter.novel.id}`)}
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur-md transition hover:border-slate-300 hover:bg-white hover:text-slate-900 mb-8 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-white"
        >
          <svg
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
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
          Back to novel overview
        </button>

        {/* Header Section */}
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 dark:border-slate-800/80 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-inner">
                Chapter {chapter.chapterNumber}
              </span>

              <span
                className={
                  isPublished
                    ? "rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-inner flex items-center gap-1.5"
                    : "rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shadow-inner flex items-center gap-1.5"
                }
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isPublished ? "bg-emerald-500 dark:bg-emerald-400 animate-pulse" : "bg-amber-500 dark:bg-amber-400"}`}
                />
                {isPublished ? "Published" : "Draft Manuscript"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {chapter.title}
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              Novel series:{" "}
              <span className="text-slate-800 dark:text-slate-200 font-semibold">
                {chapter.novel.title}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/authors/me/novels/${chapter.novel.id}/chapters/${chapter.id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/80 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-md backdrop-blur transition hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-800/80 dark:border-slate-700/60 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit text
            </Link>

            <button
              type="button"
              onClick={() => {
                if (isPublished) {
                  unpublishChapter.mutate();
                } else {
                  publishChapter.mutate();
                }
              }}
              disabled={isUpdatingPublication}
              className={
                isPublished
                  ? "inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-500/5 backdrop-blur transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  : "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              }
            >
              {isUpdatingPublication ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Updating...
                </>
              ) : isPublished ? (
                <>
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                  Unpublish chapter
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Publish chapter
                </>
              )}
            </button>
          </div>
        </div>

        {/* Metadata Grid Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 backdrop-blur-xl shadow-lg transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sequence Index
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              #{chapter.chapterNumber}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 backdrop-blur-xl shadow-lg transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Publication Status
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${isPublished ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"}`}
              />
              {isPublished ? "Published" : "Draft"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 backdrop-blur-xl shadow-lg transition hover:border-slate-300 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:border-slate-700/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Last Modified
            </p>
            <p className="mt-2 text-base font-bold text-slate-800 dark:text-slate-200">
              {new Date(chapter.updatedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Content Viewer Card */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Manuscript Content
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Full layout preview of your saved story text.
              </p>
            </div>
          </div>

          <article className="rounded-3xl border border-slate-200 bg-white/60 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden dark:border-slate-800/80 dark:bg-slate-900/40">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="whitespace-pre-wrap text-base leading-loose text-slate-800 dark:text-slate-200 font-serif selection:bg-blue-500 selection:text-white relative z-10">
              {chapter.content}
            </div>
          </article>
        </div>

        {/* Danger Zone Section */}
        <div className="mt-12 rounded-3xl border border-red-500/20 bg-red-50/50 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 dark:bg-red-950/10">
          <div>
            <h2 className="text-base font-bold text-red-600 dark:text-red-400 tracking-tight flex items-center gap-2">
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Chapter
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Once deleted, this chapter and its text cannot be recovered.
              Please proceed with caution.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteChapter.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-xs font-semibold text-red-600 dark:text-red-400 shadow-lg shadow-red-500/5 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
          >
            Delete chapter permanently
          </button>
        </div>
      </section>
      {/* Custom Professional Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Chapter"
        message={`Are you sure you want to delete "${currentChapter.title}"? This action is permanent and cannot be undone.`}
        confirmText="Delete permanently"
        cancelText="Cancel"
        isDanger={true}
        isLoading={deleteChapter.isPending}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </main>
  );
}
