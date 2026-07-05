import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bộ sưu tập",
  description: "Khám phá toàn bộ bộ sưu tập thời trang xa xỉ của HA VY FASHION.",
};

const SORT_OPTIONS: Record<string, { label: string; orderBy: Record<string, "asc" | "desc"> }> = {
  newest: { label: "Mới nhất", orderBy: { createdAt: "desc" } },
  "price-asc": { label: "Giá tăng dần", orderBy: { price: "asc" } },
  "price-desc": { label: "Giá giảm dần", orderBy: { price: "desc" } },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; featured?: string; isNew?: string };
}) {
  const sortKey = searchParams.sort && SORT_OPTIONS[searchParams.sort] ? searchParams.sort : "newest";
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  const products = await prisma.product.findMany({
    where: {
      categoryId: searchParams.category
        ? categories.find((c) => c.slug === searchParams.category)?.id
        : undefined,
      featured: searchParams.featured ? true : undefined,
      isNew: searchParams.isNew ? true : undefined,
    },
    include: { images: true, category: true },
    orderBy: SORT_OPTIONS[sortKey].orderBy,
  });

  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-widest3 text-gold-dark">Bộ sưu tập</p>
        <h1 className="mt-3 font-serif text-4xl text-charcoal">Toàn bộ sản phẩm</h1>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gold/20 pb-6 mb-10">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link
            href="/shop"
            className={cn(
              "text-xs uppercase tracking-widest2 text-espresso/60 hover:text-gold-dark",
              !searchParams.category && "text-gold-dark"
            )}
          >
            Tất cả
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={cn(
                "text-xs uppercase tracking-widest2 text-espresso/60 hover:text-gold-dark",
                searchParams.category === cat.slug && "text-gold-dark"
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex gap-4 text-xs uppercase tracking-widest2 text-espresso/60">
          {Object.entries(SORT_OPTIONS).map(([key, opt]) => {
            const params = new URLSearchParams();
            if (searchParams.category) params.set("category", searchParams.category);
            if (searchParams.featured) params.set("featured", searchParams.featured);
            if (searchParams.isNew) params.set("isNew", searchParams.isNew);
            params.set("sort", key);
            return (
              <Link
                key={key}
                href={`/shop?${params.toString()}`}
                className={cn("hover:text-gold-dark", sortKey === key && "text-gold-dark")}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-sm text-espresso/60 py-24">
          Chưa có sản phẩm nào trong danh mục này.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
