---
title: "Tôi từng nghĩ SOLID là bắt buộc"
date: 2024-09-22
tags: ["architecture", "design", "systems-thinking"]
description: "Khi áp dụng SOLID mà không hiểu bối cảnh, cái bạn nhận được không phải code tốt, mà là code phức tạp."
draft: false
---

Hồi mới đi làm, tôi từng tin SOLID là chân lý. Kiểu như nếu không viết code theo năm nguyên tắc đó thì không thể gọi là lập trình viên chuyên nghiệp.

Vài năm sau, tôi nhận ra mình sai. Tôi từng chứng kiến một monolith cực kỳ đơn giản chạy ngon lành, dễ sửa và ổn định suốt mấy năm trời mà chẳng tuân theo Single Responsibility. Trong khi đó, cái hệ thống mà tôi cố nhét interface với dependency injection vào ngay từ ngày đầu lại trở thành một mớ bòng bong.

## Bài học đắt giá từ những interface vô nghĩa

Ở các trung tâm hay trên mấy blog công nghệ, người ta hay dạy SOLID như những định luật vật lý bất biến.

Lớp nào cũng chỉ được phép có một lý do để thay đổi.

Luôn phải đóng với sửa đổi nhưng mở với mở rộng.

Phải phụ thuộc qua interface chứ không được gọi trực tiếp class cụ thể.

Nhưng chẳng ai nói cho bạn biết cái giá phải trả khi tuân theo những điều đó.

Khi cố ép code của mình vào khuôn SOLID, bạn sẽ đẻ ra hàng tá interface vô nghĩa. Bạn tạo ra những lớp trung gian chỉ để chuyển tiếp dữ liệu đi chỗ khác. Một tính năng đơn giản thay vì viết trong mười dòng thì giờ bị xé nhỏ ra năm sáu file. Muốn đọc hiểu luồng chạy, bạn phải click chuột liên tục qua một rừng thư mục.

Cách thiết kế này chỉ thực sự có ích khi hệ thống lớn, team đông người cùng sửa một chỗ, hoặc nghiệp vụ thay đổi xoành xoạch.

Còn phần lớn dự án chúng ta làm hàng ngày lại không phức tạp đến thế.

## Khi nguyên tắc hóa nghiệp chướng

Tôi nhớ mãi lần nhận bảo trì một ứng dụng checklist nội bộ. Nó nhỏ lắm, loanh quanh chỉ có 15 bảng dữ liệu và tầm 30 chức năng cơ bản.

Vì muốn chứng tỏ bản thân, tôi đè ứng dụng ra áp dụng SOLID từ ngày đầu.

Mỗi use case tôi viết một class riêng. Mỗi class cấu hình trong file dependency injection. Service này gọi service kia qua interface. Kết quả là một ứng dụng tí hon phình lên thành hơn 200 file.

Năm sau, có một bạn junior mới vào team. Bạn ấy mất ba tuần chỉ để tìm xem code xử lý nghiệp vụ thực sự nằm ở đâu giữa đống file trung gian đó. Code không khó hiểu, nhưng cấu trúc thư mục thì quá rối.

Cùng lúc đó, tôi có cơ hội đọc codebase của một dự án tương tự viết bằng Ruby on Rails. Đó là một monolith đúng nghĩa: gọi class trực tiếp, không interface, không abstraction.

Một lập trình viên mới vào chỉ mất đúng ba ngày là có thể tự tin viết tính năng mới.

Khi cần thay đổi logic, chúng tôi sửa trực tiếp tại một chỗ là xong. Không phải đi sửa interface, không cần cập nhật file đăng ký dependency, cũng chẳng sợ làm ảnh hưởng đến các cấu trúc abstraction khác.

Sự khác biệt ở đây chỉ là kích thước của bài toán.

Với một hệ thống nhỏ và ít thay đổi, việc cố xây dựng hàng rào abstraction chỉ để phòng thủ cho một tương lai không bao giờ tới chính là tẩu hỏa nhập ma. Codebase lúc này không còn là tài sản, nó là nghiệp chướng.

## Bóc tách giá trị thực tế

Nếu nhìn thẳng vào thực tế, năm chữ cái trong SOLID không có giá trị ngang nhau.

Single Responsibility tốt khi nghiệp vụ phức tạp và dễ thay đổi. Nhưng nó sẽ là thảm họa nếu bạn xé nhỏ một hàm ghi log hay lưu database đơn giản thành ba class khác nhau.

Open/Closed giúp thiết kế hệ thống mở, nhưng vô nghĩa nếu bạn đang viết một công cụ nội bộ có scope cố định và chẳng mấy khi sửa.

Liskov Substitution cần thiết khi bạn dùng kế thừa sâu, nhưng xu hướng hiện nay là dùng composition hoặc thiết kế phẳng, kế thừa sâu giờ hiếm ai dùng.

Interface Segregation giúp giảm phụ thuộc chéo trong dự án lớn, còn dự án nhỏ có vài ba service thì tạo nhiều interface chỉ tổ tốn dung lượng ổ cứng.

Dependency Inversion giúp bạn mock dữ liệu để viết unit test, nhưng nếu thư viện đó đã quá ổn định và bạn chẳng bao giờ có ý định thay thế, việc bọc nó qua interface chỉ làm tăng số dòng code.

SOLID không phải là chuẩn mực để đánh giá code đẹp hay xấu. Nó là một bộ công cụ.

## Tự hỏi trước khi gõ phím

Bây giờ, trước khi áp dụng bất kỳ nguyên tắc thiết kế nào, tôi luôn tự hỏi:

Dự án này sẽ chạy trong bao lâu? Nếu chỉ là ứng dụng chạy thử nghiệm vài tháng, hãy viết code trực diện và đơn giản nhất. SOLID chỉ có ý nghĩa khi hệ thống cần sống và tiến hóa trong nhiều năm.

Yêu cầu thay đổi thực sự đến từ đâu? Nếu nghiệp vụ đã rõ ràng và ổn định, bạn không cần vẽ ra những abstraction để dự phòng.

Codebase hiện tại có đang làm team đau đầu không? Nếu mọi người than phiền rằng sửa chỗ này lại hỏng chỗ kia, đó mới là lúc cần cấu trúc lại. Còn nếu mọi thứ vẫn chạy tốt, đừng cố sửa thứ chưa hỏng.

Quy mô của team thế nào? Team hai ba người thì giao tiếp trực tiếp là nhanh nhất, codebase phẳng sẽ tối ưu hơn. Chỉ khi team phình to lên hàng chục người, các ranh giới của SOLID mới giúp mọi người không dẫm chân lên nhau.

## Trở lại chân nguyên

Một cây búa tốt giúp đóng đinh nhanh hơn, nhưng chẳng ai dùng búa để khui một hộp sữa.

Thay vì tìm mọi cách để code của mình trông giống như sách giáo khoa, hãy hỏi xem hệ thống đang gặp vấn đề gì và công cụ nào giải quyết được nó.

Nếu không tìm ra lý do thuyết phục, cứ viết code đơn giản nhất có thể. Code chạy được, rõ ràng và ít file luôn là ưu tiên hàng đầu. Khi nào hệ thống lớn lên và bắt đầu xuất hiện nỗi đau, lúc đó refactor cũng chưa muộn.

Một cấu trúc đơn giản ở hiện tại luôn tốt hơn một đống abstraction phức tạp được vẽ ra cho một tương lai chưa chắc đã tới.
