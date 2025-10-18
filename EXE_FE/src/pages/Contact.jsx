import { motion } from "framer-motion";

export default function Contact() {
  const contacts = [
    {
      id: "phone",
      icon: <i className="fas fa-phone" />,
      text: "0378757198",
      color: "#4caf50",
      link: "tel:0123456789",
    },
    {
      id: "mail",
      icon: <i className="fas fa-envelope" />,
      text: "supperrice89@gmail.com",
      color: "#f9a825",
      link: "mailto:supperrice89@gmail.com",
    },
    {
      id: "zalo",
      icon: (
        <img
          src="/images/zalo.png"
          alt="Zalo"
          style={{ width: 28, height: 28 }}
        />
      ),
      text: "Chat Zalo",
      color: "#0068ff",
      link: "https://zalo.me/3664994468292144267", // thay bằng ID zalo thật
    },
    {
      id: "fb",
      icon: (
        <img
          src="/images/fb.png"
          alt="Facebook"
          style={{ width: 28, height: 28 }}
        />
      ),
      text: "Facebook Page",
      color: "#1877f2",
      link: "https://www.facebook.com/profile.php?id=61580996324879", // thay bằng page thật
    },
  ];

  return (
    <section className="section-content" id="contact">
      <h2 className="section-title text-center">Liên Hệ</h2>

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          padding: "2rem 1rem",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,.06)",
          display: "grid",
          gap: "1rem",
        }}
      >
        {contacts.map((c, i) => (
          <motion.a
            key={c.id}
            href={c.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{
              textDecoration: "none",
              color: "#333",
              padding: "1rem",
              borderRadius: 12,
              background: "#fafafa",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              border: `1px solid ${c.color}`,
              transition: "all .3s ease",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: c.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              {c.icon}
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 500 }}>{c.text}</span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
