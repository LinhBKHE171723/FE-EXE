const Order = require("../models/order.model");

exports.createOrder = async (req, res) => {
  try {
    console.log("📦 Dữ liệu nhận từ frontend:", req.body);
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (err) {
    console.error("❌ Lỗi khi lưu đơn hàng:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("products.productId")
      .populate("userId", "username email");
    res.json(orders);
  } catch (err) {
    console.error("❌ Lỗi khi lấy đơn hàng user:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Lấy tất cả đơn hàng (dành cho admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email") // lấy thông tin user
      .populate("products.productId", "name price image category") // lấy chi tiết product
      .sort({ createdAt: -1 }); // sắp xếp mới nhất trước

    // ✅ Format dữ liệu để frontend dễ hiển thị
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
