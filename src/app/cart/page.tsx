"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { formatVND } from "@/lib/utils";
import CartItemRow from "@/components/cart/CartItemRow";
import { LinkButton } from "@/components/ui/Button";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-widest3 text-gold-dark">Giỏ hàng của bạn</p>
        <h1 className="mt-3 font-serif text-4xl text-charcoal">Giỏ hàng</h1>
      </div>

      {!hydrated ? null : items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-espresso/60">Giỏ hàng của bạn đang trống.</p>
          <div className="mt-8 flex justify-center">
            <LinkButton href="/shop">Tiếp tục mua sắm</LinkButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <CartItemRow key={`${item.productId}-${item.variantId ?? "base"}`} item={item} />
            ))}
          </div>

          <div className="h-fit border border-gold/20 p-8">
            <h2 className="font-serif text-xl text-charcoal">Tóm tắt đơn hàng</h2>
            <div className="mt-6 flex justify-between text-sm text-espresso/70">
              <span>Tạm tính</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-espresso/50">
              Phí vận chuyển sẽ được tính ở bước thanh toán.
            </p>
            <LinkButton href="/checkout" className="mt-8 w-full">
              Tiến hành thanh toán
            </LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}
