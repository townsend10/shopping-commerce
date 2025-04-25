"use client";
import { CategoriesManyOutput } from "@/modules/categories/types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

interface CategoriesSidebarProps {
  open: boolean;
  action: (open: boolean) => void;
}

export const CategoriesSidebar = ({ open, action }: CategoriesSidebarProps) => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.categories.getMany.queryOptions());
  const router = useRouter();

  const [parentCategories, setParentCategories] =
    useState<CategoriesManyOutput | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoriesManyOutput[1] | null
  >(null);

  const currentCategories = parentCategories ?? data ?? [];

  const handleSidebarOnOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    action(open);
  };

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  const backgroundColor = selectedCategory?.color || "white";

  const handleCategoryClick = (category: CategoriesManyOutput[1]) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesManyOutput);
      setSelectedCategory(category);
    } else {
      if (parentCategories && selectedCategory) {
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`${category.slug}`);
        }

        handleSidebarOnOpenChange(false);
      }
    }
  };
  return (
    <Sheet open={open} onOpenChange={handleSidebarOnOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              onClick={() => handleCategoryClick(category)}
              key={category.slug}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center justify-between text-base font-medium cursor-pointer"
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
