---
title: "Tôi cấp quyền tối đa cho AI, rồi phải dọn dẹp ba tuần"
date: 2026-06-17
tags: ["AI", "Software Engineering", "Workflow", "DevOps"]
description: "Tại sao prompt hay không giúp AI Agent làm việc tốt hơn. Câu chuyện thiết kế khung kỷ luật cứng bằng code thay vì lời dặn."
thumbnail: /images/posts/khung-ky-luat-ai-agent.jpg
draft: false
---

Lần đó tôi tưởng mình đã tìm thấy một hộ pháp đắc lực. Cài Claude Code xong, tôi hào phóng cấp cho nó toàn bộ quyền: đọc ghi file, chạy lệnh terminal, tự tạo commit. Tuần đầu tiên trôi qua êm đềm. AI viết code, tôi ngồi duyệt, bấm merge. Tiến độ dự án nhanh gấp ba bình thường.

Tuần thứ hai, nghiệp chướng bắt đầu tích lũy.

Tôi phát hiện nó âm thầm sửa lại toàn bộ API module chỉ vì thấy code cũ viết chưa đẹp. Đoạn code đó chưa được chạy test, thông điệp commit thì tối nghĩa. Yêu cầu sửa ba dòng ban đầu biến thành một pull request khổng lồ với hai mươi file thay đổi lung tung.

Tuần thứ ba thì chính là đại kiếp nạn. AI tự commit khi code chưa biên dịch xong. Rồi nó dùng lệnh quét toàn bộ thư mục log nặng hơn 3GB để tìm một hằng số nhỏ. Mười triệu token bay màu trong chốc lát chỉ vì nó quên mất nó đã đọc đúng file đó ngày hôm qua.

Sau ba tuần dọn dẹp đống hỗn độn, tôi mới khai ngộ ra một điều. Đệ tử AI của bạn không cần những câu prompt tinh diệu hơn. Nó cần một bộ quy tắc cứng.

## Lời dặn bằng chữ là tà pháp

Khi tích hợp AI Agent vào sâu trong terminal và IDE, quyền lực của nó thay đổi. Nó không còn là đứa trẻ chỉ biết trả lời câu hỏi trong khung chat. Nó có công cụ thực sự, có thể can thiệp trực tiếp vào sinh mệnh của codebase. Giao quyền mà không có rào cản giống như giao bảo kiếm cho một đệ tử thông minh nhưng nghịch ngợm.

Ban đầu, tôi cố gắng lập ra những bản quy ước dài dòng trong file CLAUDE.md. Tôi dặn nó không được sửa code lan man, phải chạy test trước khi hoàn thành, phải cẩn thận với file cấu hình.

Nhưng AI hoạt động theo xác suất của từ tiếp theo. Nó không có tâm trí để sợ hãi khi làm hỏng production, cũng không có tự ý thức để tự xem xét hành vi. Khi cuộc hội thoại kéo dài, những lời dặn dò bằng chữ sẽ bị chôn vùi dưới hàng triệu token ngữ cảnh. Nó sẽ quên, không phải vì vô tâm mà vì thuật toán của nó hoạt động đúng như vậy.

Quản lý một thực thể logic bằng những lời khuyên cảm tính là một sai lầm căn bản.

## Thiết lập công pháp với ba chốt chặn

Tôi quyết định viết ra hero-vibe-kit. Công cụ này không chứa prompt thông minh nào cả. Nhiệm vụ duy nhất của nó là dựng lên những rào cản vật lý để AI không thể vượt qua.

Quy trình mới buộc AI phải đi qua ba chốt chặn cứng.

![hero-vibe-kit framework](/images/posts/hero-vibe-kit.png)

### 1. Phân loại bài toán bằng Router

Sai lầm lớn nhất là áp dụng cùng một quy trình cho mọi loại công việc. Việc chỉnh sửa lỗi chính tả trong file README không cần các bước lập kế hoạch phức tạp như khi sửa logic tính toán tiền lương.

Router chia nhỏ tác vụ ngay từ đầu:

