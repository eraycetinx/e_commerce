import express, { Response, Request } from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./db/realations";

import auth from "./route/auth";
import comment from "./route/comment";
import like from "./route/like";
import product from "./route/prodcut";

export const db = drizzle(process.env.DATABASE_URL!, { relations });

const app = express();
const port = 3000;
app.use(express.json());

app.use(auth);
app.use(comment);
app.use(like);
app.use(product);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
