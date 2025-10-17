require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user.model");

(async () => {
  try {
    // 🔗 Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Kết nối MongoDB thành công");

    // 🔍 Kiểm tra xem admin đã tồn tại chưa
    const exist = await User.findOne({ email: "admin@example.com" });
    if (exist) {
      console.log("⚠️ Admin đã tồn tại!");
      process.exit(0);
    }

    // 🧑‍💻 Tạo mới admin (tự hash nhờ pre('save'))
    const admin = new User({
      username: "admin",
      email: "superrice@gmail.com",
      password: "123456", // plain text, sẽ được hash tự động
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin tạo thành công:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi khi tạo admin:", err);
    process.exit(1);
  }
})();
