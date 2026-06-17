---
title: "Viết code ít đi để suy nghĩ nhiều hơn"
date: 2023-04-18
tags: ["Lập trình", "Kiến trúc", "AI", "Trải nghiệm"]
description: "Hành trình tự xây dựng công cụ sinh mã nguồn từ cơ sở dữ liệu quan hệ cho luận văn thạc sĩ năm 2023, và suy ngẫm về bản chất công việc của một lập trình viên khi làn sóng AI bắt đầu trỗi dậy."
thumbnail: /images/posts/viet-code-it-di.jpg
draft: false
---

Năm đầu tiên đi làm, tôi từng nghĩ việc gõ phím tạo ra các class, controller hay repository mới là phần thú vị nhất của lập trình.

Tôi thích cảm giác nhìn những dòng code mới tinh hiện lên trên màn hình. Mỗi lần tạo thư mục mới, định nghĩa một class mới rồi viết các phương thức xử lý, tôi đều cảm thấy như mình đang kiến tạo một thế giới riêng. Sự hào hứng đó lớn đến mức tôi sẵn sàng ngồi làm việc đến đêm muộn chỉ để hoàn thành một tính năng, nhìn hệ thống biên dịch thành công và API trả về dữ liệu đúng như mong đợi.

Nhưng sự hào hứng đó bắt đầu nguội đi sau khoảng hai năm đi làm.

Tôi nhận ra phần lớn thời gian hàng ngày của mình không dùng để suy nghĩ giải pháp cho những bài toán khó. Tôi dành hàng giờ, thậm chí cả ngày, chỉ để lặp lại một công việc duy nhất: sao chép cấu trúc code từ file này sang file khác rồi đổi tên các thực thể dữ liệu.

Hôm nay tôi cần viết tính năng quản lý sinh viên. Tôi tạo ra một loạt file: `StudentController`, `StudentService`, `StudentRepository`, `StudentDto`, `CreateStudentRequest`.

Ngày mai, dự án yêu cầu quản lý thêm giảng viên. Tôi lại mở trình soạn thảo, tạo ra các file tương tự: `TeacherController`, `TeacherService`, `TeacherRepository`, `TeacherDto`, `CreateTeacherRequest`.

Cấu trúc bên trong các file này giống nhau đến chín mươi phần trăm. Khác biệt duy nhất chỉ là từ khóa \"Student\" được thay thế bằng từ khóa \"Teacher\". Các thuộc tính bên trong được sửa từ thông tin học tập của sinh viên thành thông tin giảng dạy của giảng viên.

Tôi bắt đầu cảm thấy mình giống một cái máy photocopy chạy bằng cơm hơn là một kỹ sư phần mềm. Tôi tự hỏi, nếu quy trình viết code này có tính lặp lại cao và tuân theo những quy tắc cụ thể đến vậy, tại sao máy tính không tự làm thay chúng ta?

## Nỗi đau từ những tính năng CRUD

Trong ngành phát triển phần mềm, đặc biệt là mảng xây dựng ứng dụng doanh nghiệp hoặc hệ thống SaaS, phần lớn khối lượng công việc xoay quanh khái niệm CRUD: Create (Thêm), Read (Đọc), Update (Sửa) và Delete (Xóa).

Để hoàn thành một tính năng CRUD cơ bản theo kiến trúc phân lớp tiêu chuẩn, một lập trình viên không chỉ viết vài câu lệnh truy vấn dữ liệu. Chúng ta phải dựng lên một bộ khung đồ sộ với hàng loạt file bổ trợ.

Đầu tiên là Entity đại diện cho bảng trong cơ sở dữ liệu. Tiếp theo là Data Transfer Object (DTO) để chuyển dữ liệu qua lại giữa các lớp mà không làm lộ cấu trúc database. Chúng ta cần Request và Response để định nghĩa dữ liệu đầu vào và đầu ra của các điểm cuối API. Chúng ta cần viết Repository để trừu tượng hóa việc truy vấn, viết Service để chứa các logic kiểm tra điều kiện nghiệp vụ, và viết Controller để tiếp nhận các yêu cầu HTTP từ trình duyệt.

