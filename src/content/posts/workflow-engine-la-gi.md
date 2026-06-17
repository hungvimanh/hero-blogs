---
title: "Tôi đã hiểu sai Workflow Engine suốt 2 năm"
date: 2024-06-01
description: "Tôi từng nghĩ Workflow Engine chỉ là một chuỗi duyệt. Rồi hệ thống thực tế dạy tôi điều khác."
tags: ["Workflow", "Kiến trúc", "Bài học"]
thumbnail: /images/posts/workflow-engine.jpg
draft: false
---

Tôi từng nghĩ Workflow Engine chỉ là một chuỗi các bước duyệt nối tiếp nhau.

Người A duyệt → người B duyệt → xong.

Đơn giản vậy thôi.

## Sai từ đầu

Thực tế đầu tiên tôi gặp: quy trình phụ thuộc vào giá trị đơn hàng. Dưới 10 triệu thì chỉ cần trưởng phòng. Trên 10 triệu thì cần thêm giám đốc tài chính. Trên 100 triệu thì cần hội đồng.

Tôi sửa code. Xong.

Tuần sau: quy trình thay đổi theo phòng ban. Mỗi phòng có cấu hình riêng.

Tôi sửa code. Lần này mất nhiều giờ hơn.

Tháng sau: khách hàng muốn tự cấu hình quy trình mà không cần dev.

Tôi mới hiểu mình đang xây sai thứ từ đầu.

## Vấn đề thực sự

Tôi đã xây một **hệ thống duyệt** thay vì một **Workflow Engine**.

Hai thứ này khác nhau ở điểm quan trọng:

Hệ thống duyệt là code biết quy trình. Muốn thay đổi quy trình → phải thay đổi code.

Workflow Engine là code không biết quy trình. Quy trình là dữ liệu. Muốn thay đổi quy trình → thay đổi dữ liệu.

Đây là sự khác biệt giữa một cái không thể mở rộng và một cái có thể.

## Bài học

Câu hỏi đúng khi thiết kế không phải là *"Quy trình này hoạt động như thế nào?"*

Mà là *"Ai sẽ là người thay đổi quy trình này sau 6 tháng? Họ sẽ làm điều đó như thế nào?"*

Nếu câu trả lời là "dev phải sửa code" — bạn đang xây đúng thứ cho hôm nay nhưng sai thứ cho tương lai.

Câu hỏi này thay đổi toàn bộ cách tôi thiết kế hệ thống sau đó.
