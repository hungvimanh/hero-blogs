# Copy Frameworks — Tham khảo cho Blog Cá Nhân

Tổng hợp các công thức viết bài, chuyển thể cho blog kỹ thuật tiếng Việt.

---

## Công thức Hook

Chọn một loại — không dùng nhiều loại trong cùng một bài:

**Hook bằng sai lầm:**
> "Tôi từng nghĩ {giả định sai}. Hóa ra {sự thật ngược lại}."

**Hook bằng tình huống cụ thể:**
> "Hệ thống chạy ổn suốt 6 tháng. Rồi một sáng thứ Hai, {sự cố}."

**Hook bằng câu hỏi gây tò mò:**
> "Tại sao {giải pháp đơn giản} lại thất bại khi {điều kiện cụ thể}?"

**Hook bằng quan sát ngược:**
> "{Điều mọi người làm} thực ra không giải quyết {vấn đề thật sự}."

---

## Cấu trúc bài kỹ thuật điển hình

### Bài kể chuyện (narrative-first)
```
1. Hook — tình huống cụ thể, sai lầm, hoặc quyết định sai
2. Bối cảnh — hệ thống gì, team gì, áp lực gì
3. Giải pháp đầu tiên — tại sao có vẻ đúng
4. Vỡ lẽ — khi nào và tại sao nó không đủ
5. Hướng giải quyết — trade-off thật sự
6. Bài học rút ra — nguyên tắc, không phải quy trình
7. Câu hỏi kết — để người đọc tự suy nghĩ
```

### Bài mental model (concept-first)
```
1. Hook — ví dụ trực quan hoặc hiểu lầm phổ biến
2. Vấn đề với cách hiểu thông thường
3. Mental model đúng — giải thích bằng ví dụ thật
4. Ứng dụng thực tế — khi nào dùng được, khi nào không
5. Câu hỏi kết
```

### Bài kiến trúc (decision-first)
```
1. Hook — context và ràng buộc thật sự
2. Các lựa chọn đã cân nhắc — không phải chỉ cái đã chọn
3. Lý do loại bỏ từng lựa chọn
4. Quyết định cuối và trade-off chấp nhận được
5. Kết quả thực tế — tốt và xấu
6. Nguyên tắc thiết kế rút ra
```

---

## Cách viết từng phần

### Phần Hook
- Kéo dài tối đa 3–5 câu
- Phải có: ai, ở đâu, lúc nào, chuyện gì xảy ra
- Không được: "Trong bài này tôi sẽ...", "X là một khái niệm quan trọng..."

### Phần Vấn đề
- Mô tả pain, không mô tả tính năng
- Dùng số cụ thể nếu có: "3 giờ/ngày", "200 dòng code lặp", "deploy mất 40 phút"
- Mục tiêu: người đọc nghĩ "đúng rồi, mình cũng bị vậy"

### Phần Khám phá
- Không bỏ qua những gì thất bại — đó là phần hay nhất
- Trade-off phải cụ thể: "chúng tôi đánh đổi X để được Y, và chấp nhận mất Z"
- Code example nếu có: ngắn, tập trung vào điểm đang nói

### Phần Bài học
- Một nguyên tắc cụ thể, không phải danh sách dài
- Phân biệt "điều này đúng trong trường hợp của tôi" với "đây là quy luật tổng quát"
- Không: "Vì vậy chúng ta nên luôn luôn..."

### Phần Kết
- Kết bằng câu hỏi mở hoặc một quan sát bất ngờ
- Không: tóm tắt lại những gì vừa viết
- Không: lời kêu gọi subscribe/share

---

## Transitions tự nhiên (tiếng Việt)

**Chuyển sang phần tiếp theo:**
- "Điều đó dẫn đến..."
- "Nhưng có một vấn đề."
- "Đây là lúc mọi thứ trở nên thú vị."
- "Hóa ra..."

**Giới thiệu ví dụ:**
- "Lấy ví dụ cụ thể:"
- "Giả sử bạn đang..."
- "Trong trường hợp của chúng tôi..."

**Đối lập / Bẻ kỳ vọng:**
- "Nhưng..."
- "Vấn đề là..."
- "Cái bẫy ở chỗ..."
- "Điều tôi không ngờ tới là..."

**Kết nối ý:**
- "Và đó chính là lý do tại sao..."
- "Điều này có nghĩa là..."
- "Nói cách khác..."

**Tránh dùng (AI tells tiếng Việt):**
- "Hãy cùng khám phá..."
- "Không thể phủ nhận rằng..."
- "Trong thế giới công nghệ ngày nay..."
- "Điều quan trọng cần lưu ý là..."
- "Rõ ràng là..."
- "Thú vị thay..."
