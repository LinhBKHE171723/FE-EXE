const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Allow CORS from configured origins
const defaultOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_ORIGIN,
  process.env.ADMIN_ORIGIN,
]
  .filter(Boolean)
  .map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow curl/postman
      if (defaultOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", require("./routes/user.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/ai", require("./routes/ai.routes"));
app.use("/api/subscriptions", require("./routes/subscription.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
