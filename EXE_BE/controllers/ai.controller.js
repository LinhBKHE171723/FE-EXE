const axios = require("axios");

// Giới hạn lịch sử để tránh prompt quá dài
const trimHistory = (history = [], maxTurns = 8) => {
  const safe = Array.isArray(history) ? history : [];
  return safe.slice(-maxTurns);
};

exports.chatWithAI = async (req, res) => {
  const { message, history = [] } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ reply: "Thiếu GEMINI_API_KEY trong .env" });
    }

    // Chỉ trả lời khi có câu hỏi hợp lệ
    const userText = (message || "").toString().trim();
    if (!userText) {
      return res.status(400).json({ reply: "Vui lòng nhập câu hỏi." });
    }

    const MODEL = "gemini-2.5-flash";
    const ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`;

    // SYSTEM PROMPT: chỉ phạm vi lúa–gạo, không dùng thông tin địa phương
    const SYSTEM_PROMPT = `
Bạn là trợ lý AI cho website bán gạo sạch SuperRice. Hãy hoạt động trong PHẠM VI DUY NHẤT: hệ sinh thái lúa–gạo.

# Mục tiêu
- Tư vấn vòng đời cây lúa: chọn giống, làm đất, lịch thời vụ (nếu người dùng chưa nêu vùng, hãy hỏi gọn 1–2 chi tiết), mật độ gieo sạ/cấy, quản lý nước, bón phân (N-P-K, hữu cơ, vi sinh), IPM sâu bệnh, thu hoạch/độ chín, sấy/bảo quản, xay xát, phân loại gạo.
- Tư vấn dinh dưỡng gạo, chỉ số GI, bảo quản gạo gia đình, mẹo nấu cơm/gạo lứt/món từ gạo.
- Gợi ý sản phẩm SuperRice phù hợp theo nhu cầu (dẻo – thơm – khô, sushi, cháo em bé, eat clean).

# Ngoài phạm vi
- Nếu câu hỏi không liên quan lúa–gạo, trả lời lịch sự:
  "Xin lỗi, mình chỉ có thể tư vấn về lúa, gạo, quy trình trồng – chế biến – dinh dưỡng và sản phẩm SuperRice thôi ạ."

# Phong cách
- Tiếng Việt tự nhiên, thân thiện, câu ngắn, gợi ý rõ ràng.
- Thiếu bối cảnh → hỏi lại tối đa 2 ý (ví dụ: vùng trồng, giống, quy mô ruộng, mục tiêu năng suất).
- Với phân bón/thuốc BVTV → nêu mức THAM KHẢO, nhắc đọc nhãn/khuyến cáo địa phương, ưu tiên IPM, an toàn lao động và thời gian cách ly (PHI).

# Khung trả lời nhanh (khi thuộc chủ đề "farming")
1) Bối cảnh (nếu đã biết; nếu chưa thì hỏi ngắn)
2) Giống gợi ý (nhóm TGST)
3) Mật độ gieo/cấy & quản lý nước
4) Bón phân tham khảo theo giai đoạn
5) IPM sâu bệnh chủ lực (triệu chứng–ngưỡng–xử lý)
6) Thu hoạch–sấy–bảo quản
7) Liên hệ sản phẩm SuperRice (nếu phù hợp)

# Không làm
- Không tư vấn hóa chất ngoài nhãn, không khuyến khích lạm dụng thuốc.
- Không chẩn đoán y khoa.
    `.trim();

    const trimmedHistory = trimHistory(history, 8);

    const generationConfig = {
      temperature: 0.6,
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 1024,
    };

    const safetySettings = [
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_ONLY_HIGH",
      },
    ];

    // Body cho Gemini REST
    const contents = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      ...trimmedHistory.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: userText }] },
    ];

    const response = await axios.post(
      ENDPOINT,
      { contents, generationConfig, safetySettings },
      { timeout: 20000 }
    );

    const reply =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Xin lỗi, mình chưa hiểu rõ câu hỏi của bạn 😅";

    return res.json({ reply });
  } catch (error) {
    console.error("AI Error:", error.response?.data || error.message);
    return res.status(500).json({
      reply:
        "Lỗi khi kết nối tới Gemini: " +
        (error.response?.data?.error?.message || error.message),
    });
  }
};
