import express, { Response, Request } from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./db/realations";
import dotenv from "dotenv";
import { TokenUser } from "./utils/token";

import auth from "./route/auth";
import comment from "./route/comment";
import like from "./route/like";
import product from "./route/product";
import order from "./route/orders";
import user from "./route/user";
import { globalErrorHandler } from "./middleware/error";

export const db = drizzle(process.env.DATABASE_URL!, { relations });

declare global {
  namespace Express {
    export interface Request {
      loggedUser: TokenUser | any;
    }
  }
}

const app = express();
const port = 3000;
app.use(express.json());
dotenv.config();

app.use(auth);
app.use(comment);
app.use(like);
app.use(product);
app.use(order);
app.use(user);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
