import crypto from "crypto";

const PARTNER_CODE = process.env.MOMO_PARTNER_CODE!;
const ACCESS_KEY = process.env.MOMO_ACCESS_KEY!;
const SECRET_KEY = process.env.MOMO_SECRET_KEY!;
const ENDPOINT = process.env.MOMO_ENDPOINT!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

interface CreateMomoPaymentParams {
  orderId: string;
  amount: number;
  orderInfo: string;
}

interface MomoCreateResponse {
  payUrl?: string;
  resultCode: number;
  message: string;
  [key: string]: unknown;
}

export async function createMomoPayment({
  orderId,
  amount,
  orderInfo,
}: CreateMomoPaymentParams): Promise<MomoCreateResponse> {
  const requestId = `${Date.now()}-${orderId}`;
  const redirectUrl = `${BASE_URL}/checkout/success?orderId=${orderId}`;
  const ipnUrl = `${BASE_URL}/api/momo/ipn`;
  const requestType = "captureWallet";
  const extraData = "";

  const rawSignature =
    `accessKey=${ACCESS_KEY}&amount=${amount}&extraData=${extraData}` +
    `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
    `&partnerCode=${PARTNER_CODE}&redirectUrl=${redirectUrl}` +
    `&requestId=${requestId}&requestType=${requestType}`;

  const signature = crypto.createHmac("sha256", SECRET_KEY).update(rawSignature).digest("hex");

  const body = {
    partnerCode: PARTNER_CODE,
    partnerName: "HA VY FASHION",
    storeId: "HaVyFashionStore",
    requestId,
    amount: String(amount),
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang: "vi",
    requestType,
    autoCapture: true,
    extraData,
    signature,
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return res.json();
}

interface MomoQueryResponse {
  resultCode: number;
  message: string;
  transId?: number | string;
  [key: string]: unknown;
}

// Fallback check used on the success page: MoMo's IPN webhook cannot reach
// localhost during development (and delivery isn't always instant even in
// production), so we actively query the transaction status as a backstop.
export async function queryMomoTransaction(orderId: string): Promise<MomoQueryResponse> {
  const requestId = `${Date.now()}-query-${orderId}`;
  const rawSignature =
    `accessKey=${ACCESS_KEY}&orderId=${orderId}&partnerCode=${PARTNER_CODE}&requestId=${requestId}`;
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(rawSignature).digest("hex");

  const res = await fetch(ENDPOINT.replace("/create", "/query"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      partnerCode: PARTNER_CODE,
      requestId,
      orderId,
      lang: "vi",
      signature,
    }),
  });

  return res.json();
}

export interface MomoIpnPayload {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number | string;
  orderInfo: string;
  orderType: string;
  transId: number | string;
  resultCode: number | string;
  message: string;
  payType: string;
  responseTime: number | string;
  extraData: string;
  signature: string;
}

// MoMo signs every IPN callback; recomputing the signature and comparing is
// the only way to confirm the "payment succeeded" notification is genuine
// and not forged by a third party hitting our webhook directly.
export function verifyMomoIpnSignature(payload: MomoIpnPayload): boolean {
  const rawSignature =
    `accessKey=${ACCESS_KEY}&amount=${payload.amount}&extraData=${payload.extraData}` +
    `&message=${payload.message}&orderId=${payload.orderId}&orderInfo=${payload.orderInfo}` +
    `&orderType=${payload.orderType}&partnerCode=${payload.partnerCode}` +
    `&payType=${payload.payType}&requestId=${payload.requestId}` +
    `&responseTime=${payload.responseTime}&resultCode=${payload.resultCode}` +
    `&transId=${payload.transId}`;

  const expected = crypto.createHmac("sha256", SECRET_KEY).update(rawSignature).digest("hex");
  return expected === payload.signature;
}
