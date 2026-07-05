import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
import { createMomoPayment } from "@/lib/momo";

const FREE_SHIPPING_THRESHOLD = 3_000_000;
const FLAT_SHIPPING_FEE = 50_000;

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const { items, ...customer } = parsed.data;
  const session = await getServerSession(authOptions);

  // Re-fetch authoritative prices/stock from the database — never trust
  // amounts submitted by the client.
  const orderItemsData = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: { images: true, variants: true },
    });
    if (!product) {
      return NextResponse.json({ error: `Sản phẩm không tồn tại` }, { status: 400 });
    }

    let variant = null;
    if (item.variantId) {
      variant = product.variants.find((v) => v.id === item.variantId) ?? null;
      if (!variant) {
        return NextResponse.json({ error: `Phân loại sản phẩm không hợp lệ` }, { status: 400 });
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `${product.name} không đủ hàng trong kho` },
          { status: 400 }
        );
      }
    }

    subtotal += product.price * item.quantity;
    orderItemsData.push({
      productId: product.id,
      variantId: variant?.id,
      productName: product.name,
      variantLabel: variant ? [variant.color, variant.size].filter(Boolean).join(" / ") : null,
      price: product.price,
      quantity: item.quantity,
      imageUrl: product.images[0]?.url,
    });
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const orderNumber = generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session?.user?.id,
      guestName: customer.fullName,
      guestEmail: customer.email,
      guestPhone: customer.phone,
      shippingAddress: JSON.stringify(customer),
      subtotal,
      shippingFee,
      total,
      items: { create: orderItemsData },
    },
  });

  // Decrement stock for variants now that the order is placed.
  for (const item of orderItemsData) {
    if (item.variantId) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }

  const momoResponse = await createMomoPayment({
    orderId: order.orderNumber,
    amount: total,
    orderInfo: `Thanh toan don hang ${order.orderNumber} - HA VY FASHION`,
  });

  if (momoResponse.resultCode !== 0 || !momoResponse.payUrl) {
    return NextResponse.json(
      {
        error:
          "Không thể khởi tạo thanh toán MoMo. Đơn hàng của bạn đã được ghi nhận, vui lòng liên hệ để được hỗ trợ.",
        orderId: order.id,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ orderId: order.id, payUrl: momoResponse.payUrl });
}
