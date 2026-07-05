import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Váy Đầm", slug: "vay-dam", description: "Những thiết kế đầm thanh lịch, tôn dáng." },
  { name: "Áo Khoác", slug: "ao-khoac", description: "Áo khoác cổ điển cho mọi mùa." },
  { name: "Túi Xách", slug: "tui-xach", description: "Túi xách da cao cấp, thủ công tinh xảo." },
  { name: "Phụ Kiện", slug: "phu-kien", description: "Điểm nhấn hoàn thiện phong cách của bạn." },
];

const SIZES = ["S", "M", "L"];

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  story?: string;
  price: number;
  compareAtPrice?: number;
  material: string;
  origin: string;
  featured?: boolean;
  isNew?: boolean;
  category: string;
  sizes?: string[];
  colors?: string[];
};

const PRODUCTS: SeedProduct[] = [
  {
    name: "Đầm Lụa Cổ Điển Rêu Xanh",
    slug: "dam-lua-co-dien-reu-xanh",
    description:
      "Thiết kế đầm suông dáng dài từ lụa tơ tằm cao cấp, tông rêu xanh trầm ấm, tôn lên vẻ đẹp thanh lịch và bí ẩn.",
    price: 4_200_000,
    material: "100% lụa tơ tằm",
    origin: "Sản xuất tại Việt Nam",
    featured: true,
    isNew: true,
    category: "vay-dam",
    sizes: SIZES,
  },
  {
    name: "Đầm Maxi Nhung Đen Sang Trọng",
    slug: "dam-maxi-nhung-den-sang-trong",
    description:
      "Đầm maxi chất nhung mềm mại, tay dài, form dáng ôm nhẹ tôn đường cong, thích hợp cho những buổi tiệc tối trang trọng.",
    price: 5_800_000,
    compareAtPrice: 6_500_000,
    material: "Nhung cao cấp",
    origin: "Sản xuất tại Việt Nam",
    featured: true,
    category: "vay-dam",
    sizes: SIZES,
  },
  {
    name: "Đầm Suông Cashmere Kem",
    slug: "dam-suong-cashmere-kem",
    description:
      "Đầm suông tối giản từ len cashmere mềm mịn, tông kem trung tính dễ phối, phù hợp cho cả môi trường công sở lẫn dạo phố.",
    price: 3_900_000,
    material: "Len cashmere pha",
    origin: "Sản xuất tại Việt Nam",
    category: "vay-dam",
    sizes: SIZES,
  },
  {
    name: "Đầm Dạ Hội Satin Đỏ Rượu Vang",
    slug: "dam-da-hoi-satin-do-ruou-vang",
    description:
      "Đầm dạ hội satin ánh nhẹ, tông đỏ rượu vang quyến rũ, xẻ tà tinh tế — lựa chọn hoàn hảo cho những sự kiện đặc biệt.",
    price: 6_500_000,
    material: "Satin lụa",
    origin: "Sản xuất tại Việt Nam",
    isNew: true,
    category: "vay-dam",
    sizes: SIZES,
  },
  {
    name: "Áo Măng Tô Len Camel Cổ Điển",
    slug: "ao-mang-to-len-camel-co-dien",
    description:
      "Áo măng tô dáng dài từ len camel nguyên chất, đường may sắc sảo, mang hơi thở thời trang Châu Âu cổ điển.",
    price: 7_200_000,
    material: "Len camel nguyên chất",
    origin: "Nhập khẩu Ý",
    featured: true,
    category: "ao-khoac",
    sizes: SIZES,
  },
  {
    name: "Áo Khoác Dạ Đen Viền Nhung",
    slug: "ao-khoac-da-den-vien-nhung",
    description:
      "Áo khoác dạ dáng ôm với viền cổ nhung tinh tế, thiết kế sang trọng dành cho mùa đông.",
    price: 6_800_000,
    material: "Dạ pha len",
    origin: "Sản xuất tại Việt Nam",
    category: "ao-khoac",
    sizes: SIZES,
  },
  {
    name: "Áo Blazer Tweed Vintage",
    slug: "ao-blazer-tweed-vintage",
    description:
      "Blazer chất liệu tweed hoạ tiết vintage, form dáng vừa vặn, điểm nhấn cúc kim loại mạ vàng.",
    price: 5_200_000,
    material: "Tweed pha len",
    origin: "Sản xuất tại Việt Nam",
    isNew: true,
    category: "ao-khoac",
    sizes: SIZES,
  },
  {
    name: "Túi Xách Da Bê Vàng Đồng",
    slug: "tui-xach-da-be-vang-dong",
    description:
      "Túi xách da bê thật nguyên tấm, tông vàng đồng ấm áp, khoá kim loại mạ vàng 18K, thiết kế thủ công tỉ mỉ.",
    price: 8_900_000,
    material: "Da bê thật",
    origin: "Nhập khẩu Ý",
    featured: true,
    category: "tui-xach",
    colors: ["Vàng đồng", "Đen", "Nâu da bò"],
  },
  {
    name: "Túi Clutch Lụa Thêu Tay",
    slug: "tui-clutch-lua-theu-tay",
    description:
      "Clutch nhỏ gọn từ lụa cao cấp, hoạ tiết thêu tay tinh xảo, hoàn hảo cho những buổi dạ tiệc.",
    price: 3_400_000,
    material: "Lụa thêu tay",
    origin: "Sản xuất tại Việt Nam",
    category: "tui-xach",
    colors: ["Vàng gold", "Đen"],
  },
  {
    name: "Túi Đeo Chéo Da Cừu Nắp Gập",
    slug: "tui-deo-cheo-da-cuu-nap-gap",
    description:
      "Túi đeo chéo mềm mại từ da cừu thật, thiết kế nắp gập cổ điển, dây đeo có thể điều chỉnh.",
    price: 6_100_000,
    material: "Da cừu thật",
    origin: "Sản xuất tại Việt Nam",
    isNew: true,
    category: "tui-xach",
    colors: ["Nâu da bò", "Đen"],
  },
  {
    name: "Khăn Lụa Hoạ Tiết Cổ Điển",
    slug: "khan-lua-hoa-tiet-co-dien",
    description:
      "Khăn lụa vuông hoạ tiết lấy cảm hứng từ nghệ thuật cổ điển Châu Âu, có thể phối theo nhiều phong cách khác nhau.",
    price: 1_800_000,
    material: "100% lụa tơ tằm",
    origin: "Sản xuất tại Việt Nam",
    category: "phu-kien",
  },
  {
    name: "Thắt Lưng Da Khoá Vàng",
    slug: "that-lung-da-khoa-vang",
    description: "Thắt lưng da thật bản nhỏ, khoá kim loại mạ vàng khắc logo tinh tế.",
    price: 2_200_000,
    material: "Da bò thật",
    origin: "Sản xuất tại Việt Nam",
    featured: true,
    category: "phu-kien",
    colors: ["Đen", "Nâu da bò"],
  },
  {
    name: "Kính Mát Gọng Kim Loại Sang Trọng",
    slug: "kinh-mat-gong-kim-loai-sang-trong",
    description: "Kính mát gọng kim loại mảnh, tròng chống UV400, phong cách cổ điển Pháp.",
    price: 3_100_000,
    material: "Kim loại mạ vàng, tròng chống UV400",
    origin: "Nhập khẩu",
    category: "phu-kien",
  },
];

