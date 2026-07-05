"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Đã có lỗi xảy ra");
      setSubmitting(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (signInRes?.error) {
      router.push("/login");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="container flex justify-center py-24">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest3 text-gold-dark">Gia nhập HA VY</p>
          <h1 className="mt-3 font-serif text-3xl text-charcoal">Tạo tài khoản</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-xs uppercase tracking-widest2 text-espresso/60">Họ và tên</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input mt-2"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest2 text-espresso/60">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="input mt-2"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest2 text-espresso/60">Số điện thoại</span>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="input mt-2"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest2 text-espresso/60">Mật khẩu</span>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="input mt-2"
            />
          </label>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Đang tạo tài khoản..." : "Đăng ký"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-espresso/60">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-gold-dark hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
