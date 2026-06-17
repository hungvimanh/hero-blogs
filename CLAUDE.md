# CLAUDE.md — Blog cá nhân về công nghệ

Đọc `BLOG_STYLE.md` và `BLOG_IDENTITY.md` để hiểu đầy đủ về tác giả và phong cách.
File này chỉ chứa quy tắc làm việc.

---

## Đây là gì

Blog cá nhân của một software engineer / solution architect (~8 năm).
Viết bằng **tiếng Việt**. Publish lên GitHub Pages với custom domain.
Output là file **Markdown** chuẩn.

---

## Workflow mặc định

Khi người dùng đưa vào **ý tưởng hoặc dàn bài thô**:

**Bước 1 — Đề xuất trước khi viết**

Trả về:
- **Tiêu đề** (1–3 lựa chọn, không clickbait)
- **Hook** (câu mở đầu hoặc tình huống thực tế làm điểm khởi đầu)
- **Dàn bài** (5 phần theo cấu trúc chuẩn bên dưới, mỗi phần 1–2 câu tóm tắt hướng đi)
- **Câu hỏi kết** (câu dùng để kết bài, gợi suy nghĩ)
- Nếu thiếu thông tin để viết tốt → hỏi tối đa 2–3 câu

Dừng. Chờ người dùng duyệt.

**Bước 2 — Viết bài hoàn chỉnh**

Chỉ thực hiện sau khi được xác nhận.
Output: file Markdown hoàn chỉnh, sẵn sàng publish.

---

## Cấu trúc bài viết chuẩn

1. **Hook** — Mở bằng sai lầm, quan sát bất ngờ, hoặc giả định sai. Không mở bằng định nghĩa.
2. **Vấn đề** — Context, ràng buộc, tại sao giải pháp đơn giản không đủ.
3. **Khám phá** — Các lựa chọn, đánh đổi, quyết định kiến trúc, cái gì đã thất bại và tại sao.
4. **Bài học** — Nguyên tắc, mental model, insight kiến trúc rút ra được.
5. **Kết** — Câu hỏi gợi suy nghĩ hoặc một nguyên tắc thiết kế. Không tóm tắt máy móc.

---

## Giọng văn

- Tiếng Việt tự nhiên, không dịch ngược từ tiếng Anh.
- Đoạn ngắn. Câu ngắn. Từ đơn giản.
- Không thuyết giáo. Không hype. Không marketing.
- Thẳng thắn về sự không chắc chắn — "tôi không chắc", "lúc đó tôi sai" là ổn.
- Nhân vật chính của bài là **vấn đề**, không phải công nghệ.
- Mỗi bài nên khiến người đọc thấy: *"Mình cũng từng nghĩ vậy"* hoặc *"Mình chưa từng nghĩ tới góc này."*

---

## Cấm tuyệt đối

- Tiêu đề clickbait hoặc dạng listicle ("Top 5 lý do...", "Bí quyết...")
- Mở bài bằng định nghĩa ("X là một khái niệm trong...")
- Kết bài bằng tóm tắt ("Vậy là chúng ta đã thấy rằng...")
- Em dash (—) và en dash (–) — dùng dấu phẩy hoặc xuống dòng thay thế
- Bold thừa (chỉ bold khi thực sự cần nhấn mạnh, không bold để trang trí)
- Từ AI điển hình: "rõ ràng", "quan trọng", "đáng chú ý", "không thể phủ nhận", "thú vị thay", "hãy cùng khám phá"
- Hedge vô nghĩa: "có thể nói rằng", "theo một nghĩa nào đó", "điều này có thể"
- Kết luận chung chung kiểu "Công nghệ luôn thay đổi, điều quan trọng là..."

---

## Format Markdown (frontmatter cho bài viết)

```markdown
---
title: "Tiêu đề bài viết"
date: YYYY-MM-DD
tags: ["Tag1", "Tag2"]
description: "Một câu mô tả ngắn cho SEO / preview"
thumbnail: /images/posts/ten-bai.jpg
draft: false
---

Nội dung...
```

- Dùng `##` cho các phần chính, `###` cho phần con nếu cần.
- Không dùng `#` (h1) trong bài vì title đã là h1.
- Code block dùng fenced code với language tag.
- Không dùng bảng trừ khi so sánh cụ thể và cần thiết.
- File đặt tại `src/content/posts/<slug>.md`
- Ảnh đặt tại `public/images/posts/`

---

## Web Stack

**Tech:** Astro 4 + Tailwind CSS v3 + TypeScript  
**Deploy:** GitHub Pages via GitHub Actions (`main` → auto deploy)  
**Domain:** herommt.io.vn

### Cấu trúc project

```
src/
  components/   Nav, ThemeToggle, PostCard, Tag, Hero, Footer
  content/posts/ *.md  (bài viết)
  layouts/      Base.astro, Post.astro
  pages/        index, blog/index, blog/[...slug], about, tags/[tag]
  styles/       global.css
public/
  CNAME         (herommt.io.vn)
  images/posts/ (thumbnails)
```

### Quy tắc lập trình frontend

**Design system:**
- Accent color: `rgb(var(--accent))` — `#3B7BFF` light, `#5B9BFF` dark (định nghĩa qua CSS var)
- Dark mode: class strategy (`class="dark"` trên `<html>`)
- Font: Plus Jakarta Sans (sans), Newsreader (serif/display), Geist Mono (code)
- Content width: `max-w-content` = `72ch`, padding `px-4 sm:px-6`
- Cards: `border border-zinc-200 dark:border-zinc-800 rounded-xl`

**Khi viết component Astro:**
- Dùng Tailwind classes, không viết CSS inline trừ khi cần CSS variable
- Responsive: mobile-first, breakpoint `sm:` cho desktop
- Ảnh: luôn có `loading="lazy"` (trừ above-the-fold), có `alt`
- Link nội bộ: dùng `href="/path"` tuyệt đối

**Khi thêm tính năng mới:**
1. Đọc component liên quan trước
2. Giữ đúng design language (xem design system trên)
3. Test dark mode + light mode
4. Không thêm dependency mới nếu có thể dùng Tailwind/Astro built-in

**Không dùng:**
- `Inter`, `Roboto`, `Open Sans` (font cấm theo skill minimalist-ui)
- `shadow-md`, `shadow-lg`, `shadow-xl` (shadow nặng)
- Gradient trừ khi cực kỳ cần thiết
- Emoji trong code/markup (text content OK)

### Skills dùng cho frontend

- `/design-taste-frontend` — khi cần thiết kế component mới hoặc page mới
- `/minimalist-ui` — khi cần đảm bảo đúng editorial aesthetic
- Không dùng `/gpt-taste` cho blog (quá nặng GSAP, không phù hợp)

---

## Skills có sẵn

- `/humanizer` — chạy sau khi viết xong bài để lọc AI patterns
- `/design-taste-frontend` — thiết kế component/page mới
- `/minimalist-ui` — kiểm tra aesthetic editorial
