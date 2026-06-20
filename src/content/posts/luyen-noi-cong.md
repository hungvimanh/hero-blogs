---
title: "Năm năm học chiêu thức, một ngày tôi bắt đầu luyện nội công"
date: 2024-08-08
description: "Tôi từng nghĩ biết nhiều pattern, framework là đủ. Rồi tôi xây một hệ thống chạy đúng code nhưng sai hoàn toàn domain."
tags: ["Domain-Driven Design", "Kiến trúc", "Tư duy"]
draft: false
---

Tôi từng xây một hệ thống approval workflow. Code review sạch. Test pass. Deploy không incident.

Sau một tháng, sales lead gửi email: "Cái quy trình duyệt này không đúng với cách chúng tôi làm việc."

Tôi mở code ra. Không có bug. Logic chạy đúng như tôi thiết kế. Nhưng thiết kế đó dựa trên cái gì? Dựa trên cái mô hình trong đầu tôi về cách approval hoạt động, không phải cách team sales thực sự vận hành quy trình của họ.

Hai thứ đó hóa ra rất khác nhau.

## Cái gap không ai hay nhắc đến

Khi làm việc với khách hàng, tôi thường nhận được những yêu cầu kiểu này: "Thêm bước duyệt của giám đốc tài chính với đơn trên 10 triệu", "Nếu reject thì quay lại người tạo", "Cần xem được lịch sử duyệt."

Tôi dịch những câu đó thành code. Nhanh. Gần như không dừng lại.

Nhưng cái tôi thực sự làm là dịch những câu đó thành *mô hình của tôi* về domain, rồi code cái mô hình đó. Cái mô hình trong đầu đó, tôi không kiểm tra với ai.

"Approval" với tôi là một state machine. Với họ, approval là cuộc hội thoại giữa người và người, có lúc bỏ qua bước, có lúc làm song song, có lúc cần giải thích bằng miệng trước khi nhấn nút.

Hai cái đó không bao giờ được đối chiếu với nhau.

## Năm năm tôi học gì

Tôi học SOLID, Clean Architecture, CQRS, Event Sourcing, cách chia layer, cách viết test, cách thiết kế API. Những thứ đó đều có ích.

Nhưng đó đều là chiêu thức: kỹ thuật có thể học trong vài tuần, áp dụng được, dạy lại cho người khác được. Framework mới ra là chiêu thức cũ bị thay. Cứ vài ba năm là một vòng.

Cái tôi không được dạy là nội công: làm sao ngồi với một domain expert hai tiếng đồng hồ và ra về với một mô hình mà cả hai đều nhận ra là đúng.

## DDD không phải pattern, là cách tư duy

Tôi đọc quyển *Domain-Driven Design Quickly* khá muộn, sau khoảng bốn năm đi làm.

Có một câu trong đó tôi đọc đi đọc lại: "In order to create good software, you have to know what that software is all about." Nghe thì hiển nhiên. Nhưng tác giả hỏi tiếp: ai thực sự biết domain? Không phải software architect. Không phải developer. Là những người trong ngành đó.

Điều DDD làm không phải thêm một lớp pattern lên trên code. Nó buộc bạn phải hỏi domain trước khi code.

Với Ubiquitous Language: khi tôi nói "Order" và khách hàng nói "Purchase Request", chúng tôi có đang nói về cùng một thứ không? Đôi khi có. Đôi khi không. Nếu hai bên dùng từ khác nhau và không ai nhận ra, model sẽ lệch từ từ, đến lúc không còn ai hiểu tại sao code lại viết như vậy.

Hay câu hỏi Entity hay Value Object: tôi từng làm mọi thứ thành Entity vì cảm giác an toàn hơn. Câu hỏi thật ra là thứ này có cần định danh kéo dài theo thời gian không. Approval step cần, vì nó có trạng thái, có lịch sử. Điều kiện duyệt thì không, nó chỉ là tập thuộc tính. Nhầm hai thứ này, code phức tạp thêm mà không rõ lý do.

Rồi Aggregate boundary: khi xóa một khách hàng, chuyện gì xảy ra với đơn hàng của họ? Khi thay đổi approval rule, nó ảnh hưởng đến request đang chạy dở không? Đây là câu hỏi domain, phải trả lời trước khi thiết kế schema.

Mỗi khái niệm trong DDD đều là cái cớ để hỏi domain, không phải thêm một lớp kỹ thuật.

## Cái không bị deprecated

Vài năm trước, microservices là thứ ai cũng phải học. Rồi "microservices considered harmful" bắt đầu xuất hiện. Rồi modular monolith quay lại. Rồi server components, edge computing, AI-native architecture.

Domain của một hệ thống ngân hàng không thay đổi vì framework mới ra. Business rules của approval vẫn là business rules dù bạn dùng REST hay GraphQL.

Hiểu domain, hỏi đúng câu, nhận ra khi nào mô hình trong đầu lệch khỏi thực tế, những thứ đó không có phiên bản mới thay thế.

## Cái tôi thay đổi sau đó

Tôi không còn bắt đầu bằng ERD hay class diagram nữa.

Tôi bắt đầu bằng một cuộc nói chuyện. Hỏi domain expert dùng từ gì để mô tả quy trình. Ghi lại. Hỏi lại khi thấy từ nào mơ hồ. Xây một vocabulary nhỏ mà cả hai cùng đồng ý, rồi mới phác thảo model.

Chậm hơn, không phủ nhận. Nhưng lần này, khi code xong, không có email nào gửi đến nói rằng hệ thống "không đúng với cách chúng tôi làm việc".

---

Dự án gần nhất bạn làm, bạn ngồi nói chuyện với người hiểu domain bao lâu trước khi viết dòng code đầu tiên?
