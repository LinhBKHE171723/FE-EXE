import { motion } from "framer-motion";

export default function HomePolicySnippet() {
  const policies = [
    {
      title: "Đổi trả 7 ngày",
      desc: "Sản phẩm còn nguyên bao bì, chưa sử dụng; có hoá đơn/mã đơn.",
    },
    {
      title: "Hoàn tiền nhanh",
      desc: "Hoàn về phương thức thanh toán ban đầu trong 3–5 ngày làm việc.",
    },
    {
      title: "Cam kết chất lượng",
      desc: "Độ ẩm chuẩn ~14%, không pha trộn, lỗi do vận chuyển đổi mới 100%.",
    },
  ];

  return (
    <section className="section-content" id="home-policy">
      <h2
        className="section-title"
        style={{
          textAlign: "center",
          fontSize: "1.8rem",
          marginBottom: "1.5rem",
          color: "#2c3e50",
        }}
      >
        Chính sách đổi trả
      </h2>

      <div
        className="products-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "1.5rem",
        }}
      >
        {policies.map((p, i) => (
          <motion.div
            key={i}
            className="product-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            whileHover={{ scale: 1.05 }}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              border: "2px solid transparent",
              cursor: "default",
              transition: "border-color 0.3s",
            }}
          >
            <h3
              className="product-name"
              style={{
                fontSize: "1.2rem",
                color: "#27ae60",
                marginBottom: "0.8rem",
              }}
            >
              {p.title}
            </h3>
            <p style={{ lineHeight: 1.6, color: "#555" }}>{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
