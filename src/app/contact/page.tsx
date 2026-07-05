import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ với HA VY FASHION để được tư vấn về sản phẩm và dịch vụ.",
};

export default function ContactPage() {
  return (
    <div className="container py-20">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-widest3 text-gold-dark">Kết nối với chúng tôi</p>
        <h1 className="mt-3 font-serif text-4xl text-charcoal">Liên hệ</h1>
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-xl text-charcoal mb-6">Thông tin cửa hàng</h2>
          <div className="space-y-5 text-sm text-espresso/70">
            <p className="flex items-start gap-3">
              <MapPin size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-dark" />
              12 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
            </p>
            <p className="flex items-center gap-3">
              <Phone size={18} strokeWidth={1.5} className="shrink-0 text-gold-dark" />
              (028) 3822 1234
            </p>
            <p className="flex items-center gap-3">
              <Mail size={18} strokeWidth={1.5} className="shrink-0 text-gold-dark" />
              hello@havyfashion.vn
            </p>
            <p className="flex items-center gap-3">
              <Clock size={18} strokeWidth={1.5} className="shrink-0 text-gold-dark" />
              9:00 – 21:00, tất cả các ngày trong tuần
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-xl text-charcoal mb-6">Gửi tin nhắn cho chúng tôi</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
