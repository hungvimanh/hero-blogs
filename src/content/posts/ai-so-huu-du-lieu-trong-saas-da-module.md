---
title: "Ai sở hữu dữ liệu trong một hệ thống SaaS đa module?"
date: 2025-02-27
tags: ["architecture", "multi-tenant", "data-design", "microservices"]
description: "Thêm cột TenantId vào mọi bảng không giải quyết được câu hỏi thực sự: dữ liệu nào thuộc về nhà phát triển, cái nào thuộc về khách hàng."
thumbnail: /images/posts/data-models.png
draft: false
---

Tôi từng nghĩ làm hệ thống multi-tenant rất đơn giản. Chỉ cần thêm một cột `TenantId` vào mọi bảng, rồi chèn điều kiện lọc tự động ở tầng ORM là xong. Mọi query sẽ tự động giới hạn dữ liệu của một tenant, không thể nhìn thấy data của tenant khác. Bài toán xong.

Nhưng khi hệ thống phình to ra nhiều module độc lập, cách tiếp cận ngây thơ này bắt đầu tạo ra những cơn đau đầu về mặt kiến trúc.

## Vấn đề không nhìn thấy ngay

Giả sử bạn có module Inspection quản lý các phiếu kiểm tra. Inspection tạo một cấu trúc phiếu: có trường nhiệt độ, tên người giám sát, danh sách thiết bị dạng bảng.

Sau đó, bạn tạo module Task để tạo các công việc. Task muốn tham chiếu đến "Loại thiết bị" mà Inspection đã định nghĩa, để user chọn thiết bị từ danh sách của Inspection.

Nghe đơn giản. Nhưng câu hỏi xuất hiện: **cấu trúc "Loại thiết bị" này sở hữu bởi ai?**

Nếu bạn để Tenant A tự định nghĩa thêm trường mới vào cấu trúc phiếu kiểm tra, thì Tenant B sẽ thấy những trường này không? Hay chúng bắt buộc chung cho tất cả tenant?

Nếu để Tenant A thêm cột tuỳ ý, thì khi bạn muốn nâng cấp cấu trúc phiếu ở phiên bản tiếp theo, bạn làm gì với dữ liệu của Tenant A? Họ có thể gặp lỗi migration. Hoặc còn tệ hơn, bạn phải duy trì nhiều schema khác nhau cùng lúc.

Vấn đề này không phải là một bug trong code. Nó là một quyết định kiến trúc.

## Phân loại quyền sở hữu

Thay vì cứ nghĩ "thêm TenantId, xong", tôi bắt đầu phân loại rõ ràng: **cái nào là của nhà phát triển, cái nào là của khách hàng?**

**RequisitionEntity** (cấu trúc loại phiếu): khai báo trong code của module Inspection. Nó là chung cho tất cả tenant dùng Inspection. Nếu Tenant A cần phiếu kiểm tra có thêm trường nhiệt độ, thì tất cả tenant khác cũng sẽ có trường đó (mặc dù có thể bỏ trống).

**RequisitionData** (phiếu thực tế): mỗi phiếu gắn với một TenantId cụ thể. Tenant A chỉ thấy phiếu của họ. Tenant B chỉ thấy phiếu của họ. Hard filter bắt buộc tại mọi query.

**MasterEntity** (cấu trúc danh mục như "Loại thiết bị"): tương tự RequisitionEntity. Khai báo trong code, chung cho tất cả tenant.

**MasterData** (giá trị danh mục cụ thể): mỗi giá trị gắn với một TenantId. Danh sách thiết bị của Tenant A khác danh sách thiết bị của Tenant B.

Ranh giới này tạo ra một hệ quả quan trọng: **Tenant không thể tự thêm trường mới vào cấu trúc phiếu**. Chỉ nhà phát triển module Inspection mới có quyền đó. Nhà phát triển tạo một field mới, deploy code, tất cả tenant tự động có field đó.

Nghe hạn chế, nhưng điều này giải phóng bạn khỏi địa ngục migration dữ liệu.

## Tại sao code-first lại an toàn hơn

Có một cách khác: để Tenant định nghĩa cấu trúc phiếu trong database. Không cần deploy code. Tenant A muốn thêm trường? Họ vào admin portal, nhấp nút "Thêm trường", xong. Mọi người vui vẻ.

Cho đến khi...

Bạn muốn thay đổi kiểu dữ liệu của một trường từ String thành Decimal. Hoặc thêm ràng buộc validation. Hoặc xóa một trường đã lỗi thời. Bây giờ bạn phải kiểm tra tất cả tenant để xem ai đang dùng trường này, sau đó migration dữ liệu của họ. Nếu Tenant A tạo logic riêng dựa trên cấu trúc cũ, bạn có thể phá vỡ hệ thống của họ.

Với code-first, tất cả quy tắc cấu trúc đều đi qua code review. Bạn có version control. Bạn có thể test migration trước khi deploy. Nếu phá vỡ cái gì, bạn roll back ngay. Tenant không thể tự tạo ra những structure khiến tính uyển chuyển bị mất.

Đánh đổi là gì? Tenant không thể tùy chỉnh cấu trúc mà không cần developer. Nếu họ muốn thêm trường, họ phải liên hệ với bạn, bạn thêm vào code, deploy. Quá trình này có thể mất vài ngày.

Nhưng nhìn lại, điều đó là đúng cho một hệ thống lớn. Không phải mọi yêu cầu tuỳ chỉnh đều hợp lệ. Nhà phát triển đóng vai trò gatekeeper, đảm bảo dữ liệu không vỡ vụn.

## Cái giá của linh hoạt vô hạn

Tôi gặp các dự án cứ chạy theo hướng "tất cả là config" — database lưu mọi thứ, không có logic cứng nhắc trong code. Lúc đầu, nó cảm thấy như là chiến thắng. Bạn có thể thay đổi behavior mà không cần deploy. Khách hàng vui.

Nhưng khi hệ thống chứa 5 năm dữ liệu từ hàng trăm tenant, mỗi cái có schema khác nhau, bạn không thể migrate. Bạn không thể tối ưu. Bạn chỉ có thể sợ hãi.

Code-first không hoàn hảo. Nó cần deploy. Nó cần tư duy kỹ lưỡng về versioning. Nhưng nó cho bạn một điểm tựa để kiểm soát sự hỗn loạn.

## Khi bạn thiết kế hệ thống multi-tenant tiếp theo

Hãy hỏi từng phần dữ liệu: ai sở hữu cái này?

Nếu đó là cấu trúc định nghĩa, và bạn muốn toàn bộ tenant cùng tuân theo một bộ quy tắc, thì để nó trong code. Bạn kiểm soát. Bạn đảm bảo.

Nếu đó là dữ liệu cụ thể — một phiếu, một danh mục, một bản ghi — thì gắn nó với TenantId. Tenant có quyền full với dữ liệu của họ. Nhưng không được chạm vào quy tắc.

Ranh giới này có vẻ hẹp. Nhưng nó là sự khác biệt giữa một hệ thống có thể phát triển và một hệ thống bị khoá.

Bạn đã từng chọn sai khi quyết định ai sở hữu dữ liệu không?
