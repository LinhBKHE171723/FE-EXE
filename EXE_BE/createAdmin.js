require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user.model");

(async () => {
  try {
    // 🔗 Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Kết nối MongoDB thành công");

    // 🔍 Kiểm tra xem admin đã tồn tại chưa
    const exist = await User.findOne({ role: "admin" });
    if (exist) {
      console.log("⚠️ Admin đã tồn tại!");
      console.log("Email:", exist.email);
      process.exit(0);
    }

    // 🧑‍💻 Tạo mới admin (password sẽ tự động hash)
    const admin = new User({
      username: "Admin SuperRice",
      email: "admin@superrice.com",
      password: "123456", // Plain text, sẽ hash tự động
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin tạo thành công!");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password: Admin@123456");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi khi tạo admin:", err);
    process.exit(1);
  }
})();