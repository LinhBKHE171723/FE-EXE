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
      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingProduct = prev.find((item) => item.id === product.id);
      if (existingProduct) {
        // Nếu sản phẩm đã có, tăng số lượng lên
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Nếu sản phẩm chưa có trong giỏ, thêm vào giỏ
      return [...prev, { ...product, quantity: 1 }];
    });

  const removeItem = (productToRemove) => {
    setItems((prev) => prev.filter((item) => item.id !== productToRemove.id));
  };

  const updateItemQuantity = (productToUpdate, newQuantity) => {
    // Chỉ thay đổi số lượng nếu số lượng lớn hơn 0
    if (newQuantity > 0) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === productToUpdate.id
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
