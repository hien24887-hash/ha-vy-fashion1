import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartForm from "@/components/product/AddToCartForm";
import ProductCard from "@/components/product/ProductCard";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { images: true, category: true, variants: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId ?? undefined,
      id: { not: product.id },
    },
    include: { images: true, category: true },
    take: 4,
  });

  return (
    <div className="container py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery
          images={product.images}
          productName={product.name}
          category={product.category?.name}
        />

        <div className="lg:pt-6">
          {product.category && (
            <p className="text-xs uppercase tracking-widest2 text-gold-dark">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-3 font-serif text-4xl text-charcoal">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-lg text-espresso/90">{formatVND(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-espresso/40 line-through">
                {formatVND(product.compareAtPrice)}
              </span>
            )}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-espresso/70">{product.description}</p>

          {(product.material || product.origin) && (
            <dl className="mt-6 space-y-2 text-sm text-espresso/70 border-t border-gold/20 pt-6">
              {product.material && (
                <div className="flex gap-2">
                  <dt className="w-28 shrink-0 text-espresso/50">Chất liệu</dt>
                  <dd>{product.material}</dd>
                </div>
              )}
              {product.origin && (
                <div className="flex gap-2">
                  <dt className="w-28 shrink-0 text-espresso/50">Xuất xứ</dt>
                  <dd>{product.origin}</dd>
                </div>
              )}
            </dl>
          )}

          <AddToCartForm
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            imageUrl={product.images[0]?.url ?? ""}
            variants={product.variants}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-2xl text-charcoal mb-10 text-center">
            Có thể bạn cũng thích
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
