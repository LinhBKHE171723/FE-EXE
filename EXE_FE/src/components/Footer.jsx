export default function Footer() {
  return (
    <footer
      className="footer"
      style={{
        background: "#fefcf6", // nền sáng kiểu màu gạo
        color: "#444",
        padding: "2.5rem 1rem 1rem",
        marginTop: "3rem",
      }}
    >
      <div
        className="footer-content"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2rem",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Brand */}
        <div>
          <h3
            style={{
              color: "#2e7d32", // xanh lá dịu
              marginBottom: "1rem",
              fontSize: "1.4rem",
              fontWeight: "600",
            }}
          >
            Supper Rice
          </h3>
          <p style={{ lineHeight: 1.7 }}>
            Chúng tôi cam kết mang đến những hạt gạo sạch, chất lượng cao với
            giá cả phù hợp cho sinh viên và gia đình Việt.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3
            style={{
              color: "#2e7d32",
              marginBottom: "1rem",
              fontSize: "1.2rem",
            }}
          >
            Liên Hệ
          </h3>
          <p style={{ marginBottom: "0.5rem" }}>
            <i
              className="fas fa-map-marker-alt"
              style={{ marginRight: "8px", color: "#fbc02d" }}
            />
            FPT University Hà Nội
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            <i
              className="fas fa-phone"
              style={{ marginRight: "8px", color: "#fbc02d" }}
            />
            0123 456 789
          </p>
          <p>
            <i
              className="fas fa-envelope"
              style={{ marginRight: "8px", color: "#fbc02d" }}
            />
            supperrice@gmail.com
          </p>
        </div>

        {/* Policies */}
        <div>
          <h3
            style={{
              color: "#2e7d32",
              marginBottom: "1rem",
              fontSize: "1.2rem",
            }}
          >
            Chính Sách
          </h3>
          {[
            "Chính sách bảo mật",
            "Điều khoản sử dụng",
            "Chính sách đổi trả",
            "Hướng dẫn mua hàng",
          ].map((policy, idx) => (
            <p
              key={idx}
              style={{
                marginBottom: "0.5rem",
                cursor: "pointer",
                transition: "color .3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fbc02d")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
            >
              {policy}
            </p>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div
        className="footer-bottom"
        style={{
          marginTop: "2rem",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#666",
        }}
      >
        © 2025 Supper Rice
      </div>
    </footer>
  );
}
