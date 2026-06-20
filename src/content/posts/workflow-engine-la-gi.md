---
title: "Tôi từng nghĩ Workflow Engine chỉ là một chuỗi duyệt"
date: 2024-06-01
description: "Hành trình từ những dòng if-else hardcode đến câu hỏi thật sự quan trọng: ai đang giữ quyền kiểm soát quy trình của bạn?"
tags: ["Workflow", "Kiến trúc", "Lập trình"]
thumbnail: /images/posts/workflow-engine.svg
draft: false
---

Khách hàng gửi email sáng thứ Hai. Họ muốn thêm một bước duyệt mới vào quy trình mua sắm. Giám đốc tài chính phải ký với đơn hàng trên 10 triệu. Cần xong trước cuối tuần.

Tôi nhìn vào code. Rồi nhìn lại email. Rồi nhìn vào code lần nữa.

Tôi biết mình làm được. Nhưng tôi cũng biết tuần sau sẽ có email khác. Và lần nào cũng vậy: mở IDE, sửa code, chạy test, deploy, rồi lo.

Đó là lúc tôi nhận ra mình đang là nút thắt trong quy trình của người khác.

## Ngày đầu mọi thứ có vẻ đơn giản

Hệ thống đầu tiên tôi xây có quy trình duyệt mua sắm văn phòng phẩm. Đơn giản đến mức gần như không cần thiết kế.

Nhân viên tạo yêu cầu. Trưởng phòng duyệt. Kế toán chi tiền. Xong.

Tôi viết code nhanh:

```csharp
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
    }
}
```

Mọi thứ chạy tốt. Tôi giao việc, bắt đầu sprint tiếp theo.

## Những email tiếp theo

Email đầu tiên về thay đổi quy trình đến một tuần sau.

Đơn hàng dưới 10 triệu chỉ cần trưởng phòng. Đơn hàng trên 10 triệu phải qua giám đốc tài chính.

Tôi sửa trong một buổi sáng. Thêm một điều kiện kiểm tra số tiền, chạy test, deploy.

Email thứ hai đến hai tuần sau. Phòng Kinh doanh muốn quy trình duyệt riêng. Phòng Nhân sự cũng vậy. Phòng Công nghệ thông tin lại khác nữa.

Code của tôi bắt đầu phình ra. If-else lồng nhau ngày càng nhiều. Nhưng tôi vẫn nghĩ đây là chuyện bình thường. Yêu cầu thay đổi thì sửa code thôi.

Cho đến khi email tiếp theo đến, lúc tôi đang chuẩn bị demo một tính năng khác:

> Chúng tôi muốn tự thay đổi các bước duyệt trên giao diện. Quy trình nghiệp vụ của chúng tôi thay đổi theo quý, không thể mỗi lần đổi lại đợi lập trình viên.

Tôi đọc xong, đóng laptop lại, ngồi một lúc.

Nghiệp chướng từ những tháng đầu bắt đầu đòi nợ.

## Cái giá thật sự

Người ta hay nói code if-else lồng nhau là xấu. Đó không phải vấn đề của tôi lúc đó.

Vấn đề là mỗi lần khách hàng muốn thay đổi quy trình, tôi phải mở IDE, sửa code, chạy test, build, rồi deploy. Mỗi lần deploy là một lần lo xem mình có vô tình làm hỏng quy trình nào đang chạy không.

Khách hàng thay đổi quy trình là chuyện bình thường của họ. Họ không hiểu tại sao mỗi lần thay đổi lại mất vài ngày và cần lên lịch với dev.

Nhưng tôi cũng không hỏi từ đầu. Tôi chỉ xây cái tôi thấy trước mắt.

## Câu hỏi đúng

Câu hỏi tôi đã hỏi khi bắt đầu dự án: "Quy trình này hoạt động như thế nào?"

Câu hỏi tôi đáng lẽ phải hỏi: "Sáu tháng nữa, ai sẽ thay đổi quy trình này? Và họ sẽ làm bằng cách nào?"

Câu hỏi thứ hai thay đổi mọi thứ.

Nếu câu trả lời là "khách hàng tự thay đổi trên giao diện", thì quy trình không thể nằm trong code. Nó phải nằm trong dữ liệu. Code chỉ là bộ máy đọc và thực thi dữ liệu đó.

Đó là sự khác biệt giữa hai thứ tôi từng nghĩ là một.

