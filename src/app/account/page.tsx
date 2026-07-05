import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/utils";
import SignOutButton from "@/components/account/SignOutButton";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao hàng",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã huỷ",
};

const PAYMENT_LABELS: Record<string, string> = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-16">
      <div className="flex items-center justify-between border-b border-gold/20 pb-6 mb-10">
        <div>
          <p className="text-xs uppercase tracking-widest3 text-gold-dark">Tài khoản của tôi</p>
          <h1 className="mt-2 font-serif text-3xl text-charcoal">
            Xin chào, {session!.user.name}
          </h1>
        </div>
        <SignOutButton />
      </div>

      <h2 className="font-serif text-xl text-charcoal mb-6">Lịch sử đơn hàng</h2>

      {orders.length === 0 ? (
        <p className="text-sm text-espresso/60">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-gold/20 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gold/10">
                <div>
                  <p className="font-medium text-charcoal">#{order.orderNumber}</p>
                  <p className="text-xs text-espresso/50">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest2 text-gold-dark">
                    {STATUS_LABELS[order.status] ?? order.status}
                  </p>
                  <p className="text-xs text-espresso/50">
                    {PAYMENT_LABELS[order.paymentStatus] ?? order.paymentStatus}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-espresso/70">
                    <span>
                      {item.productName}
                      {item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
                    </span>
                    <span>{formatVND(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end border-t border-gold/10 pt-4 text-sm font-medium text-charcoal">
                Tổng cộng: {formatVND(order.total)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
