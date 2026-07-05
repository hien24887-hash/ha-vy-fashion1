import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons/SocialIcons";
import NewsletterForm from "@/components/home/NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/90">
      <div className="container py-16 grid grid-cols-1 gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-serif text-2xl tracking-widest2 text-ivory">HA VY</p>
          <p className="mt-1 text-[11px] uppercase tracking-widest3 text-gold-light">Fashion</p>
          <p className="mt-5 text-sm leading-relaxed text-ivory/60 max-w-xs">
            Thời trang xa xỉ dành cho những người phụ nữ trân trọng sự tinh tế,
            vượt thời gian và tay nghề thủ công tỉ mỉ.
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
            >
              <FacebookIcon size={18} />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-gold-light mb-5">Cửa hàng</p>
          <ul className="space-y-3 text-sm text-ivory/70">
            <li><Link className="hover:text-gold-light transition-colors" href="/shop">Tất cả sản phẩm</Link></li>
            <li><Link className="hover:text-gold-light transition-colors" href="/shop?featured=1">Bộ sưu tập nổi bật</Link></li>
            <li><Link className="hover:text-gold-light transition-colors" href="/shop?isNew=1">Hàng mới về</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-gold-light mb-5">Về chúng tôi</p>
          <ul className="space-y-3 text-sm text-ivory/70">
            <li><Link className="hover:text-gold-light transition-colors" href="/about">Câu chuyện thương hiệu</Link></li>
            <li><Link className="hover:text-gold-light transition-colors" href="/contact">Liên hệ</Link></li>
            <li><Link className="hover:text-gold-light transition-colors" href="/account">Tài khoản của tôi</Link></li>
          </ul>
          <div className="mt-6 space-y-3 text-sm text-ivory/60">
            <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" strokeWidth={1.5} /> 12 Đồng Khởi, Quận 1, TP. Hồ Chí Minh</p>
            <p className="flex items-center gap-2"><Phone size={16} strokeWidth={1.5} /> (028) 3822 1234</p>
            <p className="flex items-center gap-2"><Mail size={16} strokeWidth={1.5} /> hello@havyfashion.vn</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-gold-light mb-5">Nhận tin ưu đãi</p>
          <p className="text-sm text-ivory/60 mb-4">
            Đăng ký để nhận thông tin bộ sưu tập mới và ưu đãi dành riêng cho bạn.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ivory/40">
          <p>© {new Date().getFullYear()} HA VY FASHION. Đã đăng ký bản quyền.</p>
          <p>Thanh toán an toàn qua MoMo</p>
        </div>
      </div>
    </footer>
  );
}
