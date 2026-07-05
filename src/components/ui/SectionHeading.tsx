import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-xs uppercase tracking-widest3 text-gold-dark">{eyebrow}</p>
      )}
      <h2 className="font-serif text-3xl md:text-4xl text-charcoal">{title}</h2>
    </div>
  );
}
