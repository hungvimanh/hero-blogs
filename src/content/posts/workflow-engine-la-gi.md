---
title: "Tôi từng nghĩ Workflow Engine chỉ là một chuỗi duyệt"
date: 2024-06-01
description: "Hành trình từ những dòng code hardcode rẽ nhánh đến tư duy bóc tách quy trình thành dữ liệu và bài học thiết kế hệ thống thích ứng sự thay đổi."
tags: ["Workflow", "Kiến trúc", "Lập trình"]
thumbnail: /images/posts/workflow-engine.svg
draft: false
---

Tôi từng nghĩ Workflow Engine chỉ là một chuỗi duyệt.

Người A duyệt.
Xong tới người B.
Rồi người C.
Hết.

Tôi từng nghĩ chỉ cần một bảng lưu trạng thái trong database, vài giá trị Enum biểu thị tình trạng duyệt và một ít logic rẽ nhánh if else là đủ.

Tôi đã sai ngay từ dự án đầu tiên.

## Yêu cầu đơn giản của ngày đầu tiên

Hệ thống đầu tiên tôi tham gia xây dựng có quy trình duyệt mua sắm văn phòng phẩm khá đơn giản.

Nhân viên tạo yêu cầu.
Trưởng phòng duyệt.
Kế toán chi tiền.
Hoàn thành.

Tôi viết code rất nhanh. Mỗi bước duyệt ứng với một trạng thái chuyển tiếp cụ thể:

```csharp
public class ApprovalService
{
    public void ProcessApproval(PurchaseRequest request, string action)
    {
        if (request.Status == RequestStatus.Draft && action == "Submit")
        {
            request.Status = RequestStatus.PendingManager;
            request.Assignee = request.CreatedBy.ManagerId;
        }
        else if (request.Status == RequestStatus.PendingManager && action == "Approve")
        {
            request.Status = RequestStatus.PendingAccountant;
            request.Assignee = GetAccountantId();
        }
        else if (request.Status == RequestStatus.PendingAccountant && action == "Approve")
        {
            request.Status = RequestStatus.Completed;
            request.Assignee = null;
        }
    }
}
```

Mọi thứ chạy tốt. Tôi tự tin giao việc.

Cho đến khi khách hàng gửi yêu cầu thay đổi đầu tiên:

> Đơn hàng dưới 10 triệu đồng chỉ cần trưởng phòng duyệt.
> Đơn hàng từ 10 triệu đồng trở lên bắt buộc phải qua giám đốc tài chính duyệt trước khi tới kế toán.

Tôi sửa code, thêm một nhánh kiểm tra số tiền:

```csharp
if (request.Status == RequestStatus.PendingManager && action == "Approve")
{
    if (request.Amount >= 10000000)
    {
        request.Status = RequestStatus.PendingDirector;
        request.Assignee = GetDirectorId();
    }
    else
    {
        request.Status = RequestStatus.PendingAccountant;
        request.Assignee = GetAccountantId();
    }
}
```

Một tuần sau, yêu cầu tiếp theo xuất hiện:

> Phòng Kinh doanh đi quy trình duyệt khác.
> Phòng Nhân sự đi quy trình duyệt khác.
> Phòng Công nghệ thông tin lại có quy trình duyệt riêng.

Code của tôi bắt đầu phình to. Những câu lệnh if else lồng nhau xuất hiện ngày càng nhiều. 

Mỗi lần khách hàng muốn đổi quy trình duyệt, tôi lại phải mở IDE, sửa code, biên dịch, chạy kiểm thử, tạo bản build rồi deploy lên server. Mỗi lần deploy là một lần lo lắng xem những thay đổi mới có vô tình làm hỏng các quy trình cũ đang chạy hay không.

## Cơn ác mộng mang tên thay đổi

Tôi nhận ra mình đang đối mặt với một vấn đề lớn. Yêu cầu đỉnh điểm xuất hiện khi khách hàng nói:

> Chúng tôi muốn tự thay đổi các bước duyệt trên giao diện. Quy trình nghiệp vụ của chúng tôi thay đổi liên tục theo quý, không thể mỗi lần đổi lại đợi lập trình viên sửa code.

Tôi ngồi nhìn lại đống code rẽ nhánh của mình và nhận ra: Tôi không hề xây dựng một Workflow Engine. Tôi chỉ đang hardcode một quy trình duyệt cụ thể.

## Sự khác biệt giữa hệ thống duyệt và Workflow Engine

Sự khác biệt nằm ở chỗ:

Với hệ thống duyệt hardcode, code sẽ nắm giữ quy trình. Mỗi bước đi, mỗi điều kiện rẽ nhánh đều nằm trong code. Muốn thay đổi quy trình, bắt buộc phải sửa code và deploy lại.

Với Workflow Engine, code hoàn toàn không biết quy trình. Quy trình lúc này nằm ở dữ liệu cấu hình. Engine chỉ là bộ máy trung lập thực hiện nhiệm vụ: đọc cấu hình, đánh giá điều kiện tại thời điểm chạy và chuyển trạng thái.

Để chuyển đổi sang Workflow Engine, tôi chia hệ thống thành ba thành phần độc lập:

