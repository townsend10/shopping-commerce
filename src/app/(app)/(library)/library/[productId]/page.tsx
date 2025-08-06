import { DEFAULT_LIMIT } from "@/constants";
import { LibraryView } from "@/modules/library/ui/views/library-view";
import {
  ProductView,
  ProductViewSkeeleton,
} from "@/modules/library/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface ProductIdLibraryPageProps {
  params: Promise<{ productId: string }>;
}

const ProductIdLibraryPage = async ({ params }: ProductIdLibraryPageProps) => {
  const { productId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );

  void queryClient.prefetchQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeeleton />}>
        <ProductView productId={productId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductIdLibraryPage;
