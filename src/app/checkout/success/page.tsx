import Link from "next/link";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { queryMomoTransaction } from "@/lib/momo";
import { formatVND } from "@/lib/utils";
import { LinkButton } from "@/components/ui/Button";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  if (!searchParams.orderId) {
    return <StatusScreen icon="error" title="Không tìm thấy đơn hàng" />;
  }

  let order = await prisma.order.findUnique({ where: { orderNumber: searchParams.orderId } });

  if (!order) {
    return <StatusScreen icon="error" title="Không tìm thấy đơn hàng" />;
  }

  // The MoMo IPN webhook may not have arrived yet (it never reaches localhost,
  // and delivery can lag even in production) — actively verify as a fallback.
  if (order.paymentStatus === "UNPAID") {
    try {
      const result = await queryMomoTransaction(order.orderNumber);
      if (result.resultCode === 0) {
        order = await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "PAID",
            status: "PROCESSING",
            momoTransId: result.transId ? String(result.transId) : undefined,
          },
        });
      } else if (result.resultCode !== 1000 && result.resultCode !== 9000) {
        // 1000/9000 = transaction still pending on MoMo's side; anything else
        // (e.g. resultCode 1006) is unambiguous failure.
        order = await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "FAILED" },
        });
      }
    } catch {
      // Query failed — leave status as-is, user can refresh or contact support.
    }
  }

  if (order.paymentStatus === "PAID") {
    return (
      <StatusScreen icon="success" title="Thanh toán thành công">
        <p className="text-sm text-espresso/70">
          Cảm ơn bạn đã mua sắm tại HA VY FASHION. Mã đơn hàng của bạn là{" "}
          <span className="font-medium text-charcoal">{order.orderNumber}</span>.
        </p>
        <p className="mt-2 text-sm text-espresso/70">Tổng thanh toán: {formatVND(order.total)}</p>
      </StatusScreen>
    );
  }

  if (order.paymentStatus === "FAILED") {
    return (
      <StatusScreen icon="error" title="Thanh toán không thành công">
        <p className="text-sm text-espresso/70">
          Đơn hàng <span className="font-medium text-charcoal">{order.orderNumber}</span> chưa
          được thanh toán. Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.
        </p>
      </StatusScreen>
    );
  }

  return (
    <StatusScreen icon="pending" title="Đang xác nhận thanh toán">
      <p className="text-sm text-espresso/70">
        Đơn hàng <span className="font-medium text-charcoal">{order.orderNumber}</span> đang chờ
        xác nhận từ MoMo. Vui lòng tải lại trang sau ít phút.
      </p>
    </StatusScreen>
  );
}

function StatusScreen({
  icon,
  title,
  children,
}: {
  icon: "success" | "error" | "pending";
  title: string;
  children?: React.ReactNode;
}) {
  const Icon = icon === "success" ? CheckCircle2 : icon === "error" ? XCircle : Clock;
  const color = icon === "success" ? "text-gold-dark" : icon === "error" ? "text-red-700" : "text-espresso/60";

  return (
    <div className="container py-24 text-center">
      <Icon size={48} strokeWidth={1.25} className={`mx-auto ${color}`} />
      <h1 className="mt-6 font-serif text-3xl text-charcoal">{title}</h1>
      <div className="mt-4 max-w-md mx-auto">{children}</div>
      <div className="mt-10 flex justify-center gap-4">
        <LinkButton href="/shop" variant="outline">
          Tiếp tục mua sắm
        </LinkButton>
        <Link href="/" className="flex items-center text-xs uppercase tracking-widest2 text-espresso/60 hover:text-gold-dark">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
