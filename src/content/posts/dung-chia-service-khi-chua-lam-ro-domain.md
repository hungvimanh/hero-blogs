---
title: "Đừng chia service khi chưa làm rõ domain"
date: 2024-09-24
tags: ["architecture", "microservice", "domain-driven-design"]
description: "DDD là tư duy về business domain. SOA là cách triển khai hệ thống. Nhầm lẫn giữa hai cái này là lý do phần lớn microservice project bị chết ngoài đường."
draft: false
---

Hồi còn mới tìm hiểu về microservice, tôi đọc được rất nhiều bài viết nhắc tới Domain-Driven Design, rồi Service-Oriented Architecture, rồi microservice lại liên tưởng tới DDD. Tôi tưởng ba cái đó là một.

Mất mấy năm sau này, tôi mới khai ngộ: mọi người nói về ba thứ hoàn toàn khác nhau, nhưng họ hay gộp lại. DDD là triết lý tư duy. SOA là kỹ thuật triển khai. Lầm lẫn giữa chúng là lý do hầu hết dự án microservice tôi thấy đều gặp vấn đề tương tự: chia service quá sớm, chia quá nhỏ, rồi phải ghép lại.

## Tại sao ba khái niệm này hay bị nhầm

Bạn tìm kiếm "microservice". Bài viết đầu tiên bảo hãy dùng DDD để tư duy domain. Bài thứ hai bảo kiến trúc service phải áp dụng nguyên tắc SOA. Bài thứ ba lại mô tả cách chia microservice bằng cách nhìn vào bounded context.

Cả ba bài đều đúng, nhưng mỗi bài giải quyết một vấn đề khác nhau. Khi gộp chung lại, người mới học dễ ngộ nhận rằng DDD, SOA, và microservice là các mặt của cùng một vấn đề.

Thực tế không phải vậy.

## DDD là bản đồ tư duy, không phải thiết kế kỹ thuật

Domain-Driven Design là một cách tư duy về bài toán kinh doanh. Nó giống như việc luyện nội công để hiểu rõ căn cơ của doanh nghiệp. DDD không bàn về code, deployment, hay service. Nó chỉ bàn về cách hiểu và phân loại các vấn đề trong kinh doanh.

DDD xoay quanh vài khái niệm chủ yếu:

**Bounded Context**: mỗi phần của hệ thống có một ranh giới rõ ràng. Bộ phận thanh toán hiểu khái niệm tài khoản khác với cách bộ phận chăm sóc khách hàng định nghĩa nó.

**Ubiquitous Language**: đội ngũ phát triển dùng chung một bộ từ vựng để nói về nghiệp vụ. Từ ngữ kinh doanh được giữ nguyên khi chuyển thành code mà không cần dịch qua dịch lại.

**Core Domain vs Supporting Domain**: không phải phần nào cũng quan trọng như nhau. Core domain là thứ mang lại giá trị cạnh tranh, còn supporting domain chỉ phục vụ cho các tác vụ phụ trợ.

Khi áp dụng DDD đúng, bạn sẽ thấy rõ phần thanh toán và phần khách hàng giải quyết những vấn đề khác nhau. Ngôn ngữ của chúng khác nhau, và thay đổi ở chỗ này không liên quan tới chỗ kia.

Kết quả nhận được là một bản đồ tư duy rõ ràng về bài toán, không phải là một sơ đồ microservice hay hệ thống phân tán phức tạp.

Bạn hoàn toàn có thể áp dụng toàn bộ tư duy này vào một monolith duy nhất. Phần thanh toán và phần khách hàng chạy chung trong một process, nhưng chúng độc lập về logic, tách biệt về database schema, và do các nhóm độc lập quản lý.

## SOA là cách xây dựng hệ thống với các service độc lập

Service-Oriented Architecture là một phương pháp triển khai hệ thống bằng cách tách thành các service nhỏ, mỗi cái chạy độc lập và giao tiếp qua network. Nó là chiêu thức triển khai bên ngoài.

SOA không quan tâm bạn có hiểu domain hay không. SOA chỉ nói: hãy chia hệ thống sao cho có thể deploy, scale, và thay thế từng phần độc lập.

Các vấn đề mà SOA giải quyết hoàn toàn khác:

**Deployment independence**: mỗi service có thể deploy riêng mà không ảnh hưởng tới các phần khác.

**Technology flexibility**: service thanh toán viết bằng Python, service khách hàng viết bằng Go, miễn là chúng gọi được nhau.

**Team autonomy**: mỗi nhóm tự chịu trách nhiệm một service, tự quyết định cách triển khai và quản lý.

