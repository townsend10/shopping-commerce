interface SubCategoryPageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

const SubCategoryPage = async ({ params }: SubCategoryPageProps) => {
  const { category, subcategory } = await params;
  return (
    <div>
      category:
      {category}
      <br />
      subcategory: {subcategory}
    </div>
  );
};

export default SubCategoryPage;