Ngoài ra, để đảm bảo dữ liệu gửi lên không bị lỗi, bạn phải viết thêm các lớp Validation để kiểm tra từng trường dữ liệu. Để các lập trình viên frontend hoặc đối tác có thể tích hợp, bạn cần cấu hình Swagger để tự động sinh tài liệu hướng dẫn sử dụng API. Cuối cùng là viết các đoạn code mapping để chuyển đổi dữ liệu qua lại giữa Entity và DTO.

Mỗi file này thường chỉ dài từ vài chục đến hơn một trăm dòng code. Chúng không khó viết. Chúng không đòi hỏi những thuật toán tối ưu phức tạp hay cấu trúc dữ liệu đặc biệt.

Nhưng chúng chiếm dụng một khoảng thời gian khổng lồ của đội ngũ phát triển.

Việc viết đi viết lại những đoạn code này không chỉ gây nhàm chán mà còn là nơi ẩn nấp của những lỗi ngớ ngẩn nhất. Một lập trình viên làm việc trong trạng thái mệt mỏi sau khi copy code từ file cũ sang file mới rất dễ quên sửa tên một trường dữ liệu ở tầng mapping hoặc validation. Chương trình vẫn biên dịch được, API vẫn chạy, nhưng dữ liệu lưu vào cơ sở dữ liệu bị sai lệch hoặc thiếu thông tin mà không có cảnh báo nào xuất hiện ngay lập tức. Việc tìm ra những lỗi nhỏ này sau đó thường mất nhiều thời gian hơn cả việc viết code ban đầu.

Năm 2023, khi thực hiện luận văn thạc sĩ về chủ đề tự động hóa sinh mã nguồn, tôi đã dành nhiều thời gian để phân tích bài toán này. Tôi nhận thấy đây thực chất là bài toán về năng suất lao động trong công nghiệp phần mềm. Chúng ta đang lãng phí chất xám của các kỹ sư vào những công việc mang tính thủ công và lặp đi lặp lại.

## Con đường cũ: Quy tắc hóa để tự động hóa

Nhìn vào bức tranh tổng thể, ngành công nghiệp phần mềm đã tìm cách giải quyết vấn đề này qua nhiều hướng tiếp cận khác nhau.

Hướng đi đầu tiên là Low-code và No-code. Các nền tảng cho phép người dùng không có kiến thức lập trình chuyên sâu vẫn có thể kéo thả giao diện, cấu hình luồng dữ liệu và xuất bản ứng dụng chạy được. Tuy nhiên, hướng đi này thường gặp trở ngại lớn khi hệ thống cần mở rộng, tối ưu hiệu năng hoặc tích hợp sâu với các hệ thống sẵn có của doanh nghiệp.

Hướng đi thứ hai là Template-based Code Generation, tức là sinh mã nguồn dựa trên các bản mẫu có sẵn. Lập trình viên thiết kế cơ sở dữ liệu, định nghĩa các mối quan hệ, chọn một bộ template tương ứng với kiến trúc mong muốn và sử dụng công cụ để sinh ra toàn bộ mã nguồn dự án. Đây là con đường tôi lựa chọn cho nghiên cứu của mình.

Tôi đặt ra một giả định: nếu toàn bộ kiến trúc phần mềm và cách viết code của chúng ta đã được chuẩn hóa thành các quy tắc thống nhất, thì chúng ta có thể chuyển hóa các quy tắc đó thành thuật toán để máy tính tự sinh mã. Máy tính không cần phải thông minh như con người, nó chỉ cần thực hiện chính xác các quy tắc đã được định nghĩa sẵn.

Công cụ tôi xây dựng sử dụng sự kết hợp giữa ngôn ngữ C# và thư viện template Handlebars.js. Quy trình hoạt động của nó tuân theo các bước cụ thể:

Đầu tiên, công cụ kết nối với cơ sở dữ liệu SQL Server và sử dụng cơ chế Reflection trong C# để đọc toàn bộ cấu trúc schema. Nó phân tích các bảng, các cột, kiểu dữ liệu, các ràng buộc khóa chính, khóa ngoại và các thuộc tính cho phép null hay không.

