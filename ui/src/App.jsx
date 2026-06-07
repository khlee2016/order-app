import { useState } from 'react'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import { addToCart, getCartTotal, updateCartItemQuantity } from './utils/cart'
import { createInitialInventory, updateInventoryStock } from './utils/inventory'
import { createOrder, startPreparation } from './utils/orders'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState(createInitialInventory)
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

    const totalAmount = getCartTotal(cart)
    const newOrder = createOrder(cart, totalAmount)
    setOrders((prev) => [newOrder, ...prev])
    showToast('주문이 완료되었습니다!')
    setCart([])
  }

  function handleUpdateStock(productId, delta) {
    setInventory((prev) => updateInventoryStock(prev, productId, delta))
  }

  function handleStartPreparation(orderId) {
    setOrders((prev) => startPreparation(prev, orderId))
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
          <AdminPage
            orders={orders}
            inventory={inventory}
            onUpdateStock={handleUpdateStock}
            onStartPreparation={handleStartPreparation}
          />
        )}
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
