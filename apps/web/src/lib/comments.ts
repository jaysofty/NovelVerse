import { apiRequest } from "@/lib/api";

export type CommentUser = {
  id: string;
  profile: {
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
};

export type CommentReply = {
  id: string;
  userId: string;
  chapterId: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
};

export type Comment = {
  id: string;
  userId: string;
  chapterId: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  user: CommentUser;
  replies: CommentReply[];
};

export async function getChapterComments(chapterId: string) {
  return apiRequest<Comment[]>(
    `/comment/chapters/${chapterId}/comments`,
  );
}

export async function createComment(
  chapterId: string,
  content: string,
) {
  return apiRequest<Comment>(
    `/comment/chapters/${chapterId}/comments`,
    {
      method: "POST",
      body: JSON.stringify({
        content,
      }),
    },
  );
}

export async function createReply(
  commentId: string,
  content: string,
) {
  return apiRequest<CommentReply>(
    `/comment/comments/${commentId}/replies`,
    {
      method: "POST",
      body: JSON.stringify({
        content,
      }),
    },
  );
}

export async function deleteComment(commentId: string) {
  return apiRequest<void>(
    `/comment/comments/${commentId}`,
    {
      method: "DELETE",
    },
  );
}