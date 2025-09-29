import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { UiProvider } from './context/UiContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

createRoot(document.getElementById('root')).render(
  <UiProvider>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </UiProvider>
)