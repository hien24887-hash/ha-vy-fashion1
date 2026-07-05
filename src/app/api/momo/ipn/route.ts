import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMomoIpnSignature, type MomoIpnPayload } from "@/lib/momo";

export async function POST(request: Request) {
  const payload = (await request.json()) as MomoIpnPayload;

  if (!verifyMomoIpnSignature(payload)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { orderNumber: payload.orderId } });
  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  const resultCode = Number(payload.resultCode);

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: resultCode === 0 ? "PAID" : "FAILED",
      status: resultCode === 0 ? "PROCESSING" : order.status,
      momoTransId: String(payload.transId),
    },
  });

  return new NextResponse(null, { status: 204 });
}
