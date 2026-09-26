"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateNovel } from "@/hooks/useCreateNovel";
import {
  CreateNovelFormValues,
  createNovelSchema,
} from "@/schema/novel.schema";

export default function CreateNovelForm() {
  const router = useRouter();

  const createNovel = useCreateNovel();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNovelFormValues>({
    resolver: zodResolver(createNovelSchema),

    defaultValues: {
      title: "",
      description: "",
      visibility: "PRIVATE",
    },
  });

  async function onSubmit(values: CreateNovelFormValues) {
    const input = {
      title: values.title.trim(),

      ...(values.description?.trim()
        ? {
            description: values.description.trim(),
          }
        : {}),

      visibility: values.visibility,

      contentType: "TEXT" as const,
      creationType: "ORIGINAL" as const,
    };

    try {
      const novel = await createNovel.mutateAsync(input);

      router.push(`/authors/me/novels/${novel.id}`);
    } catch {
      // Error toast is already handled by the hook.
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      {/* Title */}

      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Title
        </label>

        <input
          id="title"
          type="text"
          placeholder="The Last Signal"
          maxLength={200}
          disabled={createNovel.isPending}
          {...register("title")}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/60 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 shadow-sm dark:shadow-none"
        />

        {errors.title && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Description
        </label>

        <textarea
          id="description"
          rows={5}
          maxLength={2000}
          placeholder="A mysterious signal changes everything."
          disabled={createNovel.isPending}
          {...register("description")}
          className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/60 px-4 py-3 text-sm leading-6 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 shadow-sm dark:shadow-none"
        />

        {errors.description && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Visibility */}

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Visibility
        </legend>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-4 shadow-sm dark:shadow-none transition hover:border-slate-400 dark:hover:border-slate-700">
            <input
              type="radio"
              value="PRIVATE"
              disabled={createNovel.isPending}
              {...register("visibility")}
              className="h-4 w-4 accent-blue-600"
            />

            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Private
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Only you can access this novel.
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/40 p-4 shadow-sm dark:shadow-none transition hover:border-slate-400 dark:hover:border-slate-700">
            <input
              type="radio"
              value="PUBLIC"
              disabled={createNovel.isPending}
              {...register("visibility")}
              className="h-4 w-4 accent-blue-600"
            />

            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Public
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Make this novel visible to readers.
              </p>
            </div>
          </label>
        </div>
      </fieldset>

      {/* Content type */}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Content type
        </label>

        <select
          disabled
          value="TEXT"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-none"
        >
          <option value="TEXT">Text</option>
        </select>
      </div>

      {/* Creation type */}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Creation type
        </label>

        <select
          disabled
          value="ORIGINAL"
          className="w-full rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-none"
        >
          <option value="ORIGINAL">Original</option>
        </select>
      </div>

      {/* Actions */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 dark:border-slate-800 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/authors/me")}
          disabled={createNovel.isPending}
          className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 shadow-sm"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={createNovel.isPending}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-blue-600/25"
        >
          {createNovel.isPending ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating novel...
            </>
          ) : (
            "Create novel"
          )}
        </button>
      </div>
    </form>
  );
}
