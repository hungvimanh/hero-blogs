---
title: "Thiết kế \"khung kỷ luật\" cho AI Agent trong dự án thực tế"
date: 2026-06-17
tags: ["AI", "Software Engineering", "Workflow", "DevOps"]
description: "Tại sao việc nhồi nhét prompt không giúp AI Agent làm việc tốt hơn, và làm cách nào để ràng buộc hành vi của AI bằng Git hooks, Router và State trong dự án."
thumbnail: /images/posts/khung-ky-luat-ai-agent.jpg
draft: false
---

Tôi từng nghĩ chỉ cần cài Claude Code hay Cursor và ném cho nó prompt thật hay là xong. Nhưng sau một tuần chạy dự án thực tế với các AI Agent tự vận hành, tôi nhận ra mình dành phần lớn thời gian để dọn dẹp đống hỗn độn mà nó bày ra: tự ý commit khi chưa chạy test, sửa đổi cấu hình hệ thống khi chưa được phép, hoặc tệ nhất là đọc lại những file không liên quan để rồi tiêu tốn hàng triệu token chỉ vì quên mất ngữ cảnh.

Vui vẻ viết code cùng AI, cho đến khi bạn phải đi dọn dẹp hậu quả của nó.

### Sự vô kỷ luật của những trợ lý siêu việt

Khi chuyển từ giao diện chat web sang các AI Agent tích hợp trực tiếp vào terminal và IDE, quyền hạn của AI đã thay đổi. AI không còn chỉ trả lời câu hỏi, nó có thể đọc ghi file, thực thi lệnh terminal và tự commit code.

Thế nhưng, một AI Agent không có quy trình làm việc rõ ràng giống như một lập trình viên thực tập cực kỳ thông minh nhưng thiếu kỷ luật. Càng giao nhiều quyền, vấn đề càng dễ phát sinh:

* **Sửa đổi lan man:** Yêu cầu đổi màu một nút bấm, AI có thể tự refactor luôn cả API fetch data xung quanh vì thấy code cũ viết chưa đẹp.
* **Commit vô tội vạ:** Commit không có thông điệp rõ ràng, commit đè lên những thay đổi chưa được xác nhận, hoặc commit khi code thậm chí chưa biên dịch xong.
* **Lãng phí ngữ cảnh:** Để giải quyết một tác vụ nhỏ, AI sẵn sàng dùng lệnh grep để quét hoặc đọc toàn bộ thư mục lớn, tiêu tốn lượng token khổng lồ trong vài phút mà không đem lại kết quả gì.

Giải pháp ban đầu của chúng ta là cố gắng viết ra các file chỉ dẫn như `CLAUDE.md` hay `.cursorrules` thật dài, chứa đầy những câu như: *"Hãy cẩn thận"*, *"Đừng tự ý sửa file cấu hình"*, *"Hãy chạy test trước khi hoàn thành"*. 

Nhưng AI rất dễ bị phân tâm bởi các hướng dẫn bằng chữ khi ngữ cảnh dài ra. Bạn không thể quản lý một thực thể logic thuần túy bằng những lời dặn dò. Bạn phải ràng buộc nó bằng kỹ thuật.

### Lối thoát từ sự ràng buộc kỹ thuật

Để giải quyết vấn đề này, tôi đã viết ra `hero-vibe-kit`, một bộ công cụ dòng lệnh nhỏ không chứa dependency bên ngoài. Bản chất của bộ kit này không phải là cung cấp các prompt thông minh hơn, mà là thiết lập một khung kỷ luật cứng để kiểm soát hành vi của AI Agent ngay trong repository.

Ý tưởng rất đơn giản: thay vì dạy AI cách viết code, chúng ta buộc nó tuân thủ quy trình thông qua ba chốt chặn kỹ thuật: **Router (Bộ định tuyến công việc)**, **Gate (Cổng kiểm soát kế hoạch)**, và **Enforcement Hooks (Git hooks cưỡng chế)**.

#### 1. Bộ định tuyến công việc

Sai lầm lớn nhất của các agent hiện tại là áp dụng cùng một quy trình cho mọi loại công việc. Việc chỉnh sửa lỗi chính tả trong file README không cần các bước lập kế hoạch và review phức tạp như khi sửa logic tính toán tiền lương.

Quy trình mới phân loại mọi tác vụ ngay từ đầu:
- **Read-only (Chỉ đọc):** Các câu hỏi giải thích code, tìm kiếm thông tin. AI được trả lời trực tiếp nhưng bị cấm chỉnh sửa file.
- **Fast (Nhanh):** Sửa lỗi nhỏ cục bộ hoặc viết tài liệu. AI được sửa trực tiếp nhưng bắt buộc viết test tái hiện lỗi.
- **Standard/Full (Chuẩn/Đầy đủ):** Thay đổi logic tính toán hoặc tính năng mới. AI bắt buộc phải lập kế hoạch chi tiết trước khi code.

Sự phân chia này giới hạn không gian hoạt động của AI, ngăn nó tự ý sửa đổi lung tung.

#### 2. Cổng kiểm soát kế hoạch

