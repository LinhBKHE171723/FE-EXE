export default function Policy() {
  return (
    <section className="section-content" id="policy">
      <h2
        className="section-title"
        style={{
          textAlign: "center",
          fontSize: "2rem",
          marginBottom: "2rem",
          color: "#2c3e50",
        }}
      >
        Chính sách &amp; Điều khoản
      </h2>

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "grid",
          gap: "1.5rem",
        }}
      >
        {[
          {
            title: "1) Đổi trả trong 7 ngày",
            items: [
              "Sản phẩm còn nguyên bao bì, chưa sử dụng; hoá đơn/mã đơn đầy đủ.",
              "Không áp dụng cho hàng tặng kèm, dùng thử, hoặc hư hỏng do bảo quản sai.",
              "Hoàn tiền về phương thức thanh toán ban đầu trong 3–5 ngày làm việc.",
            ],
          },
          {
            title: "2) Vận chuyển & phí ship",
            items: [
              "Giao hàng nội thành 24–48h; ngoại thành/tỉnh 2–5 ngày tuỳ khu vực.",
              "Miễn phí đơn từ 499.000đ (nội thành). Phí phát sinh hiển thị tại bước thanh toán.",
            ],
          },
          {
            title: "3) Cam kết chất lượng",
            items: [
              "Độ ẩm tiêu chuẩn ~14%; không pha trộn; không chất bảo quản.",
              "Nếu phát hiện gạo kém chất lượng/ẩm mốc do vận chuyển, chúng tôi sẽ đổi mới 100%.",
            ],
          },
          {
            title: "4) Thanh toán an toàn",
            items: [
              "Hỗ trợ COD, chuyển khoản, thẻ nội địa/quốc tế.",
              "Mọi giao dịch được mã hoá; chúng tôi không lưu thông tin thẻ.",
            ],
          },
          {
            title: "5) Bảo mật thông tin cá nhân",
            items: [
              "Chỉ sử dụng dữ liệu để phục vụ đơn hàng và chăm sóc khách hàng.",
              "Bạn có quyền yêu cầu sửa/xoá dữ liệu—liên hệ: superrice89@gmail.com",
            ],
          },
          {
            title: "6) Khiếu nại & hỗ trợ",
            items: [
              "Hotline: 0378757198 (08:00–21:00). Email: superrice89@gmail.com",
              "Thời gian phản hồi trong 24h làm việc.",
            ],
          },
        ].map((policy, idx) => (
          <section
            key={idx}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              borderLeft: "6px solid #27ae60",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                marginBottom: "1rem",
                color: "#27ae60",
              }}
            >
              {policy.title}
            </h3>
            <ul style={{ marginLeft: "1.2rem", lineHeight: 1.7 }}>
              {policy.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
