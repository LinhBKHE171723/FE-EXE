import { useState } from "react";
import ChatWidget from "./ChatWidget";

export default function ChatBubble() {
  const [open, setOpen] = useState(false); // chat AI
  const [showZaloQR, setShowZaloQR] = useState(false); // popup QR Zalo

  return (
    <>
      {/* Bong bóng Chat AI */}
      <button
        className="chat-bubble"
        aria-label="Mở chat AI"
        onClick={() => setOpen(true)}
        style={{
          right: "20px",
          bottom: "20px",
          backgroundColor: "#4caf50",
        }}
      >
        <i className="fas fa-message" />
      </button>

      {/* Bong bóng Zalo (mở popup QR) */}
      <button
        className="chat-bubble"
        aria-label="Liên hệ Zalo"
        onClick={() => setShowZaloQR(true)}
        style={{
          right: "20px",
          bottom: "80px",
          backgroundColor: "white",
        }}
      >
        <img
          src="/images/zalo.png"
          alt="Zalo"
          style={{ width: "28px", height: "28px" }}
        />
      </button>

      {/* Bong bóng Facebook */}
      <a
        href="https://www.facebook.com/profile.php?id=61580996324879"
        target="_blank"
        rel="noopener noreferrer"
        className="chat-bubble"
        aria-label="Liên hệ Facebook"
        style={{
          right: "20px",
          bottom: "140px",
          backgroundColor: "white",
        }}
      >
        <img
          src="/images/fb.png"
          alt="Facebook"
          style={{ width: "28px", height: "28px" }}
        />
      </a>

      {/* Chat AI */}
      {open && <ChatWidget onClose={() => setOpen(false)} />}

      {/* Popup Zalo QR */}
      {showZaloQR && (
        <div
          className="modal-overlay active"
          onClick={() => setShowZaloQR(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
              maxWidth: "350px",
              width: "90%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <button
              className="modal-close"
              onClick={() => setShowZaloQR(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <h2>Quét mã QR Zalo OA</h2>
            <img
              src="/images/qr.jpg" // 👉 thay bằng file QR code của bạn
              alt="QR Zalo OA"
              style={{ width: "220px", marginTop: "15px" }}
            />
            <p style={{ marginTop: "10px" }}>
              Hoặc nhấn trực tiếp{" "}
              <a
                href="https://zalo.me/3664994468292144267" // link Zalo OA thật
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007aff", fontWeight: "bold" }}
              >
                vào đây
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
