"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import type { CartItem } from "@/lib/cart-store";
import { useCartStore } from "@/lib/cart-store";
import { formatVND } from "@/lib/utils";
import ProductPlaceholder from "@/components/ui/ProductPlaceholder";

export default function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 border-b border-gold/15 py-6">
      <Link href={`/product/${item.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden bg-cream">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill sizes="96px" className="object-cover" />
        ) : (
          <ProductPlaceholder name={item.name} className="p-2 text-xs" />
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-4">
          <div>
            <Link href={`/product/${item.slug}`} className="font-serif text-lg text-charcoal hover:text-gold-dark">
              {item.name}
            </Link>
            {item.variantLabel && (
              <p className="mt-1 text-xs uppercase tracking-widest2 text-espresso/50">
                {item.variantLabel}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Xoá sản phẩm"
            onClick={() => removeItem(item.productId, item.variantId)}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-espresso/40 hover:text-gold-dark"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center border border-espresso/20">
            <button
              type="button"
              aria-label="Giảm số lượng"
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
              className="flex h-9 w-9 items-center justify-center text-espresso/70 hover:text-gold-dark"
            >
              <Minus size={14} strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              aria-label="Tăng số lượng"
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
              className="flex h-9 w-9 items-center justify-center text-espresso/70 hover:text-gold-dark"
            >
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </div>
          <span className="text-sm text-espresso/90">{formatVND(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  );
}
