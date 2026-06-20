---
title: "Hệ thống RBAC + Filter: tại sao không dùng ABAC?"
date: 2025-03-11
tags: ["architecture", "permissions", "security", "design-decisions", "multi-tenant"]
description: "Ba mô hình phân quyền, mỗi cái có đánh đổi. Tại sao RBAC + Filter vượt trội hơn ABAC cho hầu hết hệ thống?"
thumbnail: /images/posts/permission-engine.png
draft: false
---

Lần đầu tôi đọc về ABAC, tôi tưởng đó là giải pháp tuyệt vời. Linh hoạt tuyệt đối, handle được mọi trường hợp, không cần hardcode gì cả. Rồi khi thực tế triển khai phân quyền cho hệ thống multi-tenant, tôi lặng im. Không phải vì ABAC không tốt, mà vì nó quá tốt, tốt đến mức admin không thể quản trị.

## Ba mô hình, ba con đường

Trước khi chọn, phải hiểu cái gì mà bạn đánh đổi.

**RBAC** (Role-Based Access Control) là cách cũ nhất. Bạn gán role cho user, role liên kết với permission. Xong. Đơn giản, dễ hiểu, dễ cache. Nhưng cứng như đá. Nếu bạn cần phân quyền theo site, theo department, theo bất cứ cái gì khác, bạn phải tạo role mới. 100 site = 100 role. Chuyển site = tạo role lại.

**ABAC** (Attribute-Based Access Control) là cách mới nhất. Bạn viết rule. Rule là một hàm boolean phức tạp, kiểm tra các attribute của user, resource, environment. `user.siteId == resource.siteId AND user.role == "manager"`. Linh hoạt tuyệt đối. Nhưng là cơn ác mộng với admin. Người không kỹ thuật làm sao quản trị được rule này? Và cache? Debug? Audit? Đều trở nên khó khăn.

**Filter-Based Permission** là đứa con lai giữa RBAC và ABAC. Bạn dùng RBAC cho action (user có được phép truy cập page này không), nhưng dùng filter cho data scope (user thấy data nào). Filter là một cấu trúc đơn giản: `field + operator + value`. SiteId IN [dynamic]. Không phải rule engine, không phải logic phức tạp.

## Ví dụ thực tế

Bạn có hai quản lý. Cùng role "Site Manager". Nhưng quản lý A phụ trách site A, quản lý B phụ trách site B. Quản lý A chỉ được thấy báo cáo site A. Quản lý B chỉ được thấy báo cáo site B.

**Cách RBAC thuần:**

Tạo hai role. "Site A Manager" và "Site B Manager". Mỗi role có permission riêng. Quản lý A gán vào "Site A Manager", quản lý B gán vào "Site B Manager".

Rồi một ngày, quản lý A được chuyển lên quản lý toàn vùng. Bạn phải tạo role mới "Region Manager". Xóa role cũ. Gán role mới.

Bây giờ bạn có 200 site. Bạn có 200 role? 200 role nhân 5 cấp độ quản lý? Cơ sở dữ liệu bừa bộn. Người code mệt. Admin cũng mệt.

**Cách ABAC:**

Bạn viết rule. `user.siteId IN resource.sitesManaged`.

Nhưng ai cấu hình `user.siteId` và `resource.sitesManaged`? Người code. Nếu bạn cần thay đổi rule, bạn phải thay đổi code và deploy lại.

Hay bạn dùng rule engine. Admin có thể viết rule từ UI. Nhưng rule là gì? `user.attribute.siteId == resource.attribute.siteId OR (user.role == "regional_manager" AND user.region == resource.region)`.

Admin nhìn vào đó rồi bỏ cuộc. Quá phức. Sai một khoảng trắng là bug. Cache cái rule này? Chạy rule này mỗi request? Nó sẽ chậm. Debug khi user nói không thấy data? Bạn phải trace rule engine.

**Cách Filter-Based:**