async function main() {
  console.log("Seeding database...");

  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }

  for (const p of PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        material: p.material,
        origin: p.origin,
        featured: p.featured ?? false,
        isNew: p.isNew ?? false,
        categoryId: categoryMap.get(p.category),
      },
    });

    if (p.sizes) {
      for (const size of p.sizes) {
        const sku = `${p.slug}-${size}`.toUpperCase();
        await prisma.productVariant.upsert({
          where: { sku },
          update: {},
          create: { productId: product.id, size, sku, stock: 12 },
        });
      }
    }

    if (p.colors) {
      for (const color of p.colors) {
        const sku = `${p.slug}-${color}`.toUpperCase().replace(/\s+/g, "-");
        await prisma.productVariant.upsert({
          where: { sku },
          update: {},
          create: { productId: product.id, color, sku, stock: 8 },
        });
      }
    }
  }

  const demoPasswordHash = await bcrypt.hash("havyfashion123", 10);
  await prisma.user.upsert({
    where: { email: "demo@havyfashion.vn" },
    update: {},
    create: {
      name: "Khách hàng Demo",
      email: "demo@havyfashion.vn",
      passwordHash: demoPasswordHash,
      phone: "0900000000",
    },
  });

  console.log("Seed complete.");
  console.log("Demo account: demo@havyfashion.vn / havyfashion123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
