import express, { Response, Request } from "express";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { relations } from "./db/realations";

export const db = drizzle(process.env.DATABASE_URL!, { relations });

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
