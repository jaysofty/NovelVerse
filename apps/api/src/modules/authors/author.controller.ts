import type { Request, Response, NextFunction } from "express";

import {
  createNovel,
  getAuthorByUsername,
  getAuthorNovelById,
  getMyAuthorProfile,
  publishAuthorNovel,
  unpublishAuthorNovel,
  followAuthor,
  unfollowAuthor,
  getAuthorFollowStatus,
} from "./author.service.ts";
import { createNovelSchema } from "./author.schema.ts";
import { AppError } from "../../utils/AppError.ts";
import { getAuthorChapterById } from "../chapters/chapter.service.ts";
import { updateNovelSchema } from "../novels/novel.schema.ts";
import { updateNovel } from "../novels/novel.service.ts";

export async function getAuthorByUsernameController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username } = req.params;

    if (!username || Array.isArray(username)) {
      return res.status(400).json({
        success: false,
        message: "Invalid username",
      });
    }

    const author = await getAuthorByUsername(username);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: author,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyAuthorProfileController(
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

    const author = await getMyAuthorProfile(userId);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: author,
    });
  } catch (error) {
    next(error);
  }
}

export async function createNovelController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorId = req.user?.userId;

    if (!authorId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = createNovelSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const novel = await createNovel(authorId, result.data);

    return res.status(201).json({
      success: true,
      data: novel,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "NOVEL_SLUG_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        success: false,
        message: "A novel with this title already exists",
      });
    }

    next(error);
  }
}

export async function updateAuthorNovelController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid novel ID",
      });
    }

    const input = updateNovelSchema.parse(req.body);

    const novel = await updateNovel(id, userId, input);

    return res.status(200).json({
      success: true,
      data: novel,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAuthorNovelController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorId = req.user?.userId;

    if (!authorId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid novel ID",
      });
    }

    const novel = await getAuthorNovelById(authorId, id);

    if (!novel) {
      throw new AppError(
        "Novel not found or you are not the author",
        404,
        "NOVEL_NOT_FOUND",
      );
    }

    return res.status(200).json({
      success: true,
      data: novel,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAuthorChapterByIdController(
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

    if (typeof chapterId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID",
      });
    }

    const chapter = await getAuthorChapterById(chapterId, userId);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
}

export async function publishAuthorNovelController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorId = req.user?.userId;
    const { id } = req.params;

    if (!authorId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid novel ID",
      });
    }

    const novel = await publishAuthorNovel(authorId, id);

    return res.status(200).json({
      success: true,
      message: "Novel published successfully",
      data: novel,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOVEL_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Novel not found or you are not the author",
        });
      }

      if (error.message === "NOVEL_ALREADY_PUBLISHED") {
        return res.status(400).json({
          success: false,
          message: "Novel is already published",
        });
      }
    }

    next(error);
  }
}

export async function unpublishAuthorNovelController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorId = req.user?.userId;
    const { id } = req.params;

    if (!authorId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid novel ID",
      });
    }

    const novel = await unpublishAuthorNovel(authorId, id);

    return res.status(200).json({
      success: true,
      message: "Novel unpublished successfully",
      data: novel,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOVEL_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Novel not found or you are not the author",
        });
      }

      if (error.message === "NOVEL_NOT_PUBLISHED") {
        return res.status(400).json({
          success: false,
          message: "Novel is not currently published",
        });
      }
    }

    next(error);
  }
}

export async function followAuthorController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const followerId = req.user?.userId;
    const { username } = req.params;

    if (!followerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (typeof username !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid username",
      });
    }

    const follow = await followAuthor(followerId, username);

    return res.status(201).json({
      success: true,
      message: "Author followed successfully",
      data: follow,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "AUTHOR_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Author not found",
        });
      }

      if (error.message === "CANNOT_FOLLOW_SELF") {
        return res.status(400).json({
          success: false,
          message: "You cannot follow yourself",
        });
      }

      if (error.message === "ALREADY_FOLLOWING") {
        return res.status(409).json({
          success: false,
          message: "You are already following this author",
        });
      }
    }

    next(error);
  }
}

export async function unfollowAuthorController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const followerId = req.user?.userId;
    const { username } = req.params;

    if (!followerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (typeof username !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid username",
      });
    }

    await unfollowAuthor(followerId, username);

    return res.status(200).json({
      success: true,
      message: "Author unfollowed successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "AUTHOR_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Author not found",
        });
      }

      if (error.message === "NOT_FOLLOWING") {
        return res.status(400).json({
          success: false,
          message: "You are not following this author",
        });
      }
    }

    next(error);
  }
}

export async function getAuthorFollowStatusController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const followerId = req.user?.userId;
    const { username } = req.params;

    if (!followerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (typeof username !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid username",
      });
    }

    const status = await getAuthorFollowStatus(followerId, username);

    return res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "AUTHOR_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    next(error);
  }
}
