import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../server";
import { commentsTable } from "../db/comments";
import { productTable } from "../db/products";

const COMMENT_MAX_LENGTH = 255;

export const createComment = async (req: Request, res: Response) => {
  try {
    const loggedUser = req.loggedUser;
    if (!loggedUser) {
      return res.status(401).json({ message: "Unauthorization" });
    }

    const { content, rate, productUuid } = req.body;

    if (!content || !productUuid) {
      return res.status(400).json({ message: "Invalid params" });
    }

    let finalContent = content.trim();

    if (finalContent) {
      finalContent = finalContent.replace(/\n{3,}/g, "\n\n");
    }

    if (finalContent.length > COMMENT_MAX_LENGTH) {
      return res.status(400).json({ message: "Content length is too much" });
    }

    // rate 1 ile 5 arasinda olmali
    if (rate < 1 || rate > 5) {
      return res.status(400).json({ message: "The rate is not valid" });
    }

    // Product var mi onun kontrolu
    const [isProductExists] = await db
      .select({ uuid: productTable.uuid })
      .from(productTable)
      .where(eq(productTable.uuid, productUuid));

    if (!isProductExists) {
      return res.status(404).json({ message: "Product is not found" });
    }

    const comment = await db
      .insert(commentsTable)
      .values({
        content: finalContent,
        rate,
        productUuid,
        userUuid: loggedUser.uuid,
      })
      .returning({ uuid: commentsTable.uuid });

    return res.status(201).json({ message: "Comment created", comment });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Interval error" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const loggedUser = req.loggedUser;

    if (!loggedUser) {
      return res.status(401).json({ message: "Unauthorization" });
    }

    const { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({ message: "Invalid params" });
    }

    const [isCommentExits] = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.uuid, uuid));

    if (!isCommentExits) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (isCommentExits.userUuid !== loggedUser.uuid) {
      return res
        .status(403)
        .json({ message: "You are not owner this comment" });
    }

    await db.delete(commentsTable).where(eq(commentsTable.uuid, uuid));

    return res.status(200).json({ message: "comment was deleted" });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Interval error" });
  }
};

export const productComment = async (req: Request, res: Response) => {
  try {
    const { productUuid } = req.body;
    if (!productUuid) {
      return res.status(400).json({ message: "Invalid params" });
    }

    const [isProductExists] = await db
      .select()
      .from(productTable)
      .where(eq(productTable.uuid, productUuid));

    if (!isProductExists) {
      return res.status(404).json({ message: "The product is not found" });
    }

    const allComments = await db.query.products.findFirst({
      where: {
        uuid: productUuid,
      },
      with: {
        comments: true,
      },
    });

    return res
      .status(200)
      .json({ message: "Listing all comments", allComments });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Interval error" });
  }
};
