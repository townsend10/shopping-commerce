interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { category } = await params;
  return (
    <div>
      category:
      {category}
    </div>
  );
};

export default CategoryPage;
