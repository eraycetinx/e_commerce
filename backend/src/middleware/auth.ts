import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (header && typeof header === "string") {
      const split = header.split(" "); // Bearer token olacak
      if (split.length === 2 && split[1]) {
        const token = split[1];
        try {
          const decoded = await jwt.verify(token, process.env.SECRET_KEY!);
          req.loggedUser = decoded;
        } catch (e: any) {
          console.error(e);
          req.loggedUser = null;
        }
      }
    }
    // sonraki isleme devam etsin diye ekledik
    next();
  } catch (e: any) {
    // loggedUser null olacak
    next();
  }
};
