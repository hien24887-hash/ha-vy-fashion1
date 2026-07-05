"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatVND } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const FREE_SHIPPING_THRESHOLD = 3_000_000;
const FLAT_SHIPPING_FEE = 50_000;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    line1: "",
    city: "",
    district: "",
    ward: "",
    note: "",
  });

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && items.length === 0) router.replace("/cart");
  }, [hydrated, items.length, router]);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const total = subtotal + shippingFee;

  function updateField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Đã có lỗi xảy ra, vui lòng thử lại.");
        setSubmitting(false);
        return;
      }

      useCartStore.getState().clear();
      window.location.href = data.payUrl;
    } catch {
      setError("Không thể kết nối máy chủ, vui lòng thử lại.");
      setSubmitting(false);
    }
  }

  if (!hydrated || items.length === 0) return null;

  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-widest3 text-gold-dark">Bước cuối cùng</p>
        <h1 className="mt-3 font-serif text-4xl text-charcoal">Thanh toán</h1>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Họ và tên" required>
              <input
                required
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Số điện thoại" required>
              <input
                required
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <Field label="Email" required>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Địa chỉ giao hàng" required>
            <input
              required
              placeholder="Số nhà, tên đường"
              value={form.line1}
              onChange={(e) => updateField("line1", e.target.value)}
              className="input"
            />
          </Field>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Field label="Phường/Xã">
              <input
                value={form.ward}
                onChange={(e) => updateField("ward", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Quận/Huyện">
              <input
                value={form.district}
                onChange={(e) => updateField("district", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="Tỉnh/Thành phố" required>
              <input
                required
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="input"
              />
            </Field>
          </div>

          <Field label="Ghi chú (tuỳ chọn)">
            <textarea
              rows={3}
              value={form.note}
              onChange={(e) => updateField("note", e.target.value)}
              className="input resize-none"
            />
          </Field>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? "Đang xử lý..." : "Thanh toán qua MoMo"}
          </Button>
        </form>

        <div className="h-fit border border-gold/20 p-8">
          <h2 className="font-serif text-xl text-charcoal mb-6">Đơn hàng của bạn</h2>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId ?? "base"}`} className="flex justify-between text-sm">
                <span className="text-espresso/70">
                  {item.name}
                  {item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
                </span>
                <span className="shrink-0 pl-2 text-espresso/90">
                  {formatVND(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-gold/20 pt-4 text-sm">
            <div className="flex justify-between text-espresso/70">
              <span>Tạm tính</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between text-espresso/70">
              <span>Phí vận chuyển</span>
              <span>{shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</span>
            </div>
            <div className="flex justify-between font-medium text-charcoal pt-2 border-t border-gold/20">
              <span>Tổng cộng</span>
              <span>{formatVND(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest2 text-espresso/60">
        {label}
        {required && <span className="text-gold-dark"> *</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