* **Định nghĩa quy trình (Workflow Definition)**: Dữ liệu cấu hình tĩnh mô tả các bước (Steps) và quy tắc chuyển trạng thái (Transitions) kèm điều kiện rẽ nhánh (Conditions). Cấu hình này thường được lưu dưới dạng JSON hoặc XML.
* **Bộ máy xử lý (Workflow Engine)**: Phần code cốt lõi của hệ thống, không chứa logic của riêng quy trình nào. Engine chỉ đọc cấu hình, đánh giá điều kiện dựa trên dữ liệu thực tế và chuyển trạng thái.
* **Thực thể chạy (Runtime Instance)**: Thực thể động lưu trạng thái hiện tại (Current Step Id) và dữ liệu nghiệp vụ của lượt chạy đó (như số tiền đơn hàng, người tạo).

Dưới đây là sơ đồ mô tả mối quan hệ giữa ba thành phần này:

![Sơ đồ hoạt động của Workflow Engine](/images/posts/workflow-engine.svg)

## Thiết kế một bộ máy linh hoạt

Để hiện thực hóa ý tưởng này bằng C#, tôi thay thế đống code if else lồng nhau bằng một thiết kế hướng cấu hình. Đầu tiên là định nghĩa các cấu trúc dữ liệu cho quy trình:

```csharp
public class WorkflowDefinition
{
    public string Id { get; set; }
    public List<WorkflowStep> Steps { get; set; } = new();
    public List<WorkflowTransition> Transitions { get; set; } = new();
}

public class WorkflowStep
{
    public string Id { get; set; }
    public string Role { get; set; }
}

public class WorkflowTransition
{
    public string FromStepId { get; set; }
    public string ToStepId { get; set; }
    public string ConditionExpression { get; set; } // Ví dụ: "Amount >= 10000000"
}

public class WorkflowInstance
{
    public string Id { get; set; }
    public string DefinitionId { get; set; }
    public string CurrentStepId { get; set; }
    public Dictionary<string, object> Data { get; set; } = new();
}
```

Tiếp theo, Workflow Engine sẽ chịu trách nhiệm duyệt qua các cấu hình này mà không cần quan tâm chi tiết nghiệp vụ của đơn hàng là gì:

```csharp
public class WorkflowEngine
{
    private readonly IWorkflowRepository _repository;
    private readonly IExpressionEvaluator _evaluator; // Trình biên dịch biểu thức điều kiện

    public WorkflowEngine(IWorkflowRepository repository, IExpressionEvaluator evaluator)
    {
        _repository = repository;
        _evaluator = evaluator;
    }

    public void Trigger(WorkflowInstance instance, string action)
    {
        var definition = _repository.GetDefinition(instance.DefinitionId);
        
        // Tìm các transition hợp lệ xuất phát từ bước hiện tại
        var possibleTransitions = definition.Transitions
            .Where(t => t.FromStepId == instance.CurrentStepId)
            .ToList();

        foreach (var transition in possibleTransitions)
        {
            // Nếu có điều kiện, đánh giá điều kiện đó dựa trên dữ liệu của instance
            if (!string.IsNullOrEmpty(transition.ConditionExpression))
            {
                var isMatch = _evaluator.Evaluate(transition.ConditionExpression, instance.Data);
                if (!isMatch) continue;
            }

            // Chuyển sang bước tiếp theo
            instance.CurrentStepId = transition.ToStepId;
            break;
        }
    }
}
```

Với cách thiết kế này, nếu ngày mai khách hàng muốn thêm một bước duyệt mới hoặc thay đổi hạn mức tiền từ 10 triệu lên 20 triệu, tôi chỉ cần cập nhật lại bản ghi JSON định nghĩa quy trình trong database. Hệ thống không cần sửa một dòng code nào, không cần build lại và không cần deploy.

## Sự đánh đổi và bài học thiết kế

Thiết kế này không phải không có đánh đổi.

Khi chuyển dịch từ code cứng sang hướng cấu hình, hệ thống trở nên phức tạp hơn rất nhiều. Việc viết code kiểm thử (unit test) cho toàn bộ các kịch bản duyệt không còn đơn giản là chạy qua các nhánh code. Tôi phải xây dựng thêm các công cụ để kiểm tra tính toàn vẹn của cấu hình JSON, tránh trường hợp quy trình cấu hình bị lặp vô tận hoặc đi vào ngõ cụt mà không có bước thoát. Hiệu năng hệ thống cũng bị ảnh hưởng một phần do phải đọc cấu hình và biên dịch các biểu thức điều kiện động ở mỗi bước duyệt.

Nhưng đổi lại, hệ thống có khả năng thích ứng cực kỳ cao.

Bài học lớn nhất tôi rút ra được sau lần thiết kế lại đó là: Khi đối mặt với một yêu cầu nghiệp vụ phức tạp, câu hỏi đầu tiên lập trình viên cần đặt ra không phải là "Quy trình này hoạt động chi tiết như thế nào?".

Câu hỏi đúng phải là: "Ai sẽ là người thay đổi quy trình này sau 6 tháng? Họ sẽ thay đổi nó bằng cách nào?".

Nếu câu trả lời là "lập trình viên phải sửa code", thì rất có thể bạn đang xây dựng một giải pháp ngắn hạn. Bạn giải quyết được bài toán của ngày hôm nay, nhưng gieo mầm cho sự bế tắc của ngày mai.

---

Mọi hệ thống phần mềm đều phản ánh cách tổ chức vận hành. Nếu quy trình của doanh nghiệp liên tục biến động, kiến trúc phần mềm phải được thiết kế để hấp thụ sự biến động đó thông qua dữ liệu, thay vì cố gắng chống lại nó bằng cách viết thêm code.

Những quy trình duyệt trong hệ thống của bạn hôm nay, nếu ngày mai cần thay đổi, bạn sẽ phải sửa code hay chỉ cần cập nhật một dòng dữ liệu?