**Scaling**: chỉ service nào chịu tải cao mới cần scale, các service khác giữ nguyên.

Hệ thống SOA cung cấp một cơ sở hạ tầng có thể giải quyết độc lập từng vấn đề kỹ thuật. Nhưng nó không bảo đảm bạn hiểu nghiệp vụ, và các service được chia ra chưa chắc đã hợp lý trong bối cảnh kinh doanh.

Bạn hoàn toàn có thể áp dụng SOA mà không hiểu domain. Bạn chỉ chia hệ thống theo kỹ thuật như API gateway, cache layer, database service. Nó có thể chạy tốt, nhưng hệ thống lúc này chỉ là một tập hợp các service rời rạc không có định hướng rõ ràng.

## Cái giá của việc chia service quá sớm

Hầu hết dự án microservice gặp vấn đề đều xuất phát từ việc chia service trước khi hiểu rõ domain. Nó giống như việc chưa luyện xong nội công đã vội vàng thi triển chiêu thức phức tạp, dẫn đến tẩu hỏa nhập ma.

Nghiệp chướng tích lũy rất nhanh theo kịch bản này:

Bạn đọc tài liệu thấy bảo nên dùng DDD, thế là cả nhóm ngồi lại vẽ ra năm cái bounded context trong một buổi họp.

Sau đó, bạn quyết định mỗi bounded context sẽ là một microservice để tuân thủ kiến trúc SOA.

Ngay từ tuần thứ hai, bạn nhận ra hai service này cần gọi nhau liên tục. Gọi qua HTTP thì chậm, bạn chuyển sang dùng message queue. Từ đó, các vấn đề về transaction phân tán và đồng bộ dữ liệu xuất hiện.

Mấy tháng sau, bạn nhận ra ranh giới giữa hai context vẽ ban đầu bị sai. Chúng đáng lẽ phải là một. Nhưng giờ gộp lại nghĩa là phải sửa từ layer giao tiếp, cấu hình deployment cho đến toàn bộ codebase.

Đó là câu chuyện quen thuộc: chia service quá sớm, chia quá nhỏ, rồi lại phải tìm cách ghép lại. Hệ quả là infrastructure phức tạp, đội ngũ kiệt sức, và giá trị bàn giao cho kinh doanh bị chậm lại. Bạn không thực sự hiểu domain khi chia service, bạn chỉ vẽ ra một sơ đồ có vẻ hợp lý rồi áp đặt kỹ thuật lên nó.

## Trình tự đúng: DDD trước, SOA sau

Để xây dựng hệ thống bền vững, bạn cần tuân theo trình tự:

**Bước 1: Dùng DDD để tư duy domain**

Ngồi lại với những người hiểu nghiệp vụ để làm rõ các ranh giới thực sự của hệ thống, xem phần nào là cốt lõi và phần nào là phụ trợ. Bạn không cần gõ dòng code nào ở bước này, chỉ cần vẽ sơ đồ và thảo luận để có một bản đồ tư duy domain rõ ràng.

**Bước 2: Chạy monolith trước**

Hãy viết code và đặt mọi thứ vào một ứng dụng, một database duy nhất. Nhiệm vụ duy nhất lúc này là giữ ranh giới logic giữa các phần thật rõ ràng như bản đồ đã vẽ.

Chạy hệ thống này trong vài tháng để quan sát xem phần nào hay thay đổi, phần nào gọi nhau nhiều, và các nhóm làm việc có bị giẫm chân lên nhau không.

**Bước 3: Chỉ chia service khi thực sự cần thiết**

Sau vài tháng, nếu bạn thấy một phần cần scale riêng biệt, hoặc một nhóm cần tự chủ hoàn toàn mà không muốn phụ thuộc vào phần còn lại, lúc đó mới tách ra thành service riêng. Đừng chia chỉ vì nó là xu hướng.

## Lời kết

Đó là bài học tôi rút ra sau nhiều lần chịu thiên kiếp từ các hệ thống phân tán.

Tôi từng thấy có dự án chia thành tám service từ ngày đầu dựa trên một bản vẽ vội vàng. Trong hai tháng sau đó, họ mất thêm nửa năm chỉ để gộp và chia lại các service đó. Nếu ban đầu họ chọn monolith để hiểu rõ domain trước, mọi chuyện đã khác.

Chia service khi chưa làm rõ domain là cái lỗi mà sau này bạn sẽ mất rất nhiều công sức để dọn dẹp.

Lựa chọn đi theo con đường nào vẫn nằm ở bạn.
