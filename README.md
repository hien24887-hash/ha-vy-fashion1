# HA VY FASHION

Website thương mại điện tử cho thương hiệu thời trang xa xỉ HA VY FASHION.
Xây dựng bằng Next.js (Node.js), Prisma, NextAuth và tích hợp thanh toán MoMo.

## Công nghệ sử dụng

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Prisma ORM** — SQLite khi phát triển local, PostgreSQL (Neon) khi deploy
- **NextAuth v4** — đăng nhập/đăng ký bằng email & mật khẩu
- **Zustand** — giỏ hàng lưu ở localStorage
- **MoMo Payment Gateway** — thanh toán trực tuyến

## Bắt đầu phát triển local

```bash
npm install
cp .env.example .env      # rồi điền các biến môi trường cần thiết
npx prisma migrate dev    # tạo database SQLite local
npm run db:seed           # nạp dữ liệu sản phẩm mẫu
npm run dev
```

Mở http://localhost:3000.

Tài khoản demo để test đăng nhập: `demo@havyfashion.vn` / `havyfashion123`

## Quản lý sản phẩm (không có trang admin)

Theo yêu cầu, dự án **không có trang quản trị (admin dashboard)**. Sản phẩm,
danh mục, và đơn hàng được quản lý trực tiếp qua **Prisma Studio** — một giao
diện quản lý database trực quan, chạy bằng lệnh:

```bash
npx prisma studio
```

Lệnh này mở một trang web local (thường là http://localhost:5555) cho phép
bạn xem, thêm, sửa, xoá dữ liệu Product, ProductImage, ProductVariant,
Category, Order... mà không cần viết code. Đây cũng là nơi bạn upload URL
ảnh sản phẩm thật (xem mục "Thêm ảnh sản phẩm thật" bên dưới).

Khi deploy lên Vercel với PostgreSQL, chạy `npx prisma studio` với
`DATABASE_URL` trỏ tới database production để chỉnh sửa dữ liệu thật.

### Thêm ảnh sản phẩm thật

Hiện tại sản phẩm chưa có ảnh thật — giao diện tự hiển thị placeholder cao
cấp (khối gradient kem/vàng với tên sản phẩm) cho tới khi có ảnh. Để thêm ảnh:

1. Upload ảnh lên một dịch vụ lưu trữ (khuyến nghị: [Cloudinary](https://cloudinary.com)
   free tier, hoặc [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)).
2. Mở Prisma Studio, vào bảng `ProductImage`, thêm dòng mới với `productId`
   tương ứng và `url` là link ảnh (https).
3. Ảnh sẽ tự hiển thị ngay trên trang sản phẩm và danh sách — không cần sửa code.

Nếu dùng thêm nguồn ảnh khác ngoài Cloudinary/Vercel Blob, cần thêm hostname
đó vào `images.remotePatterns` trong `next.config.mjs`.

## Deploy lên Vercel

### 1. Tạo database PostgreSQL (Neon)

SQLite chỉ dùng để phát triển local — hệ thống file trên Vercel không lưu
trữ lâu dài giữa các lần chạy serverless. Trước khi deploy:

1. Tạo tài khoản miễn phí tại [neon.tech](https://neon.tech) (hoặc dùng
   Vercel Postgres/Supabase).
2. Tạo project mới, copy connection string (dạng `postgresql://...`).
3. Sửa `prisma/schema.prisma`, đổi datasource:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

4. Chạy để tạo bảng trên database mới:

   ```bash
   DATABASE_URL="postgresql://..." npx prisma migrate deploy
   DATABASE_URL="postgresql://..." npx prisma db seed
   ```

### 2. Đẩy code lên GitHub

```bash
git add -A
git commit -m "Initial HA VY FASHION website"
git remote add origin <URL_REPO_GITHUB_CUA_BAN>
git push -u origin master
```

### 3. Import project vào Vercel

1. Vào [vercel.com/new](https://vercel.com/new), chọn repo GitHub vừa tạo.
2. Vercel tự nhận diện Next.js, không cần chỉnh build command.
3. Thêm các Environment Variables (Settings → Environment Variables):

   | Biến | Giá trị |
   |---|---|
   | `DATABASE_URL` | connection string PostgreSQL (Neon) |
   | `NEXTAUTH_SECRET` | chuỗi ngẫu nhiên, tạo bằng `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | URL production, vd `https://havyfashion.vercel.app` |
   | `MOMO_PARTNER_CODE` | mã đối tác MoMo (xem mục MoMo bên dưới) |
   | `MOMO_ACCESS_KEY` | access key MoMo |
   | `MOMO_SECRET_KEY` | secret key MoMo |
   | `MOMO_ENDPOINT` | `https://payment.momo.vn/v2/gateway/api/create` (production) |
   | `NEXT_PUBLIC_BASE_URL` | URL production, giống `NEXTAUTH_URL` |

4. Deploy. Vercel sẽ build và cấp domain dạng `*.vercel.app`.

### 4. Cấu hình MoMo (quan trọng)

Dự án hiện dùng **thông tin sandbox công khai của MoMo** (trong `.env`) chỉ
để test — mọi giao dịch chỉ là giả lập, không mất tiền thật. Để nhận thanh
toán thật:

1. Đăng ký tài khoản đối tác tại [business.momo.vn](https://business.momo.vn).
2. Sau khi được duyệt, MoMo cấp `partnerCode`, `accessKey`, `secretKey` thật.
3. Cập nhật 3 biến này trên Vercel, đồng thời đổi `MOMO_ENDPOINT` sang
   `https://payment.momo.vn/v2/gateway/api/create` (bỏ `test-` ở đầu).
4. Khai báo IPN URL với MoMo (nếu được yêu cầu):
   `https://<domain-cua-ban>/api/momo/ipn`.

### 5. Gắn tên miền riêng (tuỳ chọn)

Vercel → Settings → Domains → thêm domain đã mua, trỏ DNS theo hướng dẫn của
Vercel. Sau đó cập nhật lại `NEXTAUTH_URL` và `NEXT_PUBLIC_BASE_URL`.

## Cấu trúc thư mục chính

```
prisma/schema.prisma       Mô hình database
prisma/seed.ts             Dữ liệu sản phẩm mẫu
src/app/                   Các trang (App Router)
src/components/            UI components theo từng khu vực
src/lib/                   Prisma client, NextAuth config, MoMo, giỏ hàng, validation
```
