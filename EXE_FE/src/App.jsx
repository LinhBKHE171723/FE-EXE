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

// 👉 thêm 3 màn mới
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderQR from "./pages/OrderQR";

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

      {currentSection === "home" && <Hero />}

      <main className="main-content">
        {/* ✅ Ưu tiên hiển thị màn checkout / success / qr */}
        {orderStatus === "success" && <OrderSuccess />}
        {orderStatus === "qr" && (
          <OrderQR onPaid={() => setOrderStatus("success")} />
        )}

        {orderStatus === null && (
          <>
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
            {currentSection === "blog" && <Blog />}
            {currentSection === "policy" && <Policy />}
            {currentSection === "contact" && <Contact />}
            {currentSection === "cart" && (
              <Cart onCheckout={() => setCurrentSection("checkout")} />
            )}
            {currentSection === "checkout" && (
              <Checkout
                onComplete={(payment) =>
                  setOrderStatus(payment === "cod" ? "success" : "qr")
                }
              />
            )}
          </>
        )}
      </main>

      <Footer />
      <Notification />
      <ChatBubble />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
