import { cn } from "@/lib/utils";

// Elegant, dependency-free placeholder shown until real product photography is
// uploaded (see prisma/seed.ts — products are seeded without images on purpose).
export default function ProductPlaceholder({
  name,
  category,
  className,
}: {
  name: string;
  category?: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-ivory to-sand/70 p-6 text-center",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-3 border border-gold/30" />
      <span className="font-serif text-4xl italic text-gold-dark/70">{initials}</span>
      <p className="mt-3 font-serif text-base text-espresso/70 line-clamp-2">{name}</p>
      {category && (
        <p className="mt-1 text-[10px] uppercase tracking-widest2 text-espresso/40">{category}</p>
      )}
    </div>
  );
}
