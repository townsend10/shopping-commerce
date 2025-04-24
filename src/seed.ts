import { getPayload } from "payload";
import config from "@payload-config";
const categories = [
  {
    name: "All",
    slug: "all",
  },
  {
    name: "Quadros",
    color: "#FFB347",
    slug: "quadros",
    subcategories: [
      {
        name: "Quadro 1",
        slug: "quadro-1",
      },
      {
        name: "Quadro 2",
        slug: "quadro-2",
      },
      {
        name: "Quadro 3",
        slug: "quadro-3",
      },
      {
        name: "Quadro 4",
        slug: "quadro-4",
      },
    ],
  },
  {
    name: "Programação",
    color: "#10bb44",
    slug: "programaçao",
    subcategories: [
      {
        name: "Prog 1",
        slug: "prog-1",
      },
      {
        name: "Prog 2",
        slug: "prog-2",
      },
      {
        name: "Prog 3",
        slug: "prog-3",
      },
      {
        name: "Prog 4",
        slug: "prog-4",
      },
    ],
  },
  {
    name: "Livro",
    color: "#0d9fb9",
    slug: "livro",
    subcategories: [
      {
        name: "Livro 1",
        slug: "livro-1",
      },
      {
        name: "Livro 2",
        slug: "livro-2",
      },
      {
        name: "Livro 3",
        slug: "livro-3",
      },
      {
        name: "Livro 4",
        slug: "Livro-4",
      },
    ],
  },
  {
    name: "Diversos",
    color: "#FF0",
    slug: "diversos",
    subcategories: [
      {
        name: "Diversos 1",
        slug: "diversos-1",
      },
      {
        name: "Diversos 2",
        slug: "diversos-2",
      },
      {
        name: "Diversos 3",
        slug: "diversos-3",
      },
      {
        name: "Diversos 4",
        slug: "diversos-4",
      },
    ],
  },
  {
    name: "Viagens",
    color: "#da494d ",
    slug: "viagens",
    subcategories: [
      {
        name: "Viagens 1",
        slug: "viagens-1",
      },
      {
        name: "Viagens 2",
        slug: "viagens-2",
      },
      {
        name: "Viagens 3",
        slug: "viagens-3",
      },
      {
        name: "Viagens 4",
        slug: "viagens-4",
      },
    ],
  },
];

const seed = async () => {
  const payload = await getPayload({ config });

  for (const category of categories) {
    const parentCategory = await payload.create({
      collection: "categories",
      data: {
        name: category.name,
        slug: category.slug,
        color: category.color,
        parent: null,
      },
    });

    for (const subCategory of category.subcategories || []) {
      await payload.create({
        collection: "categories",
        data: {
          name: subCategory.name,
          slug: subCategory.slug,
          parent: parentCategory.id,
        },
      });
    }
  }
};

try {
  await seed();
  console.log("seed sucessfull");
  process.exit(0);
} catch (error) {
  console.error("error seed", error);
  process.exit(1);
}
