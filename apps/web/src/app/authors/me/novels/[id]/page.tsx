"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNovel } from "@/hooks/useNovel";
import { useDeleteNovel } from "@/hooks/useDeleteNovel";
import { usePublishNovel } from "@/hooks/usePublishNovel";
import { useUnpublishNovel } from "@/hooks/useUnpublishNovel";
import Image from "next/image";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AuthorNovelPage() {
  const params = useParams();
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();
  const novelId = typeof params.id === "string" ? params.id : "";

  const { data: novel, isLoading, isError, error } = useNovel(novelId);

  const deleteNovel = useDeleteNovel(novelId);
  const publishNovel = usePublishNovel(novelId);
  const unpublishNovel = useUnpublishNovel(novelId);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPendingNavigation, startTransition] = useTransition();

  function handleDelete() {
    deleteNovel.mutate(undefined, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        startTransition(() => {
          router.push("/authors/me");
        });
      },
    });
  }

  function handlePublish() {
    publishNovel.mutate(undefined, {
      onSuccess: () => {
        setIsPublishModalOpen(false);
      },
    });
  }

  function handleUnpublish() {
    unpublishNovel.mutate(undefined, {
      onSuccess: () => {
        setIsPublishModalOpen(false);
      },
    });
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 dark:border-blue-500 border-t-transparent" />
          <p className="text-sm">Loading your account...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Sign in required</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            You must be signed in to manage a novel.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  if (user.role !== "AUTHOR") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Author access required</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Only authors can manage novels.
          </p>
          <Link
            href="/novels"
            className="mt-6 inline-flex rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Browse novels
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 dark:border-blue-500 border-t-transparent" />
            <p className="text-sm">Loading novel...</p>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !novel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Novel not found</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {error instanceof Error
              ? error.message
              : "We couldn't find this novel."}
          </p>
          <Link
            href="/authors/me"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-blue-500/30">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[350px] w-[350px] rounded-full bg-purple-600/5 dark:bg-purple-600/10 blur-[120px]" />
      </div>

      <section className="relative mx-auto max-w-5xl px-6 py-10">
        <button
          type="button"
          onClick={() =>
            startTransition(() => {
              router.push("/authors/me");
            })
          }
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
            ←
          </span>{" "}
          Back to dashboard
        </button>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 md:p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-900/50 dark:shadow-2xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="w-full shrink-0 md:w-56">
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-900">
                {novel.coverUrl ? (
                  <img
                    src={novel.coverUrl}
                    alt={novel.title}
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-600">
                    No cover
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
                    novel.status === "PUBLISHED"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      novel.status === "PUBLISHED"
                        ? "bg-emerald-500 animate-pulse dark:bg-emerald-400"
                        : "bg-blue-500 dark:bg-blue-400"
                    }`}
                  />
                  {novel.status}
                </span>

                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  {novel.visibility}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                {novel.title}
              </h1>

              {novel.description ? (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300/80">
                  {novel.description}
                </p>
              ) : (
                <p className="mt-4 text-sm italic text-slate-500">
                  No description provided yet. Edit your novel to add one.
                </p>
              )}

              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Chapters
                  </p>
                  <p className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {novel._count.chapters}
                  </p>
                </div>

                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Likes
                  </p>
                  <p className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {novel._count.likes}
                  </p>
                </div>

                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Bookmarks
                  </p>
                  <p className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {novel._count.bookmarks}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`/authors/me/novels/${novel.id}/edit`}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-blue-600/30 active:scale-[0.98]"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit novel
                </Link>

                {novel.status === "DRAFT" && (
                  <button
                    type="button"
                    disabled={publishNovel.isPending}
                    onClick={() => setIsPublishModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-55 active:scale-[0.98] dark:text-emerald-400"
                  >
                    {publishNovel.isPending ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    Publish novel
                  </button>
                )}

                {novel.status === "PUBLISHED" && (
                  <button
                    type="button"
                    disabled={unpublishNovel.isPending}
                    onClick={() => setIsPublishModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-600 transition-all hover:bg-amber-500 hover:text-white hover:shadow-lg hover:shadow-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] dark:text-amber-400"
                  >
                    {unpublishNovel.isPending ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
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
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                      </svg>
                    )}
                    Unpublish novel
                  </button>
                )}

                <ConfirmDialog
                  isOpen={isPublishModalOpen}
                  title={
                    novel.status === "PUBLISHED"
                      ? "Unpublish Novel"
                      : "Publish Novel"
                  }
                  message={
                    novel.status === "PUBLISHED"
                      ? `"${novel.title}" will be removed from Discover and will no longer be publicly available there. Are you sure you want to unpublish it?`
                      : `"${novel.title}" will be published. If its visibility is PUBLIC, it will become available on Discover. Are you sure you want to publish it?`
                  }
                  confirmText={
                    novel.status === "PUBLISHED"
                      ? "Unpublish novel"
                      : "Publish novel"
                  }
                  cancelText="Cancel"
                  isDanger={novel.status === "PUBLISHED"}
                  isLoading={publishNovel.isPending || unpublishNovel.isPending}
                  onConfirm={
                    novel.status === "PUBLISHED"
                      ? handleUnpublish
                      : handlePublish
                  }
                  onClose={() => setIsPublishModalOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Chapters
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Organize, edit, and track chapters published within this novel.
              </p>
            </div>

            <Link
              href={`/authors/me/novels/${novel.id}/chapters/new`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-[0.98]"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New chapter
            </Link>
          </div>

          {novel.chapters.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white/40 px-6 py-16 text-center backdrop-blur-md dark:border-white/10 dark:bg-slate-900/40">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                No chapters written yet
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">
                Your novel is currently empty. Start writing your masterpiece by
                adding the first chapter.
              </p>
              <Link
                href={`/authors/me/novels/${novel.id}/chapters/new`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
              >
                Write first chapter
              </Link>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white/60 shadow-xl backdrop-blur-xl dark:divide-white/10 dark:border-white/10 dark:bg-slate-900/60">
              {novel.chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className="group flex items-center justify-between gap-4 bg-transparent px-5 py-4 transition-colors hover:bg-slate-100/60 dark:hover:bg-white/[0.02]"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                      #{chapter.chapterNumber}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-slate-950 dark:text-slate-200 dark:group-hover:text-white">
                        {chapter.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full ${chapter.publishedAt ? "bg-emerald-500 dark:bg-emerald-400" : "bg-amber-500 dark:bg-amber-400"}`}
                        />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {chapter.publishedAt ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/authors/me/novels/${novel.id}/chapters/${chapter.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    Manage
                    <svg
                      className="h-3 w-3"
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
                </div>
              ))}
            </div>
          )}
        </div>

        <section className="mt-14 overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-500/[0.08] to-red-500/[0.02] p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping dark:bg-red-400" />
                Danger Zone
              </div>
              <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Delete this novel permanently
              </h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Once deleted, this action cannot be undone. All related
                chapters, statistics, likes, and bookmarks will be permanently
                wiped out.
              </p>
            </div>

            <button
              type="button"
              disabled={deleteNovel.isPending || isPendingNavigation}
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-xs font-semibold text-red-600 shadow-lg shadow-red-500/5 transition-all hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap self-start md:self-auto active:scale-[0.98] dark:text-red-400"
            >
              {deleteNovel.isPending || isPendingNavigation ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
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
              )}
              {isPendingNavigation
                ? "Redirecting..."
                : "Delete novel permanently"}
            </button>
          </div>
        </section>
      </section>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Novel"
        message={`Are you sure you want to delete "${novel.title}"? This action is permanent and cannot be undone.`}
        confirmText="Delete permanently"
        cancelText="Cancel"
        isDanger={true}
        isLoading={deleteNovel.isPending || isPendingNavigation}
        onConfirm={handleDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </main>
  );
}