* Read-only: Chỉ tìm kiếm thông tin, giải thích code. AI bị cấm sửa file.
* Fast: Sửa lỗi nhỏ cục bộ. AI được sửa trực tiếp nhưng bắt buộc phải viết test để tái hiện lỗi.
* Standard hoặc Full: Thay đổi logic cốt lõi. AI buộc phải lập kế hoạch trước khi code.

AI không thể tự ý phá rào vì hệ thống sẽ kiểm tra phân loại này trước khi cho phép nó chạy tiếp.

### 2. Khóa code bằng Plan Mode

AI rất thích đặt tay vào bàn phím trước khi hiểu rõ yêu cầu. Khi tôi bảo nó giải thích hướng giải quyết, nó thường viết vài dòng qua loa rồi sửa code luôn.

Tôi tận dụng Plan Mode làm rào cản kỹ thuật. Ở chế độ này, AI buộc phải đọc codebase, vẽ sơ đồ ảnh hưởng và viết kế hoạch chi tiết ra file. Quá trình viết code bị khóa lại cho đến khi tôi đọc và duyệt kế hoạch đó.

Không cho phép code trước khi nghĩ. Đó là quy tắc.

### 3. Cưỡng chế bằng Git hooks

Đây là chốt chặn quan trọng nhất, nơi chúng ta dùng chính luật lệ của git để trói buộc AI:

* git-guard: Chặn đứng các lệnh nguy hiểm như reset --hard trên nhánh chính hay push --force.
* workflow-check: Chặn commit nếu AI chưa ghi nhận trạng thái session hiện tại hoặc chưa cập nhật tài liệu kiểm thử.

```javascript
// Một đoạn code trong git-guard để chặn lệnh nguy hiểm
const forbiddenCommands = ['reset --hard', 'push --force', 'clean -fd'];
const runCommand = process.env.CLAUDE_COMMAND || '';

if (forbiddenCommands.some(cmd => runCommand.includes(cmd))) {
  console.error(`[HVK] Lệnh bị cấm: ${runCommand}`);
  process.exit(1);
}
```

Khi nhận được phản hồi lỗi trực tiếp từ hệ thống, AI sẽ hiểu ngay lập tức rằng hành động đó bị cấm và buộc phải tìm cách khác, thay vì cố gắng lách qua các lời dặn dò bằng chữ. Một file session.json siêu nhẹ cũng được dùng để lưu trạng thái, giúp AI tiếp tục công việc mà không cần đọc lại hàng nghìn dòng log cũ để lấy ngữ cảnh.

## Quy tắc phải được thực thi bằng mã nguồn

Sau nhiều kiếp nạn dọn dẹp code, bài học lớn nhất tôi rút ra là chúng ta không thể quản lý AI Agent giống như cách quản lý con người.

Con người có thể hiểu quy tắc ngầm, có sự tự ý thức về rủi ro và biết sợ khi làm hỏng hệ thống. AI thì không. AI chỉ tối ưu hóa dựa trên toán học.

Vì vậy, cách duy nhất để làm việc an toàn với AI là dịch chuyển từ quản lý bằng tài liệu sang cưỡng chế bằng mã nguồn. Bạn không dạy một service chạy đúng bằng cách viết tài liệu hướng dẫn sử dụng thật hay. Bạn dùng linter, pre-commit hook, các bài test tự động và hệ thống CI/CD để khóa hành vi của nó lại.

Hãy đối xử với AI Agent như một phần mềm. Khi luật chơi được định nghĩa bằng code, AI sẽ tự khắc trở thành một cộng sự chuẩn chỉ. Không phải vì nó nghe lời, mà vì nó không có cách nào khác để vượt qua hệ thống kiểm soát.

---

Lần cuối cùng bạn phải rollback code hoặc sửa đổi thủ công hàng chục file chỉ vì AI tự ý viết lại một hàm không liên quan là khi nào? Liệu đã đến lúc bạn cần cài đặt một khung kỷ luật cứng cho trợ lý AI trong repository của mình thay vì hy vọng nó sẽ hoạt động tốt?