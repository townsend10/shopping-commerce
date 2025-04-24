import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";
import { SearchFilters } from "./search-filters";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Category } from "@/payload-types";
import { CustomCategory } from "../types";
interface LayoutProps {
  children: React.ReactNode;
}
const Layout = async ({ children }: LayoutProps) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
    sort: "name",
  });

  const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      // DEPTH: 1 FAZ COM QUE O DOC SE TORNE CATEGORY, POR ISSO É PRECISO TIPAR O DOC COMO CATEGORY
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
