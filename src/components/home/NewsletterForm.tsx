"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  }

  if (submitted) {
    return <p className="text-sm text-gold-light">Cảm ơn bạn đã đăng ký!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex">
      <label htmlFor="newsletter-email" className="sr-only">
        Địa chỉ email
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email của bạn"
        className="min-w-0 flex-1 border border-ivory/20 bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 border border-gold bg-gold px-5 py-3 text-xs uppercase tracking-widest2 text-charcoal transition-colors hover:bg-gold-light"
      >
        Gửi
      </button>
    </form>
  );
}
