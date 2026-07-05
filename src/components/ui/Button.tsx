import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs uppercase tracking-widest2 transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none px-8 py-4";

const variants: Record<Variant, string> = {
  primary: "bg-charcoal text-ivory hover:bg-gold-dark",
  outline: "border border-charcoal text-charcoal hover:border-gold-dark hover:text-gold-dark",
  ghost: "text-charcoal hover:text-gold-dark",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

export function LinkButton({ href, variant = "primary", className, children }: LinkButtonProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
