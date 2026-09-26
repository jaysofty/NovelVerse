"use client";

import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import CreateNovelForm from "../components/CreateNovelForm";

export default function CreateNovelPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {" "}
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />{" "}
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {" "}
        <div className="text-center">
          {" "}
          <h1 className="text-2xl font-bold">Sign in required </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            You must be signed in to create a novel.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  if (user.role !== "AUTHOR") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {" "}
        <div className="text-center">
          {" "}
          <h1 className="text-2xl font-bold">Author access required </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Only authors can create novels.
          </p>
          <Link
            href="/novels"
            className="mt-6 inline-flex rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition"
          >
            Browse novels
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-10 text-slate-900 dark:text-slate-100 sm:px-6 transition-colors duration-200">
      {" "}
      <div className="mx-auto max-w-2xl">
        {" "}
        <div className="mb-8">
          {" "}
          <Link
            href="/authors/me"
            className="mb-5 inline-flex text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
          >
            ← Back to dashboard{" "}
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create a new novel
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Start your next story.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-6 shadow-xl dark:shadow-2xl backdrop-blur-xl sm:p-8">
          <CreateNovelForm />
        </div>
      </div>
    </main>
  );
}