import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  emailValidation,
  passwordValidation,
  usernameValidation,
} from "../utils/regex";
import { db } from "../server";
import { usersTable } from "../db/users";
import { eq, or } from "drizzle-orm";
import { generateToken } from "../utils/token";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cleanUserName = username.trim();
    let cleanEmail = email.trim();
    let cleanPassword = password.trim();

    if (
      !emailValidation(cleanEmail) ||
      !usernameValidation(cleanUserName) ||
      !passwordValidation(cleanPassword)
    ) {
      return res.status(400).json({ message: "Invalid params" });
    }

    const isUserExist = await db
      .select()
      .from(usersTable)
      .where(
        or(
          eq(usersTable.username, cleanUserName),
          eq(usersTable.email, cleanEmail),
        ),
      );

    console.log(isUserExist);

    if (isUserExist.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(cleanPassword, 12);

    const user = await db
      .insert(usersTable)
      .values({
        username: cleanUserName,
        email: cleanEmail,
        password: hashedPassword,
        createdAt: Date.now().toString(),
      })
      .returning({
        uuid: usersTable.uuid,
        username: usersTable.username,
        email: usersTable.email,
      });

    const token = generateToken({
      uuid: user[0].uuid,
      username: user[0].username,
      email: user[0].email,
    });
    return res.status(201).json({ message: "User created", token });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing params" });
    }
    username = username.trim();
    password = password.trim();

    const [isUserExist] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (!isUserExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const decodeHash = await bcrypt.compare(password, isUserExist.password);
    if (!decodeHash) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken({
      uuid: isUserExist.uuid,
      username: isUserExist.username,
      email: isUserExist.email,
    });
    return res.status(200).json({ message: "sucessfull login", token });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const forgotPassword = async (req: Request, res: Response) => {};
