package com.exe.super_rice.service;

import com.exe.super_rice.dto.request.ChatRequest;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder builder) {
        chatClient = builder.build();
    }

    public String chat(ChatRequest request) {
        SystemMessage systemMessage = new SystemMessage("""
        Bạn là chuyên gia tư vấn về các loại gạo tại Việt Nam.
        Bạn có kiến thức chuyên sâu về đặc điểm, công dụng, giá trị dinh dưỡng của các loại gạo như: gạo ST25, gạo lứt, gạo nếp, gạo tám, gạo huyết rồng, v.v...
        Hãy trả lời khách hàng một cách lịch sự, chuyên nghiệp và dễ hiểu.
        Trong phần tư vấn, hãy đề xuất ít nhất 2–3 loại gạo phù hợp, kèm mô tả ngắn gọn và lợi ích cho từng loại.
        Nếu khách hàng có nhu cầu cụ thể (ví dụ: ăn kiêng, tiểu đường, người lớn tuổi), hãy đưa ra đề xuất tương ứng.
        Trả lời bằng tiếng Việt.
        """);


        UserMessage userMessage = new UserMessage(request.message());

        Prompt prompt = new Prompt(systemMessage, userMessage);

        return chatClient
                .prompt(prompt)
                .call()
                .content();
    }
}
