import { Gem, Scissors, Sparkles } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const PILLARS = [
  {
    icon: Gem,
    title: "Chất liệu cao cấp",
    description:
      "Lụa tơ tằm, len cashmere và da thuộc được tuyển chọn kỹ lưỡng từ những xưởng dệt uy tín nhất.",
  },
  {
    icon: Scissors,
    title: "Thủ công tinh xảo",
    description:
      "Mỗi thiết kế được may đo tỉ mỉ bởi những nghệ nhân giàu kinh nghiệm, chú trọng từng chi tiết nhỏ nhất.",
  },
  {
    icon: Sparkles,
    title: "Thiết kế độc quyền",
    description:
      "Các bộ sưu tập giới hạn, kết hợp giữa tinh thần cổ điển Châu Âu và nét duyên dáng Á Đông.",
  },
];

export default function BrandStory() {
  return (
    <section className="bg-charcoal py-24 text-ivory">
      <div className="container">
        <SectionHeading
          eyebrow="Di sản của chúng tôi"
          title="Nghệ thuật kiến tạo vẻ đẹp"
          className="[&>p]:text-gold-light [&>h2]:text-ivory"
        />
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40">
                <Icon size={22} strokeWidth={1.25} className="text-gold-light" />
              </div>
              <h3 className="mt-6 font-serif text-xl text-ivory">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/60">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
