import Link from "next/link";
import Image from "next/image";
import type { ProductCardData } from "@/types";
import { formatVND } from "@/lib/utils";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";

export default function ProductCard({ product }: { product: ProductCardData }) {
  const cover = product.images[0];

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt || product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 ease-luxe group-hover:scale-105"
          />
        ) : (
          <ProductPlaceholder name={product.name} category={product.category?.name} />
        )}
        {product.isNew && (
          <span className="absolute left-3 top-3 bg-charcoal px-3 py-1 text-[10px] uppercase tracking-widest2 text-ivory">
            Mới
          </span>
        )}
      </div>
      <div className="mt-4 text-center">
        {product.category && (
          <p className="text-[10px] uppercase tracking-widest2 text-espresso/40">
            {product.category.name}
          </p>
        )}
        <h3 className="mt-1 font-serif text-lg text-charcoal">{product.name}</h3>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="text-sm text-espresso/80">{formatVND(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-espresso/40 line-through">
              {formatVND(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
