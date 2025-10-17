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
