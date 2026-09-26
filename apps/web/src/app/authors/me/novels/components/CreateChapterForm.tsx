"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateChapter } from "@/hooks/useCreateChapter";
import { CreateChapterFormValues, createChapterSchema } from "@/schema/chapter.shcema";


type CreateChapterFormProps = {
  novelId: string;
};

export default function CreateChapterForm({
  novelId,
}: CreateChapterFormProps) {
  const router = useRouter();

  const createChapter = useCreateChapter(novelId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateChapterFormValues>({
    resolver: zodResolver(createChapterSchema),

    defaultValues: {
      title: "",
      chapterNumber: 1,
      content: "",
    },
  });

  async function onSubmit(
    values: CreateChapterFormValues,
  ) {
    try {
  
        await createChapter.mutateAsync({
          title: values.title.trim(),
          chapterNumber: values.chapterNumber,
          content: values.content.trim(),
        });

      router.push(
        `/authors/me/novels/${novelId}`,
      );
    } catch {
      // Error toast is already handled by the hook.
    }
  }

  function handleCancel() {
    if (createChapter.isPending) {
      return;
    }

    router.push(
      `/authors/me/novels/${novelId}`,
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-7"
    >
      {/* Chapter title */}

      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-300"
        >
          Chapter title
        </label>

        <input
          id="title"
          type="text"
          placeholder="The Beginning"
          maxLength={200}
          disabled={createChapter.isPending}
          {...register("title")}
          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        />

        {errors.title && (
          <p className="text-sm text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Chapter number */}

      <div className="space-y-2">
        <label
          htmlFor="chapterNumber"
          className="block text-sm font-medium text-slate-300"
        >
          Chapter number
        </label>

        <input
          id="chapterNumber"
          type="number"
          min={1}
          step={1}
          disabled={createChapter.isPending}
          {...register("chapterNumber")}
          className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        />

        {errors.chapterNumber && (
          <p className="text-sm text-red-400">
            {errors.chapterNumber.message}
          </p>
        )}

        <p className="text-xs text-slate-600">
          Each chapter must have a unique number within this novel.
        </p>
      </div>

      {/* Content */}

      <div className="space-y-2">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-slate-300"
        >
          Chapter content
        </label>

        <textarea
          id="content"
          rows={20}
          placeholder="Start writing your chapter..."
          disabled={createChapter.isPending}
          {...register("content")}
          className="w-full resize-y rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-4 text-sm leading-7 text-slate-100 placeholder-slate-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        />

        {errors.content && (
          <p className="text-sm text-red-400">
            {errors.content.message}
          </p>
        )}

        <p className="text-xs text-slate-600">
          Your chapter will be saved as a draft. You can publish it later.
        </p>
      </div>

      {/* Actions */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleCancel}
          disabled={createChapter.isPending}
          className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={createChapter.isPending}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createChapter.isPending ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating chapter...
            </>
          ) : (
            "Create chapter"
          )}
        </button>
      </div>
    </form>
  );
}