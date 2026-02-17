import { defineRelations } from "drizzle-orm";

// Models
import { usersTable } from "./users";
import { productTable } from "./products";
import { commentsTable } from "./comments";
import { likeTable } from "./like";
import { storeTable } from "./store";

// Define relations
// The documents are extremely clear and understandable
// https://orm.drizzle.team/docs/relations-v2

export const relations = defineRelations(
  {
    users: usersTable,
    products: productTable,
    comments: commentsTable,
    like: likeTable,
    store: storeTable,
  },
  (r) => ({
    user: {
      prodcuts: r.many.products(),
      comments: r.many.comments(),
      likes: r.many.like(),
    },
    products: {
      seller: r.one.users({
        from: r.products.sellerUuid,
        to: r.users.uuid,
      }),
      store: r.one.store({
        from: r.products.storeUuid,
        to: r.store.uuid,
      }),
      comments: r.many.comments(),
    },
    comments: {
      prodcut: r.one.products({
        from: r.comments.productUuid,
        to: r.products.uuid,
      }),
      likes: r.many.like(),
    },
    like: {
      comment: r.one.comments({
        from: r.like.commentUuid,
        to: r.comments.uuid,
      }),
    },
    store: {
      product: r.many.products(),
    },
  }),
);