Bạn tạo một role "Site Manager". Attach một filter vào role đó.

```
Filter:
  Field: SiteId
  Operator: IN
  Value: [dynamic, lấy từ user.site_managed]
```

Quản lý A được gán vào role "Site Manager" với `site_managed = [A]`. Quản lý B được gán vào cùng role nhưng `site_managed = [B]`. Quản lý region được gán vào cùng role nhưng `site_managed = [A, B, C, D, E]`.

Một role. Nhiều user. Khác nhau chỉ ở dữ liệu trong filter. Admin không cần hiểu rule gì. Chỉ cần chọn field, chọn operator, nhập value. Dễ hiểu, dễ audit, dễ cache.

Người code? Code một lần filter engine, xong. Không cần deploy lại mỗi khi thay đổi scope.

## So sánh bảng

| Tiêu chí | RBAC | RBAC + Filter | ABAC |
|----------|------|---------------|------|
| **Dễ quản trị** | ✓ Đơn giản | ✓ Dễ | ✗ Phức tạp |
| **Linh hoạt** | ✗ Cứng | ✓ Linh hoạt | ✓ Tuyệt đối |
| **Dễ cache** | ✓ Tốt | ✓ Tốt | ✗ Khó (rule engine) |
| **Dễ audit** | ✓ Rõ ràng | ✓ Rõ ràng | ✗ Khó hiểu |
| **Deploy mới** | Thường | Thường | Hiếm (nếu admin viết rule) |
| **Admin không kỹ thuật có dùng được không** | Dễ | Có | Không |

## Thực tế cho SME

Hầu hết các nền tảng SaaS cho SME (doanh nghiệp vừa) không cần ABAC. Cần gì? Multi-site, multi-department, role hierarchy, data scoping. RBAC + Filter xử lý hết.

Bạn chỉ cần ABAC khi bạn có logic phân quyền mà filter không thể biểu diễn. Ví dụ: "user chỉ xem ticket mà họ tạo ra, hoặc ticket gán cho họ, hoặc ticket trong department họ nếu họ là manager".

Khi nào? Hiếm lắm. Và khi nó xảy ra, bạn vẫn có thể dùng multiple filter (AND/OR combination) hoặc tách ra thành nhiều role với filter khác nhau.

## Nguyên tắc thiết kế

Khi bạn bắt đầu, hãy hỏi ba câu.

**Câu 1: Developer định nghĩa gì?**

Developer định nghĩa Page. Action (View, Edit, Delete, Export). Field trong database. Những cái này là tĩnh, không thay đổi.

**Câu 2: Admin cấu hình gì?**

Admin cấu hình Role. Permission (page nào, action nào). Filter (field nào, operator nào, value nào). Những cái này động, admin thay đổi mà không deploy.

**Câu 3: Ranh giới là ở đâu?**

Nếu admin cần viết code hoặc rule phức tạp, bạn chọn sai mô hình.

Nếu admin chỉ cần chọn từ dropdown, bạn chọn đúng.

RBAC + Filter là mô hình mà admin chỉ cần chọn. Role từ dropdown. Field từ dropdown. Operator từ dropdown. Value tùy loại field.

Không code. Không rule. Không tổn thương.

## Kết

Tôi không nói ABAC xấu. ABAC tốt cho những hệ thống quản lý phức tạp, như quản lý truy cập trên các infrastructure cloud. Nhưng cho phân quyền trong ứng dụng, cho hầu hết trường hợp, RBAC + Filter là cân bằng đúng giữa sự phức tạp và tính linh hoạt, giữa sức mạnh và sử dụng được.

Khi bạn lên kế hoạch hệ thống phân quyền tiếp theo, hãy hỏi admin: "Bạn cần quản trị gì? Bạn có thể làm bằng dropdown được không? Hay bạn cần viết logic phức tạp?"

Câu trả lời sẽ quyết định bạn chọn mô hình nào.
