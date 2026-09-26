"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import CreateChapterForm from "../../../components/CreateChapterForm";

export default function CreateChapterPage() {
  const params = useParams();
  const { user, loading } = useAuth();

  const novelId =
    typeof params.id === "string"
      ? params.id
      : "";

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col items-center gap-3 text-slate-400 relative z-10">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm font-medium tracking-wide">Loading your account...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0,transparent_70%)] pointer-events-none" />
        <div className="w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 text-center backdrop-blur-xl shadow-2xl relative z-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400 shadow-inner">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">
            Sign in required
          </h1>

          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            You must be signed in to author and create new chapters.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
          >
            Sign in to dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (user.role !== "AUTHOR") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06)_0,transparent_70%)] pointer-events-none" />
        <div className="w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 text-center backdrop-blur-xl shadow-2xl relative z-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-inner">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636l3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">
            Author access required
          </h1>

          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Only verified author profiles have writing permissions to create chapters.
          </p>

          <Link
            href="/novels"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white"
          >
            Browse public library
          </Link>
        </div>
      </main>
    );
  }

  if (!novelId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06)_0,transparent_70%)] pointer-events-none" />
        <div className="w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 text-center backdrop-blur-xl shadow-2xl relative z-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 shadow-inner">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">
            Invalid novel identifier
          </h1>

          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            The target novel reference couldnt be resolved properly from the route parameters.
          </p>

          <Link
            href="/authors/me"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500"
          >
            Back to author dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 pb-24">
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-[30rem] w-[30rem] rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 top-1/3 h-[25rem] w-[25rem] rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-12">
        {/* Navigation back link */}
        <div className="mb-8">
          <Link
            href={`/authors/me/novels/${novelId}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to novel overview
          </Link>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Create New Chapter
          </h1>

          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Compose and configure your next installment to expand your published manuscript.
          </p>
        </div>

        {/* Content Form Wrapper Card */}
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-xl shadow-blue-500/5">
          <CreateChapterForm novelId={novelId} />
        </div>
      </div>
    </main>
  );
}