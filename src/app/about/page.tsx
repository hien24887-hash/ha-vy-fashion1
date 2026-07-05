import type { Metadata } from "next";
import BrandStory from "@/components/home/BrandStory";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description: "Câu chuyện thương hiệu HA VY FASHION — nơi vẻ đẹp cổ điển gặp gỡ tinh thần hiện đại.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="container py-20 text-center">
        <p className="text-xs uppercase tracking-widest3 text-gold-dark">Câu chuyện của chúng tôi</p>
        <h1 className="mt-4 font-serif text-4xl md:text-5xl text-charcoal max-w-2xl mx-auto">
          Được sinh ra từ niềm đam mê với vẻ đẹp vượt thời gian
        </h1>
        <div className="mt-10 max-w-2xl mx-auto space-y-6 text-left text-sm leading-relaxed text-espresso/70">
          <p>
            HA VY FASHION được thành lập với một khát vọng giản dị: mang đến cho người phụ nữ
            Việt những thiết kế thời trang xa xỉ, nơi sự tinh tế cổ điển hoà quyện cùng nét
            duyên dáng hiện đại. Mỗi bộ sưu tập là một hành trình khám phá vẻ đẹp nội tại,
            được kể lại qua từng chất liệu, đường cắt may và chi tiết thủ công tỉ mỉ.
          </p>
          <p>
            Chúng tôi tin rằng thời trang thực sự xa xỉ không nằm ở sự phô trương, mà ở sự
            tinh giản có chủ đích — nơi từng đường kim mũi chỉ đều mang một câu chuyện, và mỗi
            thiết kế đều được tạo ra để đồng hành cùng người mặc qua nhiều thế hệ.
          </p>
          <p>
            Từ những xưởng dệt lụa lâu đời đến đôi bàn tay nghệ nhân lành nghề, HA VY FASHION
            cam kết theo đuổi sự hoàn mỹ trong từng chi tiết nhỏ nhất, để mỗi sản phẩm đến tay
            bạn đều là một tác phẩm nghệ thuật đích thực.
          </p>
        </div>
      </section>

      <BrandStory />
    </div>
  );
}
