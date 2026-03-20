import Link from "next/link";

const categories = [
  { slug: "tops", name: "Tops" },
  { slug: "outerwear", name: "Outerwear" },
  { slug: "denim", name: "Denim" },
  { slug: "accessories", name: "Accessories" },
];

export default function CategoriesPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Browse categories</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-4 text-lg font-medium text-slate-800 transition hover:border-sky-300 hover:text-sky-700"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
