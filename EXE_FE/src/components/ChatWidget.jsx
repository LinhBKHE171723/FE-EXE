import { useEffect, useRef, useState } from "react";
import { sendChat } from "../api/ai";

export default function ChatWidget({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Xin chào 👋, mình là AI trợ lý. Mình có thể giúp gì cho bạn hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  // Scroll tự động xuống dưới khi messages hoặc loading thay đổi
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChat({
        message: text,
        history: [...messages, userMsg],
      });
      const reply = res?.reply || "Mình đã nhận được câu hỏi của bạn.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Xin lỗi, có lỗi xảy ra: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="chat-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 2000,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        padding: "40px 60px", // 👈 cách lề phải & dưới xa hơn
      }}
    >
      <div
        className="chat-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Chat AI"
        style={{
          width: "400px", // 👈 to hơn
          maxHeight: "600px", // 👈 cao hơn
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 10px 35px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* phần nội dung giữ nguyên */}

        {/* Header */}
        <div
          className="chat-header"
          style={{
            padding: "10px",
            background: "#4caf50",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="title">
            <i className="fas fa-robot" style={{ marginRight: "6px" }} />
            Trợ lý AI
          </div>
          <button
            className="close"
            onClick={onClose}
            aria-label="Đóng"
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          className="chat-body"
          ref={listRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px",
            background: "#f9f9f9",
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`msg ${m.role}`}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "8px",
              }}
            >
              <div
                className="bubble"
                style={{
                  maxWidth: "70%",
                  padding: "8px 12px",
                  borderRadius: "16px",
                  background: m.role === "user" ? "#4caf50" : "#e0e0e0",
                  color: m.role === "user" ? "#fff" : "#000",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div
              className="msg assistant"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "8px",
              }}
            >
              <div
                className="bubble typing"
                style={{
                  width: "40px",
                  height: "20px",
                  display: "flex",
                  gap: "3px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#999",
                    animation: "blink 1s infinite",
                  }}
                />
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#999",
                    animation: "blink 1s infinite 0.2s",
                  }}
                />
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#999",
                    animation: "blink 1s infinite 0.4s",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div
          className="chat-input"
          style={{
            display: "flex",
            borderTop: "1px solid #eee",
            padding: "8px",
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            style={{
              flex: 1,
              padding: "8px",
              resize: "none",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            aria-label="Gửi"
            style={{
              marginLeft: "6px",
              padding: "0 12px",
              background: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            <i className="fas fa-paper-plane" />
          </button>
        </div>
      </div>

      {/* Typing animation keyframes */}
      <style>{`
        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
