"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface ProductListProps {
  category?: string;
}

export const ProductList = ({category}:ProductListProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({category}));

  return <div>{JSON.stringify(data, null, 2)} xxxxx</div>;
};

export const ProductListSkeeleton = () => {
  return <div>Loading...</div>;
};
