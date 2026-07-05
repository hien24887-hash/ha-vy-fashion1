"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import type { ProductVariant } from "@prisma/client";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/Button";

export default function AddToCartForm({
  productId,
  slug,
  name,
  price,
  imageUrl,
  variants,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const sizes = useMemo(
    () => Array.from(new Set(variants.map((v) => v.size).filter(Boolean))) as string[],
    [variants]
  );
  const colors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color).filter(Boolean))) as string[],
    [variants]
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const matchedVariant =
    variants.find(
      (v) =>
        (sizes.length === 0 || v.size === selectedSize) &&
        (colors.length === 0 || v.color === selectedColor)
    ) ?? null;

  const hasVariants = variants.length > 0;
  const outOfStock = hasVariants && (!matchedVariant || matchedVariant.stock <= 0);
  const maxQty = matchedVariant?.stock ?? 99;

  function handleAddToCart() {
    if (outOfStock) return;
    const variantLabel = [selectedColor, selectedSize].filter(Boolean).join(" / ") || null;

    addItem({
      productId,
      variantId: matchedVariant?.id ?? null,
      slug,
      name,
      variantLabel,
      price,
      quantity,
      imageUrl,
      stock: matchedVariant?.stock ?? 99,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mt-8 space-y-6">
      {colors.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest2 text-espresso/60 mb-3">Màu sắc</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`border px-4 py-2 text-sm transition-colors ${
                  selectedColor === color
                    ? "border-gold-dark text-gold-dark"
                    : "border-espresso/20 text-espresso/70 hover:border-gold-dark"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest2 text-espresso/60 mb-3">Kích cỡ</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`h-11 min-w-11 border px-3 text-sm transition-colors ${
                  selectedSize === size
                    ? "border-gold-dark text-gold-dark"
                    : "border-espresso/20 text-espresso/70 hover:border-gold-dark"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs uppercase tracking-widest2 text-espresso/60 mb-3">Số lượng</p>
        <div className="inline-flex items-center border border-espresso/20">
          <button
            type="button"
            aria-label="Giảm số lượng"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center text-espresso/70 hover:text-gold-dark"
          >
            <Minus size={16} strokeWidth={1.5} />
          </button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <button
            type="button"
            aria-label="Tăng số lượng"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            className="flex h-11 w-11 items-center justify-center text-espresso/70 hover:text-gold-dark"
          >
            <Plus size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {outOfStock ? (
        <p className="text-sm text-espresso/60">Sản phẩm tạm hết hàng với lựa chọn này.</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleAddToCart} className="flex-1">
            {added ? "Đã thêm vào giỏ" : "Thêm vào giỏ hàng"}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              handleAddToCart();
              router.push("/cart");
            }}
          >
            Mua ngay
          </Button>
        </div>
      )}
    </div>
  );
}
