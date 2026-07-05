import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ tên đầy đủ"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ").optional().or(z.literal("")),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  line1: z.string().min(5, "Vui lòng nhập địa chỉ chi tiết"),
  city: z.string().min(2, "Vui lòng nhập tỉnh/thành phố"),
  district: z.string().optional().or(z.literal("")),
  ward: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().nullable(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Giỏ hàng đang trống"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Nội dung tối thiểu 10 ký tự"),
});
