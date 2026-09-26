"use client";

import { useEffect, useState } from "react";

import {
  createBookmark,
  deleteBookmark,
  getUserBookmarks,
} from "@/lib/bookmarks";
import { useAuth } from "@/context/AuthContext";

type Props = {
  novelId: string;
};

export default function BookmarkButton({ novelId }: Props) {
  const { user, loading: authLoading } = useAuth();

  // null means we are checking the server
  const [bookmarked, setBookmarked] = useState<boolean | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    let cancelled = false;

    async function checkBookmark() {
      try {
        const bookmarks = await getUserBookmarks();

        if (cancelled) {
          return;
        }

        const exists = bookmarks.some(
          (bookmark) => bookmark.novelId === novelId,
        );

        setBookmarked(exists);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to check bookmark:", error);

        // If checking fails, treat it as not bookmarked.
        setBookmarked(false);
      }
    }

    checkBookmark();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, novelId]);

  async function handleBookmark() {
    if (saving) {
      return;
    }

    setError("");

    if (!user) {
      setError("Sign in to bookmark novels.");
      return;
    }

    // If the server check hasn't completed yet,
    // don't allow the action.
    if (bookmarked === null) {
      return;
    }

    const previousState = bookmarked;

    // Optimistic update
    setBookmarked(!previousState);
    setSaving(true);

    try {
      if (previousState) {
        await deleteBookmark(novelId);
      } else {
        await createBookmark(novelId);
      }
    } catch (error) {
      // Roll back optimistic update
      setBookmarked(previousState);

      setError(
        error instanceof Error ? error.message : "Failed to update bookmark",
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * Authentication is still loading.
   */
  if (authLoading) {
    return (
      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded-xl border border-white/20 px-5 py-3 font-semibold text-slate-400 opacity-60"
      >
        Loading...
      </button>
    );
  }

  /*
   * Logged in but bookmark status is being
   * retrieved from the backend.
   */
  if (user && bookmarked === null) {
    return (
      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded-xl border border-white/20 px-5 py-3 font-semibold text-slate-400 opacity-60"
      >
        Checking...
      </button>
    );
  }

  /*
   * Logged out OR bookmark status is known.
   *
   * When logged out, bookmarked is treated as false.
   */
  const isBookmarked = user ? bookmarked === true : false;

  return (
    <div>
      <button
        type="button"
        onClick={handleBookmark}
        disabled={saving}
        className={`rounded-xl border px-5 py-3 font-semibold transition ${
          isBookmarked
            ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950 hover:opacity-90"
            : "border-slate-300 dark:border-white/20 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
        } ${saving ? "cursor-not-allowed opacity-60" : ""}`}
      >
        {saving ? "Saving..." : isBookmarked ? "♥ Bookmarked" : "♡ Bookmark"}
      </button>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
