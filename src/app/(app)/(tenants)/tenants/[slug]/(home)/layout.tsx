import { Footer } from "@/modules/tenants/ui/components/footer";
import { Navbar, NavbarSkeeleton } from "@/modules/tenants/ui/components/nabar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

interface SlugLayoutProps {
  children: React.ReactNode;

  params: Promise<{ slug: string }>;
}

const SlugLayout = async ({ children, params }: SlugLayoutProps) => {
  const { slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col  ">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarSkeeleton />}>
          <Navbar slug={slug} />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default SlugLayout;
