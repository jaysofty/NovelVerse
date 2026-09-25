import type { Request, Response, NextFunction } from "express";

import {
  getChapterComments,
  createComment,
  getCommentById,
  deleteComment,
    createReply,
} from "./comment.service.js";

export async function getChapterCommentsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { chapterId } = req.params;

    if (!chapterId || Array.isArray(chapterId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    const comments = await getChapterComments(chapterId);

    return res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCommentController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    const { chapterId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!chapterId || Array.isArray(chapterId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    const { content, parentId } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    if (parentId !== undefined && typeof parentId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid parent comment ID",
      });
    }

    if (parentId) {
      const parentComment = await getCommentById(parentId);

      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }

      if (parentComment.chapterId !== chapterId) {
        return res.status(400).json({
          success: false,
          message: "Parent comment belongs to another chapter",
        });
      }
    }

    const comment = await createComment({
      userId,
      chapterId,
      content: content.trim(),
      ...(parentId ? { parentId } : {}),
    });

    return res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCommentController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    const { commentId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!commentId || Array.isArray(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    const comment = await getCommentById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    await deleteComment(commentId);

    return res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function createReplyController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { commentId } = req.params;

    if (!commentId || Array.isArray(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    const { content } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const reply = await createReply({
      userId,
      commentId,
      content: content.trim(),
    });

    return res.status(201).json({
      success: true,
      data: reply,
    });
  } catch (error) {
    next(error);
  }
}