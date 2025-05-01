"use client";
import { cn } from "@/lib/utils";
import { CategoriesManyOutput } from "@/modules/categories/types";
import { ListFilterIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { CategoriesSidebar } from "./categories-sidebar";
import { CategoryDropDown } from "./category-dropdown";
import { useParams } from "next/navigation";

interface CategoriesProps {
  data: CategoriesManyOutput;
}

export const Categories = ({ data }: CategoriesProps) => {
  const params = useParams();

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategoryIndex = data.findIndex(
    (cat) => cat.slug === activeCategory
  );
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidith = viewAllRef.current.offsetWidth;
      const avaliableWidth = containerWidth - viewAllWidith;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      let visible = 0;

      for (const item of items) {
        const width = item.getBoundingClientRect().width;

        if (totalWidth + width > avaliableWidth) break;
        totalWidth += width;
        visible++;
      }

      setVisibleCount(visible);
    };

    const resizeObserve = new ResizeObserver(calculateVisible);
    resizeObserve.observe(containerRef.current!);

    return () => resizeObserve.disconnect();
  }, [data.length]);

  return (
    <div className="relative w-full">
      {/* Categories sidebar */}

      <CategoriesSidebar open={isSidebarOpen} action={setIsSidebarOpen} />
      {/* HIDDEN CATEGORY */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{ position: "fixed", top: -9999, left: -9999 }}
      >
        {" "}
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropDown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
      <div
        ref={containerRef}
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
        className="flex flex-nowrap items-center"
      >
        {" "}
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropDown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}
        <div ref={viewAllRef} className="shrink-0">
          <Button
            variant={"elevated"}
            onClick={() => setIsSidebarOpen(true)}
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
              isActiveCategoryHidden &&
                !isAnyHovered &&
                "bg-white border-primary"
            )}
          >
            View all
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
