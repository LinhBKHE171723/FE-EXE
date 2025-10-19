const Product = require("../models/product.model");

exports.getAll = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.create = async (req, res) => {
  try {
    const body = req.body;

    // ✅ Nếu không gửi weights → tự động gán mặc định
    const product = new Product({
      ...body,
      weights: body.weights?.length ? body.weights : [2, 5, 10],
    });

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tạo sản phẩm" });
  }
};

exports.update = async (req, res) => {
  try {
    const body = req.body;

    // ✅ Nếu gửi weights mới → chấp nhận cập nhật
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...body },
      { new: true, runValidators: true }
    );

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm" });
  }
};

exports.delete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};
