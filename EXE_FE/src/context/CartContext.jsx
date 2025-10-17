import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem("gaosach:cart");
    return raw ? JSON.parse(raw) : [];
  });

  // 🔄 Lưu lại giỏ hàng khi thay đổi
  useEffect(() => {
    localStorage.setItem("gaosach:cart", JSON.stringify(items));
  }, [items]);

  // 🛒 Thêm sản phẩm mới
  const add = (product) =>
    setItems((prev) => {
      const existingProduct = prev.find((item) => item._id === product._id);
      if (existingProduct) {
        // Nếu đã có sản phẩm → giữ nguyên weight, chỉ tăng quantity
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Nếu chưa có → mặc định weight = 2kg
      return [...prev, { ...product, quantity: 1, weight: 2 }];
    });

  // 🧮 Cập nhật số lượng hoặc khối lượng
  const updateItem = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === updatedItem._id ? { ...item, ...updatedItem } : item
      )
    );
  };

  const updateItemQuantity = (productToUpdate, newQuantity) => {
    if (newQuantity > 0) {
      setItems((prev) =>
        prev.map((item) =>
          item._id === productToUpdate._id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  // ❌ Xóa sản phẩm
  const removeItem = (productToRemove) => {
    setItems((prev) => prev.filter((item) => item._id !== productToRemove._id));
  };

  // 🧹 Xóa toàn bộ giỏ hàng
  const clear = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        clear,
        updateItem,
        updateItemQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
