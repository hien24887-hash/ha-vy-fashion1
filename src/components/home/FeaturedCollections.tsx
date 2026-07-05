import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";

export default async function FeaturedCollections() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-ivory">
      <div className="container">
        <SectionHeading eyebrow="Được yêu thích nhất" title="Bộ sưu tập nổi bật" />
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <LinkButton href="/shop" variant="outline">
            Xem tất cả sản phẩm
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
