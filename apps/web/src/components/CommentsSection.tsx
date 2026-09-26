"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Reply, Trash2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import {
  createComment,
  createReply,
  deleteComment,
  getChapterComments,
  type Comment,
  type CommentReply,
  type CommentUser,
} from "@/lib/comments";

type Props = {
  chapterId: string;
};

export default function CommentSection({ chapterId }: Props) {
  const { user, loading: authLoading } = useAuth();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadComments() {
      try {
        setLoading(true);

        const result = await getChapterComments(chapterId);

        if (!cancelled) {
          setComments(result);
          setError("");
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error ? error.message : "Failed to load comments",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [chapterId]);

  function getAuthorName(commentUser: CommentUser) {
    return (
      commentUser.profile?.displayName ??
      commentUser.profile?.username ??
      "Unknown user"
    );
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function createTemporaryUser(): CommentUser {
    return {
      id: user?.id ?? "temporary-user",
      profile: {
        username: user?.profile?.username ?? "You",
        displayName: user?.profile?.displayName ?? null,
        avatarUrl: user?.profile?.avatarUrl ?? null,
      },
    };
  }

  async function handleCreateComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || submitting) {
      return;
    }

    if (!user) {
      setError("Sign in to leave a comment.");
      return;
    }

    setError("");
    setContent("");

    const temporaryId = `temp-comment-${Date.now()}`;

    const temporaryComment: Comment = {
      id: temporaryId,
      userId: user.id,
      chapterId,
      content: trimmedContent,
      parentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: createTemporaryUser(),
      replies: [],
    };

    // Optimistically add the comment immediately.
    setComments((current) => [...current, temporaryComment]);

    setSubmitting(true);

    try {
      const createdComment = await createComment(chapterId, trimmedContent);

      // Replace temporary comment with the real server comment.
      setComments((current) =>
        current.map((comment) =>
          comment.id === temporaryId
            ? {
                ...createdComment,
                replies: [],
              }
            : comment,
        ),
      );
    } catch (error) {
      // Roll back optimistic comment.
      setComments((current) =>
        current.filter((comment) => comment.id !== temporaryId),
      );

      setContent(trimmedContent);

      setError(
        error instanceof Error ? error.message : "Failed to create comment",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReply(
    event: FormEvent<HTMLFormElement>,
    commentId: string,
  ) {
    event.preventDefault();

    const trimmedContent = replyContent.trim();

    if (!trimmedContent || replySubmitting) {
      return;
    }

    if (!user) {
      setError("Sign in to reply to comments.");
      return;
    }

    setError("");
    setReplyContent("");

    const temporaryId = `temp-reply-${Date.now()}`;

    const temporaryReply: CommentReply = {
      id: temporaryId,
      userId: user.id,
      chapterId,
      content: trimmedContent,
      parentId: commentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: createTemporaryUser(),
    };

    // Optimistically add the reply.
    setComments((current) =>
      current.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [...comment.replies, temporaryReply],
            }
          : comment,
      ),
    );

    setReplySubmitting(true);

    try {
      const createdReply = await createReply(commentId, trimmedContent);

      // Replace temporary reply with server reply.
      setComments((current) =>
        current.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === temporaryId ? createdReply : reply,
                ),
              }
            : comment,
        ),
      );

      setReplyingTo(null);
    } catch (error) {
      // Roll back optimistic reply.
      setComments((current) =>
        current.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply.id !== temporaryId,
                ),
              }
            : comment,
        ),
      );

      setReplyContent(trimmedContent);

      setError(
        error instanceof Error ? error.message : "Failed to create reply",
      );
    } finally {
      setReplySubmitting(false);
    }
  }

  async function handleDelete(commentId: string, parentCommentId?: string) {
    setError("");

    const previousComments = comments;

    // Optimistically remove the comment/reply.
    if (parentCommentId) {
      setComments((current) =>
        current.map((comment) =>
          comment.id === parentCommentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply.id !== commentId,
                ),
              }
            : comment,
        ),
      );
    } else {
      setComments((current) =>
        current.filter((comment) => comment.id !== commentId),
      );
    }

    try {
      await deleteComment(commentId);
    } catch (error) {
      // Roll back deletion.
      setComments(previousComments);

      setError(
        error instanceof Error ? error.message : "Failed to delete comment",
      );
    }
  }

  if (authLoading || loading) {
    return (
      <section className="mt-20 border-t border-white/10 pt-12">
        {" "}
        <div className="mb-8">
          {" "}
          <div className="h-7 w-32 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-white/10" />
        </div>
        <div className="space-y-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="animate-pulse border-b border-white/10 pb-8"
            >
              <div className="h-4 w-32 rounded bg-white/10" />

              <div className="mt-4 h-4 w-full rounded bg-white/10" />

              <div className="mt-2 h-4 w-2/3 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-20 border-t border-white/10 pt-12">
      {" "}
      <div className="mb-8">
        {" "}
        <h2 className="text-2xl font-bold">Comments </h2>
        <p className="mt-2 text-sm text-slate-500">
          Join the conversation about this chapter.
        </p>
      </div>
      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          {error}
        </div>
      )}
      {user ? (
        <form onSubmit={handleCreateComment} className="mb-10">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share your thoughts about this chapter..."
            rows={4}
            maxLength={2000}
            className="textarea textarea-bordered w-full bg-white/[0.03] text-white placeholder:text-slate-600"
          />

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-600">{content.length}/2000</p>

            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-sm text-slate-400">
            Sign in to join the conversation.
          </p>
        </div>
      )}
      {comments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-12 text-center">
          <h3 className="text-lg font-semibold">No comments yet</h3>

          <p className="mt-2 text-sm text-slate-500">
            Be the first person to share your thoughts.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {comments.map((comment) => (
            <article key={comment.id} className="border-b border-white/10 pb-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-200">
                    {getAuthorName(comment.user)}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>

                {user?.id === comment.userId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                    className="text-slate-600 transition hover:text-red-400"
                    aria-label="Delete comment"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                {comment.content}
              </p>

              {user && (
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(
                      replyingTo === comment.id ? null : comment.id,
                    );

                    setReplyContent("");
                  }}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-white"
                >
                  <Reply size={14} />
                  Reply
                </button>
              )}

              {replyingTo === comment.id && (
                <form
                  onSubmit={(event) => handleReply(event, comment.id)}
                  className="mt-5 ml-6"
                >
                  <textarea
                    value={replyContent}
                    onChange={(event) => setReplyContent(event.target.value)}
                    placeholder="Write a reply..."
                    rows={3}
                    maxLength={1000}
                    className="textarea textarea-bordered w-full bg-white/[0.03] text-white placeholder:text-slate-600"
                  />

                  <div className="mt-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent("");
                      }}
                      className="px-4 py-2 text-sm text-slate-500 transition hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={replySubmitting || !replyContent.trim()}
                      className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {replySubmitting ? "Replying..." : "Reply"}
                    </button>
                  </div>
                </form>
              )}

              {comment.replies.length > 0 && (
                <div className="mt-6 ml-6 space-y-6 border-l border-white/10 pl-6">
                  {comment.replies.map((reply) => (
                    <div key={reply.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-300">
                            {getAuthorName(reply.user)}
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            {formatDate(reply.createdAt)}
                          </p>
                        </div>

                        {user?.id === reply.userId && (
                          <button
                            type="button"
                            onClick={() => handleDelete(reply.id, comment.id)}
                            className="text-slate-600 transition hover:text-red-400"
                            aria-label="Delete reply"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