Để làm được điều này, cơ sở dữ liệu đầu vào phải tuân theo một bộ quy ước nghiêm ngặt. Ví dụ, tên bảng và tên thuộc tính phải viết hoa chữ cái đầu của mỗi từ. Tất cả các bảng nghiệp vụ chính đều phải có một thuộc tính khóa chính kiểu bigint đặt tên cố định là Id. Các thuộc tính khóa ngoại được đặt tên theo công thức ghép tên bảng tham chiếu với hậu tố Id. Đối với các mối quan hệ nhiều-nhiều, bảng trung gian phải kết thúc bằng hậu tố Mapping.

Từ thông tin thô đọc được qua Reflection, công cụ chuyển hóa thành một đối tượng Metadata sạch dưới dạng JSON. Đối tượng này chứa toàn bộ thông tin của thực thể được mô tả bằng ngôn ngữ lập trình thay vì ngôn ngữ cơ sở dữ liệu. Ví dụ, kiểu dữ liệu varchar trong database sẽ được ánh xạ thành string trong Metadata, kiểu datetime chuyển thành DateTime.

Sau đó, công cụ truyền đối tượng Metadata này vào các file template được viết bằng Handlebars.js. Handlebars cho phép tôi viết mã nguồn C# dưới dạng các bộ khung mẫu với những biến động được đặt trong dấu ngoặc kép.

Ví dụ, đây là template dùng để tạo ra lớp kiểm tra tính hợp lệ của dữ liệu đầu vào (Validator):

```handlebars
public class Create{{EntityName}}Validator : AbstractValidator<Create{{EntityName}}Request>
{
    public Create{{EntityName}}Validator()
    {
        {{#each Properties}}
        {{#if IsRequired}}
        RuleFor(x => x.{{Name}}).NotEmpty().WithMessage("{{Name}} không được để trống");
        {{/if}}
        {{#if MaxLength}}
        RuleFor(x => x.{{Name}}).MaximumLength({{MaxLength}}).WithMessage("{{Name}} không được quá {{MaxLength}} ký tự");
        {{/if}}
        {{/each}}
    }
}
```

Khi công cụ chạy, nó sẽ đọc Metadata của bảng `Product` trong cơ sở dữ liệu. Bảng này có trường `Name` là bắt buộc và có độ dài tối đa là 150 ký tự. Handlebars sẽ tự động điền các thông tin này vào template và xuất ra một file vật lý:

```csharp
public class CreateProductValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name không được để trống");
        RuleFor(x => x.Name).MaximumLength(150).WithMessage("Name không được quá 150 ký tự");
    }
}
```

Bằng cách xây dựng các template tương tự cho tất cả các tầng kiến trúc theo mô hình Onion và Domain-Driven Design (bao gồm thực thể nghiệp vụ BO, đối tượng truy cập dữ liệu DAO, và đối tượng truyền dữ liệu DTO), công cụ có thể sinh ra toàn bộ mã nguồn của một tính năng chỉ trong chưa đầy một giây.

## Sức mạnh của việc quy tắc hóa

Điều cốt lõi giúp công cụ sinh mã hoạt động hiệu quả không nằm ở công nghệ C# hay thư viện Handlebars.js. Nó nằm ở việc chúng ta có thể quy tắc hóa toàn bộ quy trình viết code của mình hay không.

Để viết được những file template Handlebars chính xác, tôi đã phải ngồi lại phân tích rất kỹ các quyết định viết code hàng ngày của mình. Tôi nhận ra mọi dòng code mình viết ra đều có một lý do logic đằng sau, và hầu hết các lý do đó đều có thể chuyển hóa thành các điều kiện lập trình.

Ví dụ, làm sao tôi quyết định khi nào cần hiển thị một ô chọn (dropdown) trên giao diện người dùng? Quy tắc rất đơn giản: nếu một trường trong bảng là khóa ngoại liên kết đến một bảng khác, điều đó có nghĩa là dữ liệu nhập vào phải thuộc danh sách các thực thể đã tồn tại. Do đó, trên giao diện UI, trường này phải được hiển thị dưới dạng một ô chọn lấy dữ liệu từ API của thực thể liên kết kia.

