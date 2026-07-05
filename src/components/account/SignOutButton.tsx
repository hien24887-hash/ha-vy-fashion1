"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-xs uppercase tracking-widest2 text-espresso/60 hover:text-gold-dark"
    >
      Đăng xuất
    </button>
  );
}
