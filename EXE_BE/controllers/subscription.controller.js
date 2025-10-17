const Subscription = require("../models/subscription.model");
const nodemailer = require("nodemailer");

exports.createSubscription = async (req, res) => {
  try {
    const form = req.body;
    console.log("📩 Dữ liệu đăng ký:", form);

    // 1️⃣ Lưu vào MongoDB
    const newSub = await Subscription.create(form);

    // 2️⃣ Tạo transporter gửi email (SMTP Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // 🔍 Kiểm tra kết nối SMTP
    transporter.verify((err, success) => {
      if (err) console.error("❌ SMTP Error:", err);
      else console.log("✅ Ready to send mail!");
    });

    // 3️⃣ Soạn nội dung mail
    const mailOptions = {
      from: `"SupperRice 🌾" <${process.env.MAIL_USER}>`,
      to: form.email, // ✅ gửi đến email của người dùng đã đăng nhập
      subject: "Xác nhận đăng ký giao gạo định kỳ SupperRice",
      html: `
    <h2>Xin chào ${form.name},</h2>
    <p>Cảm ơn bạn đã đăng ký giao gạo định kỳ tại <b>SupperRice</b> 🌾</p>
    <p><b>Chi tiết đăng ký của bạn:</b></p>
    <ul>
      <li>📦 Loại gạo: ${form.rice}</li>
      <li>⚖️ Khối lượng: ${form.weight}</li>
      <li>🔁 Tần suất: ${form.frequency}</li>
      <li>📅 Ngày bắt đầu: ${form.startDate}</li>
      <li>🏠 Địa chỉ giao: ${form.address}</li>
      <li>📞 Số điện thoại: ${form.phone}</li>
      <li>📧 Email: ${form.email}</li>
    </ul>
    <p>Chúng tôi sẽ liên hệ xác nhận sớm nhất!</p>
    <p>Trân trọng,<br/>Đội ngũ <b>SupperRice</b></p>
  `,
    };

    // 4️⃣ Gửi mail xác nhận
    await transporter.sendMail(mailOptions);

    // 5️⃣ Phản hồi client
    res.json({
      success: true,
      message: "Đã lưu đăng ký và gửi email xác nhận!",
      data: newSub,
    });
  } catch (err) {
    console.error("❌ Lỗi khi tạo subscription:", err);
    res.status(500).json({
      message: "Không thể xử lý đăng ký",
      error: err.message,
    });
  }
};
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find().sort({ createdAt: -1 });
    const formatted = subs.map((s) => ({
      id: s._id,
      name: s.name,
      phone: s.phone,
      address: s.address,
      rice: s.rice,
      weight: s.weight,
      frequency: s.frequency,
      startDate: s.startDate,
      note: s.note,
      createdAt: s.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách subscription:", err);
    res.status(500).json({
      message: "Không thể lấy danh sách đăng ký",
      error: err.message,
    });
  }
};
