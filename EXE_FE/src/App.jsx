import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./pages/Products";
import Blog from "./pages/Blog";
import Policy from "./pages/Policy";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Notification from "./components/Notification";
import ChatBubble from "./components/ChatBubble";
import { useUi } from "./context/UiContext";
import AuthModal from "./modals/AuthModal";
import HomeBlogPreview from "./components/HomeBlogPreview";
import HomePolicySnippet from "./components/HomePolicySnippet";
import SubscribeForm from "./components/SubscribeForm";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderQR from "./pages/OrderQR";
import MyOrders from "./pages/MyOrders";

export default function App() {
  const { currentSection, setCurrentSection, showAuth, setShowAuth } = useUi();
  const [orderStatus, setOrderStatus] = useState(null); // "success" | "qr" | null

  const showProducts =
    currentSection === "home" || currentSection === "products";

  return (
    <>
      {/* ✅ Header nhận callback điều hướng */}
      <Header
        onNavigate={(section) => {
          setCurrentSection(section);
          setOrderStatus(null); // reset trạng thái khi đổi tab
        }}
      />
      {/* ✅ Hero chỉ hiện ở trang Home */}
      {currentSection === "home" && <Hero />}
      <main className="main-content">
        {/* ✅ Ưu tiên hiển thị các màn liên quan đến đơn hàng */}
        {orderStatus === "success" && <OrderSuccess />}
        {orderStatus === "qr" && (
          <OrderQR onPaid={() => setOrderStatus("success")} />
        )}

        {orderStatus === null && (
          <>
            {/* ✅ Trang sản phẩm + phần giới thiệu ở Home */}
            {showProducts && (
              <>
                <Products />
                {currentSection === "home" && (
                  <>
                    <HomeBlogPreview />
                    <HomePolicySnippet />
                    <SubscribeForm />
                  </>
                )}
              </>
            )}

            {/* ✅ Các trang khác */}
            {currentSection === "blog" && <Blog />}
            {currentSection === "policy" && <Policy />}
            {currentSection === "contact" && <Contact />}

            {/* ✅ Giỏ hàng */}
            {currentSection === "cart" && (
              <Cart onCheckout={() => setCurrentSection("checkout")} />
            )}

            {/* ✅ Thanh toán */}
            {currentSection === "checkout" && (
              <Checkout
                onComplete={(payment) =>
                  setOrderStatus(payment === "cod" ? "success" : "qr")
                }
              />
            )}

            {/* ✅ Đơn hàng của tôi */}
            {currentSection === "orders" && <MyOrders />}
          </>
        )}
      </main>
      {/* ✅ Footer + các thành phần dùng chung */}
      <Footer />
      <Notification />
      <ChatBubble />
      {/* ✅ Modal đăng nhập/đăng ký */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
