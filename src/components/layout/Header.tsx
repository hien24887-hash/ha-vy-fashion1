"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/shop", label: "Bộ sưu tập" },
  { href: "/about", label: "Về chúng tôi" },
  { href: "/contact", label: "Liên hệ" },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-gold/20 bg-ivory/95 backdrop-blur transition-shadow duration-300",
        scrolled && "shadow-[0_1px_0_0_rgba(184,151,90,0.35)]"
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center md:hidden"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs uppercase tracking-widest2 text-espresso/80 transition-colors hover:text-gold-dark",
                pathname === link.href && "text-gold-dark"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl md:text-3xl tracking-widest2 text-charcoal"
        >
          HA VY
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <nav className="hidden md:flex items-center gap-10 mr-6">
            {NAV_LINKS.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs uppercase tracking-widest2 text-espresso/80 transition-colors hover:text-gold-dark",
                  pathname === link.href && "text-gold-dark"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href={session ? "/account" : "/login"}
            aria-label={session ? "Tài khoản của tôi" : "Đăng nhập"}
            className="flex h-11 w-11 items-center justify-center text-espresso/80 hover:text-gold-dark transition-colors"
          >
            <User size={20} strokeWidth={1.5} />
          </Link>

          <Link
            href="/cart"
            aria-label="Giỏ hàng"
            className="relative flex h-11 w-11 items-center justify-center text-espresso/80 hover:text-gold-dark transition-colors"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {hydrated && totalItems > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-medium text-ivory">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-gold/20 bg-ivory transition-[max-height] duration-300 ease-luxe",
          menuOpen ? "max-h-80" : "max-h-0"
        )}
      >
        <nav className="container flex flex-col py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-3 text-sm uppercase tracking-widest2 text-espresso/80 border-b border-gold/10 last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
