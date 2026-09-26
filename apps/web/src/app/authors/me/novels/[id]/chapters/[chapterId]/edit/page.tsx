"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthorChapter } from "@/hooks/useAuthorChapter";
import { useUpdateChapter } from "@/hooks/useUpdateChapter";

export default function EditChapterPage() {
  const params = useParams<{
    id: string;
    chapterId: string;
  }>();

  const router = useRouter();

  const novelId = params.id;
  const chapterId = params.chapterId;

  const { data: chapter, isLoading, isError } = useAuthorChapter(chapterId);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <p className="text-sm">Loading chapter...</p>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !chapter) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="text-2xl font-bold">Chapter not found</h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            We couldn&apos;t load this chapter.
          </p>

          <Link
            href={`/authors/me/novels/${novelId}`}
            className="mt-6 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to novel
          </Link>
        </div>
      </main>
    );
  }

  return (
    <ChapterEditForm
      key={chapter.id}
      novelId={novelId}
      chapterId={chapter.id}
      initialTitle={chapter.title}
      initialChapterNumber={chapter.chapterNumber}
      initialContent={chapter.content}
      onSuccess={() => {
        router.push(`/authors/me/novels/${novelId}/chapters/${chapter.id}`);
      }}
    />
  );
}

type ChapterEditFormProps = {
  novelId: string;
  chapterId: string;
  initialTitle: string;
  initialChapterNumber: number;
  initialContent: string;
  onSuccess: () => void;
};

function ChapterEditForm({
  novelId,
  chapterId,
  initialTitle,
  initialChapterNumber,
  initialContent,
  onSuccess,
}: ChapterEditFormProps) {
  const updateChapter = useUpdateChapter(novelId, chapterId);

  const [title, setTitle] = useState(initialTitle);
  const [chapterNumber, setChapterNumber] = useState(initialChapterNumber);
  const [content, setContent] = useState(initialContent);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !content.trim() || chapterNumber < 1) {
      return;
    }

    try {
      await updateChapter.mutateAsync({
        title: title.trim(),
        chapterNumber,
        content: content.trim(),
      });

      onSuccess();
    } catch {
      // Error toast is handled by the mutation hook.
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/authors/me/novels/${novelId}/chapters/${chapterId}`}
            className="text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            ← Back to chapter
          </Link>

          <h1 className="mt-4 text-3xl font-bold">Edit Chapter</h1>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Update your chapter content and information.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/3"
        >
          {/* Chapter Number */}
          <div>
            <label
              htmlFor="chapterNumber"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Chapter Number
            </label>

            <input
              id="chapterNumber"
              type="number"
              min="1"
              value={chapterNumber}
              onChange={(event) => setChapterNumber(Number(event.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Chapter Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter chapter title"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-blue-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600"
              required
            />
          </div>

          {/* Content */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="content"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Chapter Content
              </label>

              <span className="text-xs text-slate-500">
                {content.length} characters
              </span>
            </div>

            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Start writing your chapter..."
              className="min-h-100 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-4 text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-blue-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-white/10 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href={`/authors/me/novels/${novelId}/chapters/${chapterId}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                updateChapter.isPending ||
                !title.trim() ||
                !content.trim() ||
                chapterNumber < 1
              }
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateChapter.isPending ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
