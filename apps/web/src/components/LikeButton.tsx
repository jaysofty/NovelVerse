"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import {
  getLikeStatus,
  getNovelLikes,
  likeNovel,
  unlikeNovel,
} from "@/lib/likes";

type Props = {
  novelId: string;
};

export default function LikeButton({ novelId }: Props) {
  const { user, loading: authLoading } = useAuth();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLikeData() {
      try {
        const likes = await getNovelLikes(novelId);

        if (cancelled) {
          return;
        }

        setLikeCount(likes.count);

        if (!user) {
          return;
        }

        const status = await getLikeStatus(novelId);

        if (cancelled) {
          return;
        }

        setLiked(status.liked);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load like information:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (!authLoading) {
      loadLikeData();
    }

    return () => {
      cancelled = true;
    };
  }, [novelId, user, authLoading]);

  async function handleLike() {
    if (saving) {
      return;
    }

    setError("");

    if (!user) {
      setError("Sign in to like this novel.");
      return;
    }

    const previousLiked = liked;
    const previousCount = likeCount;

    // Optimistic update
    setLiked(!previousLiked);
    setLikeCount((current) =>
      previousLiked ? Math.max(0, current - 1) : current + 1,
    );

    setSaving(true);

    try {
      if (previousLiked) {
        await unlikeNovel(novelId);
      } else {
        await likeNovel(novelId);
      }
    } catch (err) {
      // Roll back optimistic update
      setLiked(previousLiked);
      setLikeCount(previousCount);
      setError(
        err instanceof Error ? err.message : "Failed to update like status",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading || authLoading) {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-xs font-medium text-slate-500 backdrop-blur-xl animate-pulse">
        <svg
          className="h-4 w-4 text-slate-600 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={handleLike}
        disabled={saving}
        className={`group inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs font-semibold backdrop-blur-xl transition-all duration-300 shadow-lg ${
          liked
            ? "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 shadow-rose-500/5"
            : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white shadow-blue-500/5"
        } ${saving ? "cursor-not-allowed opacity-75" : "hover:-translate-y-0.5 active:translate-y-0"}`}
      >
        <svg
          className={`h-4 w-4 transition-transform duration-300 ${
            liked
              ? "scale-110 text-rose-500 fill-rose-500"
              : "text-slate-400 group-hover:scale-110 group-hover:text-rose-400"
          }`}
          fill={liked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={liked ? 0 : 2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>

        <span>{saving ? "Updating..." : liked ? "Liked" : "Like"}</span>

        <span
          className={`ml-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
            liked
              ? "bg-rose-500/20 text-rose-300"
              : "bg-slate-800 text-slate-400 group-hover:bg-slate-700/80 group-hover:text-slate-200"
          }`}
        >
          {likeCount}
        </span>
      </button>

      {error && (
        <p className="mt-2 text-xs text-rose-400 font-medium animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}
