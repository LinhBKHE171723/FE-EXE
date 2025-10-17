const axios = require("axios");

exports.chatWithAI = async (req, res) => {
  const { message, history = [] } = req.body;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
      return res.status(500).json({ reply: "Thiếu GEMINI_API_KEY trong .env" });

    console.log("📩 AI request:", message);

    // 🔹 Dùng model ổn định
    const MODEL = "gemini-2.5-flash";
    const ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`;

    // 🧠 Prompt định hướng: chỉ nói về gạo, dinh dưỡng và sản phẩm web
    const SYSTEM_PROMPT = `
      Bạn là trợ lý AI của trang web bán gạo sạch SuperRice.
      Nhiệm vụ của bạn:
      - Chỉ trả lời về các chủ đề liên quan đến gạo, dinh dưỡng, sức khỏe, món ăn từ gạo, cách nấu cơm, hoặc sản phẩm của SupperRice.
      - Nếu người dùng hỏi gì không liên quan, hãy lịch sự trả lời: 
        "Xin lỗi, mình chỉ có thể tư vấn về các sản phẩm gạo và thông tin dinh dưỡng thôi ạ."
      - Luôn trả lời ngắn gọn, thân thiện, bằng tiếng Việt tự nhiên.
    `;

    const response = await axios.post(ENDPOINT, {
      contents: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        ...history.map((m) => ({
          role: m.role === "user" ? "user" : "model",
          parts: [{ text: m.content }],
        })),
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Xin lỗi, mình chưa hiểu rõ câu hỏi của bạn 😅";

    console.log("🤖 Gemini trả lời:", reply);

    res.json({ reply });
  } catch (error) {
    console.error("AI Error:", error.response?.data || error.message);
    res.status(500).json({
      reply:
        "Lỗi khi kết nối tới Gemini: " +
        (error.response?.data?.error?.message || error.message),
    });
  }
};
