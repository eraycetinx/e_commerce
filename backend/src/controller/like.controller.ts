import { Request, Response } from "express";
import { db } from "../server";
import { and, eq, sql } from "drizzle-orm";
import { commentsTable } from "../db/comments";
import { likeTable } from "../db/like";

export const likeComment = async (req: Request, res: Response) => {
  try {
    const loggedUser = req.loggedUser;
    if (!loggedUser) {
      return res.status(401).json({ message: "Unauthorization" });
    }

    const { commentUuid } = req.body;
    if (!commentUuid) {
      return res.status(400).json({ message: "Invalid params" });
    }

    const [isCommentExists] = await db
      .select()
      .from(commentsTable)
      .where(and(eq(commentsTable.uuid, commentUuid)));

    if (!isCommentExists) {
      return res.status(404).json({ message: "Comment is not found" });
    }

    const isCommentAlreadyLiked = await db.query.like.findFirst({
      where: {
        commentUuid,
        userUuid: loggedUser.uuid,
      },
    });

    if (isCommentAlreadyLiked) {
      return res.status(400).json({ message: "Comment already liked" });
    }

    await db.transaction(async (tx) => {
      await tx
        .insert(likeTable)
        .values({ commentUuid, userUuid: loggedUser.uuid });
      await tx
        .update(commentsTable)
        .set({
          likeCount: sql`${commentsTable.likeCount} + 1`,
        })
        .where(eq(commentsTable.uuid, commentUuid));
    });

    return res.status(201).json({ message: "Comment liked" });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Interval error" });
  }
};
export const unlikeComment = async (req: Request, res: Response) => {
  try {
    const loggedUser = req.loggedUser;
    if (!loggedUser) {
      return res.status(401).json({ message: "Unauthorization" });
    }

    const { commentUuid } = req.body;
    if (!commentUuid) {
      return res.status(400).json({ message: "Invalid params" });
    }

    const [isCommentExists] = await db
      .select()
      .from(commentsTable)
      .where(and(eq(commentsTable.uuid, commentUuid)));

    if (!isCommentExists) {
      return res.status(404).json({ message: "Comment is not found" });
    }

    const isCommentAlreadyLiked = await db.query.like.findFirst({
      where: {
        commentUuid,
        userUuid: loggedUser.uuid,
      },
    });

    if (!isCommentAlreadyLiked) {
      return res.status(400).json({ message: "Comment is not liked" });
    }

    await db.transaction(async (tx) => {
      (await tx.delete(likeTable).where(eq(likeTable.commentUuid, commentUuid)),
        await tx
          .update(commentsTable)
          .set({
            likeCount: sql`${commentsTable.likeCount} - 1`,
          })
          .where(eq(commentsTable.uuid, commentUuid)));
    });

    return res.status(201).json({ message: "Comment liked" });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Interval error" });
  }
};