AI rất hay lao vào viết code trước khi hiểu rõ yêu cầu. Khi chúng ta bảo AI: *"Hãy giải thích hướng giải quyết trước khi viết"*, nó thường bỏ qua câu này hoặc giải thích sơ sài rồi sửa code luôn.

Cách giải quyết là tận dụng tính năng Plan Mode của các CLI như Claude Code làm rào cản kỹ thuật. Trong Plan Mode:
1. AI buộc phải phân tích codebase, vẽ sơ đồ ảnh hưởng và viết kế hoạch chi tiết vào file.
2. Quá trình viết code bị khóa lại cho đến khi bạn phê duyệt kế hoạch đó.

Cơ chế này ngăn AI đi sai hướng ngay từ bước đầu tiên và bắt buộc nó phải suy nghĩ trước khi đặt tay vào bàn phím.

#### 3. Cưỡng chế bằng Git hooks

Đây là chốt chặn quan trọng nhất. AI hoạt động trực tiếp trong repo và sử dụng chính git trên máy của bạn. Điều này nghĩa là chúng ta có thể dùng Git hooks để giám sát và ngăn chặn các hành động nguy hiểm:

* **git-guard:** Chặn đứng các lệnh có tính chất phá hoại mà AI hay dùng để sửa sai như `git reset --hard` trên nhánh chính hoặc `git push --force` mà không có sự đồng ý của con người.
* **workflow-check:** Đối với các thay đổi thuộc luồng Standard hoặc Full, hook này sẽ chặn lệnh `git commit` nếu AI chưa ghi nhận trạng thái session hiện tại hoặc chưa cập nhật tài liệu kiểm thử.

```javascript
// Một đoạn code đơn giản trong git-guard.cjs để chặn các lệnh nguy hiểm của AI
const forbiddenCommands = ['reset --hard', 'push --force', 'clean -fd'];
const runCommand = process.env.CLAUDE_COMMAND || '';

if (forbiddenCommands.some(cmd => runCommand.includes(cmd))) {
  console.error(`[HVK Git Guard] Phát hiện lệnh nguy hiểm bị cấm: ${runCommand}`);
  process.exit(1); // Chặn đứng hành động của AI
}
```

Bằng cách đưa ra phản hồi trực tiếp từ hệ thống, AI sẽ lập tức hiểu rằng nó đã vi phạm quy tắc an toàn của dự án và buộc phải tìm giải pháp khác thay vì cố gắng bỏ qua lời nhắc bằng chữ.

### Tối ưu hóa ngữ cảnh và Token

Bên cạnh kỷ luật hành vi, hóa đơn API tăng chóng mặt do hiện tượng lãng phí ngữ cảnh cũng là một vấn đề lớn. Mỗi lần khởi chạy phiên làm việc mới, AI thường đọc lại toàn bộ tài liệu lớn hoặc chạy quét toàn bộ thư mục để định vị công việc.

Thiết kế của `hero-vibe-kit` sử dụng một file trạng thái siêu nhẹ gọi là `session.json` nằm trong thư mục `.hero-vibe-kit/`:

```json
{
  "activePath": "Standard",
  "currentPhase": "implementation",
  "gateStatus": "approved",
  "resumePath": "docs/plans/feature-x-plan.md"
}
```

Thay vì bắt AI đọc một file nhật ký dài dằng dặc, nó chỉ cần đọc file `session.json` này (chưa đầy 200 tokens) để biết chính xác nó đang dừng ở bước nào, file kế hoạch nằm ở đâu và cần làm gì tiếp theo. Cách này giúp tiết kiệm lượng lớn token trong các dự án thực tế.

### Thiết kế luật chơi bằng mã nguồn

Sau nhiều tháng thử nghiệm các công cụ AI khác nhau, bài học lớn nhất tôi rút ra được là: **Chúng ta không thể quản lý AI Agent giống như cách chúng ta quản lý con người.**

Con người có thể hiểu các quy tắc ngầm, có sự tự ý thức về rủi ro và biết sợ khi làm hỏng hệ thống sản xuất. AI thì không. AI chỉ tối ưu hóa dựa trên xác suất của từ tiếp theo dựa trên ngữ cảnh nó nhận được.

Vì vậy, cách duy nhất để xây dựng một môi trường phát triển an toàn và hiệu quả với AI là dịch chuyển từ quản lý bằng tài liệu sang cưỡng chế bằng mã nguồn. 

Hãy biến các quy trình làm việc của bạn thành các kịch bản kiểm tra tự động như linter, git hooks hay các bài test biên dịch. Khi luật chơi được định nghĩa bằng code, AI Agent sẽ tự động trở thành một cộng sự đắc lực, chuẩn chỉ và hiệu quả.

---

Lần cuối cùng bạn phải rollback code hoặc sửa đổi thủ công hàng chục file chỉ vì AI tự ý viết lại một hàm không liên quan là khi nào? Liệu đã đến lúc bạn cần cài đặt một khung kỷ luật cứng cho trợ lý AI trong repository của mình thay vì chỉ hy vọng nó sẽ hoạt động tốt?