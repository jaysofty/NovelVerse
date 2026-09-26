"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useFollowAuthor } from "@/hooks/useFollowAuthor";

type FollowButtonProps = {
  username: string;
  isAuthorProfile: boolean;
  followerCount: number;
  onFollowerCountChange: (count: number) => void;
  className?: string;          // Added optional className
  followingClassName?: string; // Added optional followingClassName
};

export default function FollowButton({
  username,
  isAuthorProfile,
  followerCount,
  onFollowerCountChange,
  className,
  followingClassName,
}: FollowButtonProps) {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const isLoggedIn = Boolean(user);

  const {
    isFollowing,
    isSelf,
    isLoadingStatus,
    follow,
    unfollow,
    isFollowingLoading,
    isUnfollowingLoading,
  } = useFollowAuthor(username, isLoggedIn);

  if (authLoading) {
    return null;
  }

  if (isAuthorProfile || isSelf) {
    return null;
  }

  const isLoading =
    isLoadingStatus || isFollowingLoading || isUnfollowingLoading;

  // Fallback default classes if none are passed through props
  const defaultFollowClass = "mt-6 inline-flex min-w-[140px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60";
  const defaultFollowingClass = "mt-6 inline-flex min-w-[140px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition border border-slate-700 bg-slate-800/80 text-slate-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-60";

  const activeClassName = isFollowing
    ? (followingClassName || defaultFollowingClass)
    : (className || defaultFollowClass);

  function handleClick() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (isFollowing) {
      unfollow(undefined, {
        onSuccess: () => {
          onFollowerCountChange(Math.max(0, followerCount - 1));
        },
      });
      return;
    }

    follow(undefined, {
      onSuccess: () => {
        onFollowerCountChange(followerCount + 1);
      },
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={activeClassName}
    >
      {isLoading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {isFollowing ? "Updating..." : "Loading..."}
        </>
      ) : isFollowing ? (
        <>
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
          Following
        </>
      ) : (
        <>
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
          Follow
        </>
      )}
    </button>
  );
}