import { defineRelations } from "drizzle-orm";

// Models
import { usersTable } from "./users";
import { productTable } from "./products";
import { commentsTable } from "./comments";

// Define relations
// The documents are extremely clear and understandable
// https://orm.drizzle.team/docs/relations-v2

export const relations = defineRelations(
  { users: usersTable, products: productTable, comments: commentsTable },
  (r) => ({
    user: {
      prodcut: r.many.products(),
    },
    products: {
      seller: r.one.users({
        from: r.products.sellerUuid,
        to: r.users.uuid,
      }),
      comments: r.many.comments(),
    },
    comments: {
      prodcut: r.one.products({
        from: r.comments.prodcutUuid,
        to: r.products.uuid,
      }),
    },
  }),
);
