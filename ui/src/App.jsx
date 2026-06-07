import { useState } from 'react'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import { addToCart, updateCartItemQuantity } from './utils/cart'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)

  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  function handleAddToCart(product, selectedOptionIds) {
    setCart((prev) => addToCart(prev, product, selectedOptionIds))
  }

  function handleUpdateQuantity(key, delta) {
    setCart((prev) => updateCartItemQuantity(prev, key, delta))
  }

  function handleOrder() {
    if (cart.length === 0) return
    showToast('주문이 완료되었습니다!')
    setCart([])
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main">
        {currentPage === 'order' ? (
          <OrderPage
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onOrder={handleOrder}
          />
        ) : (
          <div className="admin-placeholder">
            <p>관리자 화면은 준비 중입니다.</p>
          </div>
        )}
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
