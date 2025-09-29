import { blogPosts } from "../data/blogPosts";
import { motion } from "framer-motion";

export default function HomeBlogPreview() {
  const posts = blogPosts.slice(0, 3);

  return (
    <section className="section-content" id="home-blog">
      <h2 className="section-title" style={{ textAlign: "center" }}>
        Câu chuyện mới nhất
      </h2>
      <div
        className="products-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
        }}
      >
        {posts.map((p, i) => (
          <motion.article
            key={p.id}
            className="product-card blog-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{
              y: -8,
              boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
            }}
            style={{
              cursor: "pointer",
              borderRadius: "14px",
              padding: "1rem",
              background: "linear-gradient(180deg,#fff,#fdfdf5)",
              transition: "all .3s ease",
            }}
          >
            <div
              className="product-image"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                height: "180px",
                marginBottom: "0.75rem",
                position: "relative",
              }}
            >
              {p.cover && (
                <motion.img
                  src={p.cover}
                  alt={p.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,.25), transparent)",
                  opacity: 0,
                  transition: "opacity .3s ease",
                }}
                className="image-overlay"
              />
            </div>
            <h3
              className="product-name"
              style={{
                minHeight: 48,
                marginBottom: "0.5rem",
                color: "#2e7d32", // xanh lá nhẹ
                fontSize: "1.15rem",
                fontWeight: 600,
              }}
            >
              {p.title}
            </h3>
            <p
              style={{
                color: "#555",
                fontSize: "0.95rem",
                lineHeight: 1.6,
              }}
            >
              {p.excerpt}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