Làm sao tôi quyết định kiểu dữ liệu của các biến trong DTO? Quy tắc là: kiểu dữ liệu của thuộc tính trong DTO phải tương thích hoàn toàn với kiểu dữ liệu của cột tương ứng trong database để tránh mất mát dữ liệu hoặc lỗi ép kiểu khi truy vấn.

Khi tôi hệ thống hóa được tất cả các quy tắc này thành một bộ logic chặt chẽ, máy tính chỉ việc thực thi chúng một cách máy móc nhưng mang lại độ chính xác tuyệt đối.

Khoảnh khắc tôi chạy công cụ lần đầu tiên trên một database thực nghiệm có các bảng Student, Teacher, Topic và StudentTopicMapping rồi nhìn thấy hàng trăm file mã nguồn được sinh ra trong thư mục dự án, tất cả đều biên dịch thành công mà không có lỗi cú pháp nào, tôi đã thực sự phấn khích. Tôi cảm thấy mình đã tìm ra chìa khóa để thoát khỏi sự tẻ nhạt của công việc viết code lặp đi lặp lại hàng ngày.

## Sự tương đồng về bản chất với AI

Trong thời điểm hiện tại, khi các công cụ hỗ trợ lập trình bằng trí tuệ nhân tạo như ChatGPT hay GitHub Copilot đang tạo nên những cuộc thảo luận sôi nổi trong cộng đồng công nghệ, tôi bắt đầu quan sát cách chúng hoạt động. Tôi nhận ra một sự thật: bản chất của AI coding và công cụ sinh mã bằng template tôi từng viết có rất nhiều điểm tương đồng.

Cả hai phương pháp đều cố gắng giải quyết một bài toán duy nhất: biến đổi thông tin từ dạng này (mô tả yêu cầu bằng ngôn ngữ tự nhiên, thiết kế database) sang dạng khác (mã nguồn chạy được) dựa trên các quy ước sẵn có.

Điểm khác biệt nằm ở cách thức chuyển hóa.

Công cụ sinh mã truyền thống dựa trên công thức: Quy tắc cứng + Template mẫu + Metadata để tạo ra mã nguồn. Phương pháp này yêu cầu sự chính xác tuyệt đối ngay từ đầu. Nếu bạn thiết kế database cẩu thả hoặc viết sai một dấu đóng ngoặc trong template Handlebars, công cụ sẽ sinh ra code lỗi hoặc không chạy được. Tuy nhiên, ưu điểm lớn nhất của nó là tính ổn định và khả năng kiểm soát hoàn toàn. Bạn luôn biết chắc chắn dòng code thứ mười của file Controller sinh ra sẽ trông như thế nào.

Trong khi đó, AI Code Generation hoạt động theo công thức: Ngữ cảnh dự án + Prompt miêu tả + Mô hình xác suất để tạo ra mã nguồn. AI không cần các template được viết sẵn một cách cứng nhắc. Nó tự học cấu trúc code từ kho dữ liệu khổng lồ của nó và cố gắng dự đoán xem từ tiếp theo, dòng code tiếp theo nên là gì để phù hợp nhất với ngữ cảnh hiện tại của bạn.

Ưu điểm lớn nhất của AI là sự linh hoạt và khả năng xử lý những logic nghiệp vụ phức tạp không theo khuôn mẫu. Nhưng nhược điểm của nó là tính bất định. Bạn không thể đảm bảo một trăm phần trăm rằng với cùng một câu prompt, AI sẽ sinh ra cùng một đoạn code vào ngày mai. Đôi khi, AI còn gặp phải hiện tượng ảo tưởng, viết những dòng code trông rất hợp lý nhưng thực chất lại chứa lỗi logic nghiêm trọng.

Tuy nhiên, dù sử dụng công cụ sinh mã bằng template hay AI, sự thành bại vẫn phụ thuộc vào một yếu tố cốt lõi: khả năng định nghĩa quy tắc của người sử dụng.

