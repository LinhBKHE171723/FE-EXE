import { useState } from "react";
import { blogPosts } from "../data/blogPosts";
import { motion, AnimatePresence } from "framer-motion";

export default function Blog() {
  const [openId, setOpenId] = useState(null);
  const open = (id) => setOpenId(id);
  const close = () => setOpenId(null);
  const post = blogPosts.find((p) => p.id === openId);

  return (
    <section className="section-content" id="blog">
      <h2 className="section-title text-center mb-6 text-green-700">
        Blog &amp; Câu chuyện về gạo
      </h2>

      <div
        className="products-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: "1.5rem",
        }}
      >
        {blogPosts.map((p) => (
          <motion.article
            key={p.id}
            className="product-card"
            style={{
              cursor: "pointer",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              background: "#fff",
              transition: "all .3s ease",
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => open(p.id)}
          >
            <div className="product-image" style={{ height: 180 }}>
              {p.cover && (
                <img
                  src={p.cover}
                  alt={p.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform .3s ease",
                  }}
                  className="hover:scale-105"
                />
              )}
            </div>
            <div style={{ padding: "1rem" }}>
              <h3
                className="product-name"
                style={{
                  marginBottom: ".5rem",
                  color: "#388e3c",
                }}
              >
                {p.title}
              </h3>
              <p style={{ color: "#666", margin: ".25rem 0 .5rem" }}>
                {p.excerpt}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: ".9rem",
                  color: "#999",
                }}
              >
                <span>{p.author}</span>
                <span>{p.date}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {post && (
          <motion.div
            className="modal-overlay active"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: "rgba(0,0,0,0.6)",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              zIndex: 1000,
            }}
          >
            <motion.div
              className="modal-content"
              style={{
                maxWidth: 780,
                background: "#fff",
                borderRadius: 16,
                padding: "2rem",
                position: "relative",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={close}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 16,
                  fontSize: "1.5rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                &times;
              </button>
              <h2 style={{ marginBottom: "1rem", color: "#f9a825" }}>
                {post.title}
              </h2>
              {post.cover && (
                <img
                  src={post.cover}
                  alt=""
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    marginBottom: "1rem",
                  }}
                />
              )}
              <div
                style={{
                  whiteSpace: "pre-line",
                  lineHeight: 1.7,
                  color: "#333",
                }}
              >
                {post.content}
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  fontSize: ".9rem",
                  color: "#999",
                }}
              >
                Viết bởi <strong>{post.author}</strong> • {post.date}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
