"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await signIn("credentials", { email, password, redirect: false });

    if (res?.error) {
      setError("Email hoặc mật khẩu không chính xác.");
      setSubmitting(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="container flex justify-center py-24">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest3 text-gold-dark">Chào mừng trở lại</p>
          <h1 className="mt-3 font-serif text-3xl text-charcoal">Đăng nhập</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-xs uppercase tracking-widest2 text-espresso/60">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-2"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest2 text-espresso/60">Mật khẩu</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input mt-2"
            />
          </label>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-espresso/60">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-gold-dark hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