Nếu bạn không thể diễn đạt một cách rõ ràng và logic cấu trúc hệ thống của mình, nếu bạn không hiểu rõ luồng dữ liệu đi từ đâu đến đâu và cần được kiểm tra những gì, bạn sẽ không thể viết ra một template tốt, và bạn cũng không thể viết ra một câu prompt đủ chi tiết để AI hiểu đúng ý.

Nếu bạn đưa cho AI một prompt mơ hồ, nó sẽ sinh ra một đoạn code chung chung, đôi khi không khớp với kiến trúc dự án hiện tại của bạn. Ngược lại, nếu bạn cung cấp cho AI một ngữ cảnh cụ thể, các quy tắc đặt tên chi tiết và cấu trúc file mẫu của dự án, AI sẽ hoạt động giống như một công cụ sinh mã thông minh, bám sát các tiêu chuẩn của bạn để tạo ra mã nguồn chính xác.

## Viết code ít đi để suy nghĩ nhiều hơn

Hành trình tự xây dựng công cụ sinh mã cho đến việc quan sát sự phát triển của các công cụ lập trình tự động bằng AI đã thay đổi hoàn toàn tư duy của tôi về nghề lập trình.

Trước đây, tôi từng đo lường năng lực của một lập trình viên bằng tốc độ gõ phím, số lượng dòng code họ có thể viết ra mỗi ngày, hoặc khả năng nhớ cú pháp phức tạp của ngôn ngữ. Bây giờ, tôi nhận thấy những chỉ số đó đã trở nên lỗi thời.

Khi các công cụ tự động có thể viết hàng nghìn dòng code trong vài giây với chất lượng cú pháp hoàn hảo, việc cố gắng cạnh tranh với máy tính về tốc độ thực thi là một cuộc đua không cân sức và vô nghĩa.

Viết code thực chất chỉ là công đoạn thực thi cuối cùng của quá trình giải quyết bài toán.

Giá trị cốt lõi của một kỹ sư phần mềm nằm ở quá trình suy nghĩ trước khi đặt tay lên bàn phím.

Đó là khả năng ngồi lắng nghe để thấu hiểu vấn đề thực tế của người dùng, phân tích và bóc tách những yêu cầu nghiệp vụ mơ hồ thành những ràng buộc kỹ thuật cụ thể. Đó là việc thiết kế một mô hình dữ liệu đủ linh hoạt để đáp ứng sự thay đổi của doanh nghiệp trong vài năm tới, nhưng cũng đủ đơn giản để hệ thống không bị quá tải. Đó là việc đưa ra các quyết định đánh đổi giữa các phương án kiến trúc, biết rõ tại sao trong bối cảnh này nên dùng Monolith thay vì Microservices, hoặc tại sao nên chọn SQL Server thay vì MongoDB.

Nếu thiết kế hệ thống sai ngay từ đầu, các công cụ sinh mã tự động hay AI chỉ giúp chúng ta tạo ra một hệ thống lỗi với tốc độ nhanh hơn và quy mô lớn hơn mà thôi.

Khi máy móc đã làm tốt việc thực thi các cấu trúc lặp đi lặp lại, lập trình viên sẽ được giải phóng khỏi những công việc mang tính thủ công. Chúng ta có nhiều thời gian và không gian tinh thần hơn để tập trung vào những phần việc thực sự cần đến tư duy sáng tạo và khả năng giải quyết vấn đề của con người.

Ngành phát triển phần mềm đang bước vào một chương mới, nơi ranh giới giữa người viết code và người thiết kế hệ thống ngày càng trở nên mờ nhạt. Những công cụ phát triển sẽ tiếp tục thông minh hơn, nhanh hơn và tự động hóa nhiều công đoạn hơn.

Nhưng có một điều không thay đổi: một hệ thống phần mềm tốt luôn là kết quả của một quá trình suy nghĩ thấu đáo về thế giới thực. Chúng ta tự động hóa những gì có quy luật, để dành trọn vẹn trí tuệ của mình cho những bài toán chưa có quy luật.

Và đó mới là giá trị thực sự định nghĩa nên một lập trình viên.
