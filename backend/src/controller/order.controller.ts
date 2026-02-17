import { Request, Response } from "express";
import { productTable } from "../db/products";
import { eq } from "drizzle-orm";
import { db } from "../server";
import { orderTable } from "../db/order";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const loggedUser = req.loggedUser;
    if (!loggedUser) {
      return res.status(401).json({ message: "Unauthorization" });
    }

    const { productUuid } = req.body;
    const isProductExists = await db
      .select({ uuid: productTable.uuid, price: productTable.price })
      .from(productTable)
      .where(eq(productTable.uuid, productUuid));

    if (isProductExists.length === 0) {
      return res.status(404).json({ message: "The product is not found" });
    }

    await db.insert(orderTable).values({
      productUuid,
      userUuid: loggedUser.uuid,
      status: true,
      price: isProductExists[0].price,
    });

    return res.status(201).json({ message: "Order created" });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const orders = async (req: Request, res: Response) => {
  try {
    const loggedUser = req.loggedUser;
    if (!loggedUser) {
      return res.status(401).json({ message: "Unauthorization" });
    }

    const usersOrder = await db
      .select()
      .from(orderTable)
      .where(eq(orderTable.userUuid, loggedUser.uuid));
    return res.status(200).json({ message: "Listed", usersOrder });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
