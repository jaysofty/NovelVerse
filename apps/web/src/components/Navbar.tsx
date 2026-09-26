"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "./ThemeToggle";


export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/");
  }

  const isDiscoverActive = pathname.startsWith("/novels");
  const isBookmarksActive = pathname.startsWith("/bookmarks");
  const isAuthorStudioActive = pathname.startsWith("/authors");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white transition"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transition group-hover:scale-105">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            NovelVerse
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/40 p-1.5 backdrop-blur-xl shadow-inner text-sm">
          <Link
            href="/novels"
            className={`rounded-xl px-4 py-2 font-medium transition ${
              isDiscoverActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            Discover
          </Link>

          <Link
            href="/bookmarks"
            className={`rounded-xl px-4 py-2 font-medium transition ${
              isBookmarksActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            Bookmarks
          </Link>

          {!loading && user?.role === "AUTHOR" && (
            <Link
              href="/authors/me"
              className={`rounded-xl px-4 py-2 font-medium transition flex items-center gap-1.5 ${
                isAuthorStudioActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
              }`}
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Author Studio
            </Link>
          )}
        </nav>

        {/* User Account, Theme Toggler & Authentication Actions */}
        <div className="flex items-center gap-3 text-sm">
          {/* Theme Toggler Placement */}
          <ThemeToggle />

          {loading ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/60 px-3.5 py-1.5 backdrop-blur-md">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">
                  {user.profile?.displayName ??
                    user.profile?.username ??
                    user.email}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 backdrop-blur-md transition hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white shadow-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 transition hover:text-slate-900 dark:hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                className="rounded-xl bg-blue-600 px-4.5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}