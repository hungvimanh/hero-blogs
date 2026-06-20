---
title: "Khi bạn phải từ bỏ một cái mà tưởng chừng dễ"
date: 2024-10-30
tags: ["distributed-systems", "database", "architecture"]
description: "CAP Theorem không phải lý thuyết vô hại. Nó là những lựa chọn có hậu quả thực tế."
thumbnail: https://upload.wikimedia.org/wikipedia/commons/b/be/CAP_Theorem.svg
draft: false
---

Năm đó, hệ thống xử lý payment của chúng tôi bắt đầu chậm. Team đề xuất: "Cần replicate data sang nhiều data center." Tôi tưởng chỉ là chuyện copy dữ liệu qua mạng, đơn giản và an toàn.

Nhưng rồi kiếp nạn đầu tiên ập đến: đứt cáp quang biển. Phía A không nhìn thấy phía B. 

Đột nhiên, tôi bị đẩy vào thế phải chọn. Giữ lại dữ liệu cũ để hệ thống không lỗi, hay cho ghi dữ liệu mới rồi chấp nhận rủi ro xung đột sau này? 

Không có lựa chọn nào hoàn hảo. Đó là lúc tôi va phải định luật CAP.

## Đạo trời không cho ai tất cả

CAP Theorem nói rằng một hệ thống phân tán chỉ có thể giữ được tối đa hai trong ba điều:

- Consistency: Dữ liệu nhất quán. Đã đọc là phải ra bản mới nhất.
- Availability: Hệ thống luôn sẵn sàng. Gọi là phải có phản hồi, bất kể cũ hay mới.
- Partition Tolerance: Chịu lỗi khi đường truyền chia cắt.

Nhưng thực tế, đường truyền chia cắt là chuyện chắc chắn xảy ra. Cáp đứt, switch hỏng, router quá tải. Bạn không thể chọn bỏ Partition Tolerance. Nếu chọn bỏ nó, bạn đang giả định một thế giới không bao giờ đứt mạng. Đó là nghịch thiên hành sự.

Vì thế, lựa chọn thực tế duy nhất là: khi mạng bị chia cắt, bạn chọn Consistency hay Availability?

## Ba ngả đường tu luyện

### Nhóm CA: Chọn nhất quán và sẵn sàng (SQL Server)

Hướng này giống như người tu luyện chính tông, thà dừng lại chứ không để tạp niệm lọt vào tâm cảnh. Khi mạng thông suốt, hệ thống chạy rất nhanh và an toàn. 

Nhưng khi đứt mạng, SQL Server (ở cấu hình replication đồng bộ) sẽ chọn dừng lại. Nó từ chối các lệnh ghi mới để đảm bảo dữ liệu ở mọi replica luôn giống hệt nhau.

Điểm cộng: Dữ liệu luôn chuẩn. Không sợ lệch một đồng xu nào.
Điểm trừ: Mạng lỗi là hệ thống đứng hình.
Phù hợp cho: Hệ thống thanh toán, kế toán. Những nơi mà dữ liệu sai một ly đi một dặm.

### Nhóm AP: Chọn sẵn sàng và chịu lỗi (MongoDB, Redis)

Đây là lối đi của ngoại đạo, ưu tiên tốc độ và sự sinh tồn trước mắt. Mạng đứt? Không sao, các node vẫn mở cửa nhận dữ liệu của user. 

Hậu quả là mỗi node sẽ lưu một phiên bản khác nhau. Khi mạng nối lại, bạn phải đối mặt với một đống nghiệp chướng: xung đột dữ liệu. MongoDB hay Redis sẽ phải tự hòa giải (reconcile) bằng cách ghi đè hoặc dùng cơ chế Last-Write-Wins.

Điểm cộng: User không bao giờ thấy lỗi 500.
Điểm trừ: Dữ liệu có lúc bị lệch. User có thể thấy trạng thái cũ của mình.
Phù hợp cho: Hệ thống cache, lưu session, đếm lượt xem. Những nơi mà lệch vài giây hay mất vài tương tác không làm sập doanh nghiệp.

### Nhóm CP: Chọn nhất quán và chịu lỗi (DynamoDB)

Lối đi này chọn giữ sự thuần khiết của dữ liệu bằng mọi giá, ngay cả khi mạng bị chia cắt. 

DynamoDB (khi bật strong consistency) sẽ kiểm tra xem lệnh ghi có được đồng thuận bởi số đông replica hay không. Nếu mạng đứt đến mức không đủ số lượng node xác nhận, nó sẽ từ chối lệnh ghi đó. Nó chấp nhận hy sinh tính sẵn sàng để giữ cho dữ liệu không bị sai lệch.

Điểm cộng: Dữ liệu luôn đúng trên các cụm node còn liên lạc được.
Điểm trừ: Nhiều request sẽ bị từ chối thẳng thừng.
Phù hợp cho: Hệ thống quản lý kho hàng, giỏ hàng lớn. Những nơi cần scale rộng nhưng dữ liệu không được phép mâu thuẫn.

## Cái giá của sự ngây thơ

Lần đầu tôi dùng MongoDB, tôi bị mê hoặc bởi sự linh hoạt của document database. Tôi thiết kế hệ thống mà quên mất mình đang rơi vào cái bẫy của eventual consistency. Dữ liệu lệch nhau giữa các node khiến tôi mất cả tuần để debug thủ công, cố gắng chắp vá những transaction bị lỗi. Đó là cái giá cho việc lạm dụng công cụ mà không hiểu căn cơ.

Lần khác, tôi lại tẩu hỏa nhập ma theo hướng ngược lại. Tôi ép hệ thống phải dùng SQL Server với replication đồng bộ tuyệt đối qua hai vùng địa lý khác nhau. Kết quả là chỉ cần mạng latency tăng nhẹ, toàn bộ ứng dụng bị nghẽn cổ chai.

Tôi nhận ra: kiến trúc tốt không phải là chọn database mạnh nhất. Mà là biết hệ thống của mình chịu được loại kiếp nạn nào.

## Khi thiên kiếp ập đến

Nếu hôm nay production của bạn bị chia cắt làm hai nửa độc lập, bạn sẽ làm gì?

Cho phép user ở cả hai nửa tiếp tục ghi đè dữ liệu, rồi chấp nhận sửa sai sau?

Hay khóa một bên, bắt user chờ đợi để dữ liệu luôn sạch sẽ?

Quyết định đó không nằm ở cấu hình database. Nó nằm ở việc bạn hiểu rõ nghiệp vụ của mình đến mức nào.
