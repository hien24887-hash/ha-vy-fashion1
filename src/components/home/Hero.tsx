import { LinkButton } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-gradient-to-b from-cream via-ivory to-ivory">
      <div className="pointer-events-none absolute inset-8 border border-gold/25 md:inset-16" />

      <div className="container relative z-10 flex flex-col items-center text-center py-24">
        <p className="text-xs uppercase tracking-widest3 text-gold-dark">
          Bộ sưu tập Thu Đông
        </p>
        <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-tight text-charcoal md:text-7xl">
          Vẻ đẹp cổ điển,
          <br />
          <span className="italic text-gold-dark">vượt thời gian</span>
        </h1>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-espresso/70 md:text-base">
          HA VY FASHION tôn vinh sự tinh tế trong từng đường kim mũi chỉ —
          nơi di sản thời trang cổ điển gặp gỡ tâm hồn người phụ nữ hiện đại.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <LinkButton href="/shop">Khám phá bộ sưu tập</LinkButton>
          <LinkButton href="/about" variant="outline">
            Câu chuyện thương hiệu
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
