"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", message: "" });
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-gold-dark">
        Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
          <span className="text-xs uppercase tracking-widest2 text-espresso/60">Số điện thoại</span>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="input mt-2"
          />
        </label>
      </div>
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
        <span className="text-xs uppercase tracking-widest2 text-espresso/60">Nội dung</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="input mt-2 resize-none"
        />
      </label>

      {status === "error" && (
        <p className="text-sm text-red-700">Đã có lỗi xảy ra, vui lòng thử lại.</p>
      )}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Đang gửi..." : "Gửi liên hệ"}
      </Button>
    </form>
  );
}
