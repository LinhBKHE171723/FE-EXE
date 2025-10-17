import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem("gaosach:cart");
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem("gaosach:cart", JSON.stringify(items));
  }, [items]);

  const add = (product) =>
    setItems((prev) => {
      // ✅ Dùng _id để so sánh (chuẩn MongoDB)
      const existingProduct = prev.find((item) => item._id === product._id);

      if (existingProduct) {
        // Nếu sản phẩm đã có → tăng số lượng
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Nếu chưa có → thêm mới
      return [...prev, { ...product, quantity: 1 }];
    });

  const removeItem = (productToRemove) => {
    setItems((prev) => prev.filter((item) => item._id !== productToRemove._id));
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

  const clear = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, add, clear, updateItemQuantity, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