## Quy trình trong code và quy trình trong dữ liệu

Hệ thống tôi đã xây: code giữ quy trình. Mỗi bước đi, mỗi điều kiện rẽ nhánh đều nằm trong code. Muốn thay đổi quy trình, phải đổi code.

Workflow Engine: code không biết quy trình. Quy trình nằm trong dữ liệu cấu hình. Engine chỉ đọc cấu hình, đánh giá điều kiện, rồi chuyển trạng thái.

Tôi chia hệ thống thành ba phần tách biệt:

* **Định nghĩa quy trình:** dữ liệu cấu hình mô tả các bước và điều kiện chuyển tiếp. Không chứa logic nghiệp vụ. Chỉ là cấu trúc.
* **Bộ máy thực thi:** code trung lập, không biết gì về đơn hàng hay số tiền. Chỉ đọc định nghĩa, đánh giá điều kiện, chuyển trạng thái.
* **Phiên chạy:** lưu trạng thái hiện tại và dữ liệu thực tế của một lượt duyệt cụ thể.

![Sơ đồ hoạt động của Workflow Engine](/images/posts/workflow-engine.svg)

Cấu trúc dữ liệu cho định nghĩa quy trình:

```csharp
public class WorkflowDefinition
{
    public string Id { get; set; }
    public List<WorkflowStep> Steps { get; set; } = new();
    public List<WorkflowTransition> Transitions { get; set; } = new();
}

public class WorkflowTransition
{
    public string FromStepId { get; set; }
    public string ToStepId { get; set; }
    public string ConditionExpression { get; set; } // "Amount >= 10000000"
}

public class WorkflowInstance
{
    public string Id { get; set; }
    public string DefinitionId { get; set; }
    public string CurrentStepId { get; set; }
    public Dictionary<string, object> Data { get; set; } = new();
}
```

Bộ máy thực thi không cần biết đơn hàng là gì. Nó chỉ đọc điều kiện từ cấu hình và đánh giá dựa trên dữ liệu thực tế:

```csharp
public void Trigger(WorkflowInstance instance, string action)
{
    var definition = _repository.GetDefinition(instance.DefinitionId);

    var transitions = definition.Transitions
        .Where(t => t.FromStepId == instance.CurrentStepId)
        .ToList();

    foreach (var transition in transitions)
    {
        if (!string.IsNullOrEmpty(transition.ConditionExpression))
        {
            var isMatch = _evaluator.Evaluate(transition.ConditionExpression, instance.Data);
            if (!isMatch) continue;
        }

        instance.CurrentStepId = transition.ToStepId;
        break;
    }
}
```

Từ lúc này, khách hàng muốn thêm bước duyệt hoặc thay đổi hạn mức tiền, chỉ cần cập nhật bản ghi JSON trong database. Không cần mở IDE. Không cần build. Không cần deploy.

## Ai giữ quy trình, người đó có quyền

Nhìn lại, tôi thấy sai lầm của mình không phải là viết code xấu.

Sai lầm là không hỏi câu hỏi đúng từ đầu.

Khi quy trình nằm trong code, dev nắm quyền kiểm soát. Mỗi lần nghiệp vụ thay đổi, dev là người bấm nút. Điều đó không chỉ tạo ra nút thắt kỹ thuật, nó tạo ra sự phụ thuộc trong tổ chức. Business không tự chủ được quy trình của chính mình.

Khi quy trình nằm trong dữ liệu, business tự kiểm soát được. Dev không còn là người gác cổng nữa.

Workflow Engine không phải là giải pháp kỹ thuật thuần túy. Nó là cách phân quyền.

Đổi lại, hệ thống phức tạp hơn nhiều. Kiểm thử khó hơn vì không còn chạy qua từng nhánh code nữa mà phải kiểm tra tính toàn vẹn của cấu hình. Hiệu năng cũng chịu ảnh hưởng vì phải đọc và biên dịch điều kiện động ở mỗi bước.

Không phải lúc nào cũng nên làm vậy. Nhưng khi câu trả lời cho câu hỏi "ai thay đổi quy trình?" là "người dùng cuối tự thay đổi", thì đây là hướng không thể tránh.

---

Hệ thống của bạn đang có bao nhiêu quy trình nằm trong code mà lẽ ra nên nằm trong dữ liệu?

Và ai đang trả giá cho điều đó mỗi lần nghiệp vụ thay đổi?
