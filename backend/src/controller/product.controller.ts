import { Request, Response } from "express";
import { ProductPayload } from "../types/types";
import { db } from "../server";
import { usersTable } from "../db/users";
import { productTable } from "../db/products";
import { and, eq } from "drizzle-orm";

const MAX_PRODUCT_NAME_LENGTH = 64;
const MAX_DESCRIPTION_LENGTH = 255;
export const createProduct = async (req: Request, res: Response) => {
  try {
    const loggedUser = req.loggedUser;
    console.log(loggedUser);
    if (!loggedUser) {
      return res.status(401).json({ message: "Unauthroization" });
    }

    const [isSeler] = await db
      .select({ isSeller: usersTable.isSeller })
      .from(usersTable)
      .where(eq(usersTable.uuid, loggedUser.uuid));

    if (!isSeler || !isSeler.isSeller) {
      return res.status(403).json({ message: "you can not this action" });
    }

    const { name, description, price }: ProductPayload = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ message: "Invalid params" });
    }

    let finalName = name.trim();
    let finalDescription = description ? description.trim() : "";

    if (finalName) {
      finalName = finalName.replace(/\n{3,}/g, "\n\n");
    }

    if (finalDescription) {
      finalDescription = finalDescription.replace(/\n{3,}/g, "\n\n");
    }

    if (price <= 0) {
      return res.status(400).json({ message: "the price is not valid" });
    }

    if (
      (finalName && finalName.length > MAX_PRODUCT_NAME_LENGTH) ||
      (finalDescription && finalDescription.length > MAX_DESCRIPTION_LENGTH)
    ) {
      return res
        .status(400)
        .json({ message: "Production name is too much longer than excepted" });
    }

    const product = await db
      .insert(productTable)
      .values({
        name: finalName,
        description: finalDescription,
        price,
        sellerUuid: loggedUser.uuid,
        createdAt: Date.now().toString(),
      })
      .returning({ uuid: productTable.uuid });

    return res.status(201).json({ message: "porduct created", product });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Interval error" });
  }
};
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const loggedUser = req.loggedUser;
    if (!loggedUser) {
      return res.status(401).json({ message: "Unauthroization" });
    }
    const { uuid, name, description, price, discount } = req.body;

    const isUserOwnerProduct = await db
      .select()
      .from(productTable)
      .where(
        and(
          eq(productTable.uuid, uuid),
          eq(productTable.sellerUuid, loggedUser.uuid),
        ),
      );

    if (isUserOwnerProduct.length === 0) {
      return res
        .status(403)
        .json({ message: "You are not owner this product" });
    }

    const productData: any = {};

    if (name) {
      let finalName = name.trim();

      if (finalName) {
        finalName = finalName.replace(/\n{3,}/g, "\n\n");
      }
      productData.name = finalName;
    }

    if (description) {
      let finalDescription = description ? description.trim() : "";
      if (finalDescription) {
        finalDescription = finalDescription.replace(/\n{3,}/g, "\n\n");
      }
      productData.description = finalDescription;
    }

    if (price > 0) productData.price = price;

    if (discount > 0) {
      const newPrice = price - (price * discount) / 100;
      productData.price = newPrice;
    }

    if (Object.keys(productData).length === 0) {
      return res.status(204).json({ message: "No changes detected" });
    }

    const product = await db
      .update(productTable)
      .set(productData)
      .where(eq(productTable.uuid, uuid))
      .returning({ uuid: productTable.uuid });

    return res.status(201).json({ message: "Product updated", product });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Interval error" });
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const loggedUser = req.loggedUser;
    if (!loggedUser) {
      return res.status(401).json({ message: "Unauthroization" });
    }

    const { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({ message: "Invalid params" });
    }

    const isUserOwnerProduct = await db
      .select()
      .from(productTable)
      .where(
        and(
          eq(productTable.uuid, uuid),
          eq(productTable.sellerUuid, loggedUser.uuid),
        ),
      );

    if (isUserOwnerProduct.length === 0) {
      return res
        .status(403)
        .json({ message: "You are not owner this product" });
    }

    const isProductExists = await db
      .select()
      .from(productTable)
      .where(eq(productTable.uuid, uuid));

    if (isProductExists.length === 0) {
      return res.status(404).json({ message: "Product is not found" });
    }

    await db.delete(productTable).where(eq(productTable.uuid, uuid));
    return res.status(201).json({ message: "Product deleted" });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Interval error" });
  }
};
export const products = async (req: Request, res: Response) => {
  try {
    const allProduct = await db.select().from(productTable);
    return res.status(201).json({ message: "Products listed", allProduct });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Interval error" });
  }
};
export const product = async (req: Request, res: Response) => {
  try {
    const { uuid }: { uuid?: string } = req.params;

    if (!uuid) {
      return res.status(400).json({ message: "Invalid params" });
    }

    const singleProduct = await db
      .select()
      .from(productTable)
      .where(eq(productTable.uuid, uuid));

    if (singleProduct.length === 0) {
      return res.status(404).json({ message: "Product is not found" });
    }

    return res.status(201).json({ message: "Product", singleProduct });
  } catch (e: any) {
    return res.status(500).json({ message: "Interval error" });
  }
};
