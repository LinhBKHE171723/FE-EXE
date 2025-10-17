import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import { UiProvider } from "./context/UiContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="339456860203-qhb3pfbfefj1jqgmk5sugchdq9nstb86.apps.googleusercontent.com">
    <UiProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </UiProvider>
  </GoogleOAuthProvider>
);
