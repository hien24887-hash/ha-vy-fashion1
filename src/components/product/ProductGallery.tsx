"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@prisma/client";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";

export default function ProductGallery({
  images,
  productName,
  category,
}: {
  images: ProductImage[];
  productName: string;
  category?: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] w-full bg-cream">
        <ProductPlaceholder name={productName} category={category} />
      </div>
    );
  }

  const current = images[active];

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream">
        <Image
          src={current.url}
          alt={current.alt || productName}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ảnh ${i + 1}`}
              className={`relative aspect-square overflow-hidden border transition-colors ${
                i === active ? "border-gold-dark" : "border-transparent"
              }`}
            >
              <Image src={img.url} alt={img.alt || productName} fill sizes="10vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
