const Order = require("../models/order.model");

// 🧾 Tạo đơn hàng
exports.createOrder = async (req, res) => {
  try {
    console.log("📦 Dữ liệu nhận từ frontend:", req.body);

    // Đảm bảo mỗi sản phẩm có weight
    const formattedProducts = req.body.products.map((p) => ({
      productId: p.productId,
      quantity: p.quantity,
      price: p.price,
      weight: p.weight, // ✅ thêm trường weight
    }));

    const order = new Order({
      ...req.body,
      products: formattedProducts,
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.error("❌ Lỗi khi lưu đơn hàng:", err);
    res.status(500).json({ message: err.message });
  }
};

// 👤 Lấy đơn hàng theo user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("products.productId")
      .populate("userId", "username email");

    // ✅ Format lại để có weight
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      name: order.name,
      phone: order.phone,
      address: order.address,
      paymentMethod: order.paymentMethod,
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      products: order.products.map((p) => ({
        id: p.productId?._id,
        name: p.productId?.name,
        price: p.price,
        quantity: p.quantity,
        weight: p.weight, // ✅ thêm vào đây
        image: p.productId?.image,
        category: p.productId?.category,
      })),
    }));

    res.json(formattedOrders);
  } catch (err) {
    console.error("❌ Lỗi khi lấy đơn hàng user:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🧑‍💼 Lấy tất cả đơn hàng (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email")
      .populate("products.productId", "name price image category")
      .sort({ createdAt: -1 });

    // ✅ Format lại có weight
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      user: {
        id: order.userId?._id,
        name: order.userId?.username,
        email: order.userId?.email,
      },
      name: order.name,
      phone: order.phone,
      address: order.address,
      paymentMethod: order.paymentMethod,
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      products: order.products.map((p) => ({
        id: p.productId?._id,
        name: p.productId?.name,
        price: p.price,
        quantity: p.quantity,
        weight: p.weight, // ✅ thêm ở đây
        image: p.productId?.image,
        category: p.productId?.category,
      })),
    }));

    res.json(formattedOrders);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách đơn hàng:", err);
    res.status(500).json({ message: err.message });
  }
};

// controllers/order.controller.js
const ALLOWED_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["completed"], // chỉ tiến tới completed
  completed: [],
  cancelled: [],
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const next = req.body.status;

    if (!Object.keys(ALLOWED_TRANSITIONS).includes(next)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    const order = await Order.findById(id)
      .populate("userId", "username email")
      .populate("products.productId", "name price image category");
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });

    const current = order.status;
    if (!ALLOWED_TRANSITIONS[current].includes(next)) {
      return res.status(400).json({
        message: `Không thể chuyển từ '${current}' → '${next}'. Cho phép: ${
          ALLOWED_TRANSITIONS[current].join(", ") || "—"
        }.`,
      });
    }

    order.status = next;
    await order.save();

    res.json({
      _id: order._id,
      user: {
        id: order.userId?._id,
        name: order.userId?.username,
        email: order.userId?.email,
      },
      name: order.name,
      phone: order.phone,
      address: order.address,
      paymentMethod: order.paymentMethod,
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      products: order.products.map((p) => ({
        id: p.productId?._id,
        name: p.productId?.name,
        price: p.price,
        quantity: p.quantity,
        weight: p.weight,
        image: p.productId?.image,
        category: p.productId?.category,
      })),
    });
  } catch (err) {
    console.error("updateStatus error:", err);
    res.status(500).json({ message: err.message });
  }
};

// controllers/order.controller.js
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Chỉ cho sửa nếu chưa shipped/completed/cancelled
    const order = await Order.findById(id)
      .populate("userId", "username email")
      .populate("products.productId", "name price image category");

    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });

    if (["shipped", "completed", "cancelled"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: "Không thể sửa đơn ở trạng thái hiện tại." });
    }

    // Whitelist các field cho phép sửa
    const { name, phone, address, paymentMethod } = req.body;
    if (name !== undefined) order.name = name;
    if (phone !== undefined) order.phone = phone;
    if (address !== undefined) order.address = address;
    if (paymentMethod !== undefined) {
      if (!["cod", "bank"].includes(paymentMethod)) {
        return res
          .status(400)
          .json({ message: "Phương thức thanh toán không hợp lệ." });
      }
      order.paymentMethod = paymentMethod;
    }

    await order.save();

    const formatted = {
      _id: order._id,
      user: {
        id: order.userId?._id,
        name: order.userId?.username,
        email: order.userId?.email,
      },
      name: order.name,
      phone: order.phone,
      address: order.address,
      paymentMethod: order.paymentMethod,
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      products: order.products.map((p) => ({
        id: p.productId?._id,
        name: p.productId?.name,
        price: p.price,
        quantity: p.quantity,
        weight: p.weight,
        image: p.productId?.image,
        category: p.productId?.category,
      })),
    };

    res.json(formatted);
  } catch (err) {
    console.error("updateOrder error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.json({ message: "Đã xóa đơn hàng thành công." });
  } catch (err) {
    console.error("deleteOrder error:", err);
    res.status(500).json({ message: err.message });
  }
};
