import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type CategoriesManyOutput =
  inferRouterOutputs<AppRouter>["categories"]["getMany"];

// export type CategoriesGetManyOutputSingle = CategoriesManyOutput[0];
