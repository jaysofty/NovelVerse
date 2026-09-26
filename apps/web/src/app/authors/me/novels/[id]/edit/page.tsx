"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useNovel } from "@/hooks/useNovel";
import { useUpdateNovel } from "@/hooks/useUpdateNovel";

export default function EditNovelPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const novelId = params.id;

  const { data: novel, isLoading, isError } = useNovel(novelId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400 relative z-10">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 dark:border-blue-500 border-t-transparent" />
          <p className="text-sm font-medium tracking-wide">
            Loading novel editor...
          </p>
        </div>
      </main>
    );
  }

  if (isError || !novel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 text-slate-900 dark:text-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.04)_0,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06)_0,transparent_70%)] pointer-events-none" />
        <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 p-8 text-center backdrop-blur-xl shadow-xl dark:shadow-2xl relative z-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 shadow-inner">
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

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Failed to load novel
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We couldn&apos;t retrieve this novel&apos;s information for editing.
          </p>

          <Link
            href={`/authors/me/novels/${novelId}`}
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
          >
            ← Back to novel management
          </Link>
        </div>
      </main>
    );
  }

  return (
    <NovelEditForm
      key={novel.id}
      novelId={novel.id}
      initialTitle={novel.title}
      initialDescription={novel.description ?? ""}
      initialVisibility={novel.visibility}
      initialCoverUrl={novel.coverUrl ?? ""}
      onSuccess={() => {
        router.push(`/authors/me/novels/${novel.id}`);
      }}
    />
  );
}

type NovelEditFormProps = {
  novelId: string;
  initialTitle: string;
  initialDescription: string;
  initialVisibility: "PUBLIC" | "PRIVATE";
  initialCoverUrl: string;
  onSuccess: () => void;
};

function NovelEditForm({
  novelId,
  initialTitle,
  initialDescription,
  initialVisibility,
  initialCoverUrl,
  onSuccess,
}: NovelEditFormProps) {
  const updateNovel = useUpdateNovel(novelId);

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">(
    initialVisibility,
  );
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl);
  const [imageError, setImageError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    await updateNovel.mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
      visibility,
      coverUrl: coverUrl.trim() || null,
    });

    onSuccess();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 pb-20">
      {/* Ambient lighting effects */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-120 w-120 rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 top-1/3 h-100 w-100 rounded-full bg-indigo-600/5 dark:bg-indigo-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/authors/me/novels/${novelId}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 backdrop-blur-md transition hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to novel overview
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Edit Novel Metadata
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Refine your story title, description, and readership visibility
            settings.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 p-8 backdrop-blur-xl shadow-xl dark:shadow-2xl dark:shadow-blue-500/5"
        >
          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Novel Title
            </label>

            <div className="relative">
              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter an engaging novel title..."
                maxLength={200}
                required
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/60 px-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-inner backdrop-blur-md transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="mt-1.5 flex justify-end">
              <span
                className={`text-[11px] font-semibold ${title.length >= 190 ? "text-amber-600 dark:text-amber-400" : "text-slate-500"}`}
              >
                {title.length}/200
              </span>
            </div>
          </div>

          {/* Cover Image Field */}
          <div>
            <label
              htmlFor="coverUrl"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Cover Image
            </label>

            <div className="grid gap-6 md:grid-cols-[180px_1fr] md:items-start">
              {/* Cover Preview */}
              <div className="overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 shadow-inner">
                <div className="relative aspect-2/3 w-full">
                  {coverUrl.trim() && !imageError ? (
                    <img
                      src={coverUrl}
                      alt={`${title || "Novel"} cover`}   
                      sizes="180px"
                      className="object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
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

                      <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-600">
                        No cover
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* URL Input */}
              <div>
                <input
                  id="coverUrl"
                  type="url"
                  value={coverUrl}
                  onChange={(event) => {
                    setCoverUrl(event.target.value);
                    setImageError(false);
                  }}
                  placeholder="https://example.com/your-novel-cover.jpg"
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/60 px-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-inner backdrop-blur-md transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />

                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Add a publicly accessible image URL for your novel cover.
                  Recommended ratio:{" "}
                  <span className="font-semibold text-slate-900 dark:text-slate-300">
                    2:3
                  </span>
                  .
                </p>

                {coverUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setCoverUrl("");
                      setImageError(false);
                    }}
                    className="mt-4 text-xs font-semibold text-red-600 dark:text-red-400 transition hover:text-red-500 dark:hover:text-red-300"
                  >
                    Remove cover image
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Synopsis & Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Provide a captivating summary to hook your readers..."
              maxLength={2000}
              className="min-h-40 w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/60 px-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-inner backdrop-blur-md transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
            />

            <div className="mt-1.5 flex justify-end">
              <span
                className={`text-[11px] font-semibold ${description.length >= 1950 ? "text-amber-600 dark:text-amber-400" : "text-slate-500"}`}
              >
                {description.length}/2000
              </span>
            </div>
          </div>

          {/* Visibility Field */}
          <div>
            <label
              htmlFor="visibility"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Publication Visibility
            </label>

            <select
              id="visibility"
              value={visibility}
              onChange={(event) =>
                setVisibility(event.target.value as "PUBLIC" | "PRIVATE")
              }
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/60 px-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 shadow-inner backdrop-blur-md transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option
                value="PUBLIC"
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                Public — Available across the global library catalog
              </option>
              <option
                value="PRIVATE"
                className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                Private — Visible only to you
              </option>
            </select>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Public novels are discoverable by readers and can accumulate likes
              and engagement.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3.5 border-t border-slate-200 dark:border-slate-800/80 pt-6 mt-8">
            <Link
              href={`/authors/me/novels/${novelId}`}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 px-5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 backdrop-blur-md transition hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={updateNovel.isPending || !title.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateNovel.isPending && (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {updateNovel.isPending ? "Saving changes..." : "Save updates"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
