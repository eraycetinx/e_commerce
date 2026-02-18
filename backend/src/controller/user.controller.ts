import { Request, Response } from "express";
import { usersTable } from "../db/users";
import { eq } from "drizzle-orm";
import { db } from "../server";
import {
  emailValidation,
  passwordValidation,
  usernameValidation,
} from "../utils/regex";
import bcrypt from "bcrypt";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const loggedUser = req.loggedUser;
    if (!loggedUser) {
      return res.status(401).json({ message: "Unauthorization" });
    }

    const { username, email, password } = req.body;

    const isUserExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.uuid, loggedUser.uuid));

    if (isUserExists.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData: any = {};

    if (username) {
      const cleanUserName = username.trim();

      if (!usernameValidation(cleanUserName)) {
        return res.status(400).json({ message: "Invalid username" });
      }

      const isUserNameAlreadyUsing = await db
        .select({ username: usersTable.username })
        .from(usersTable)
        .where(eq(usersTable.username, cleanUserName));

      if (isUserNameAlreadyUsing.length > 0) {
        return res.status(400).json({ message: "Username already using" });
      }

      userData.username = cleanUserName;
    }

    if (email) {
      const cleanEmail = email.trim();
      if (!emailValidation(cleanEmail)) {
        return res.status(400).json({ message: "Email is not valid" });
      }
      const isEmailAlreadyUsing = await db
        .select({ email: usersTable.email })
        .from(usersTable)
        .where(eq(usersTable.email, cleanEmail));
      if (isEmailAlreadyUsing.length > 0) {
        return res.status(400).json({ message: "The email is already using" });
      }

      userData.email = cleanEmail;
    }

    if (password) {
      const cleanPassword = password.trim();
      if (!passwordValidation(cleanPassword)) {
        return res.status(400).json({ message: "Password is not valid" });
      }

      const hashedPassword = await bcrypt.hash(cleanPassword, 12);
      userData.password = hashedPassword;
    }

    if (Object.keys(userData).length === 0) {
      return res.status(204).json({ message: "No changes detected" });
    }

    const user = await db
      .update(usersTable)
      .set(userData)
      .where(eq(usersTable.uuid, loggedUser.uuid));
    return res.status(201).json({ message: "User updated", user });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const profile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Invalid params" });
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username as string));

    return res.status(200).json({ message: "User founded", user });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const loggedUser = req.loggedUser;
    if (!loggedUser) {
      return res.status(401).json({ message: "Unauthorization" });
    }

    const deletedUser = await db
      .delete(usersTable)
      .where(eq(usersTable.uuid, loggedUser.uuid))
      .returning({ uuid: usersTable.uuid });

    if (deletedUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted" });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
