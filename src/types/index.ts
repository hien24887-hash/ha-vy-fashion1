import type { Prisma } from "@prisma/client";

export type ProductCardData = Prisma.ProductGetPayload<{
  include: { images: true; category: true };
}>;

export type ProductDetailData = Prisma.ProductGetPayload<{
  include: { images: true; category: true; variants: true };
}>;
