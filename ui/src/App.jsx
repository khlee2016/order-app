import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import { fetchAdminMenus, fetchMenus, updateMenuStock } from './api/menus'
import {
  createOrder as createOrderApi,
  fetchOrders,
  updateOrderStatus,
} from './api/orders'
import { addToCart, updateCartItemQuantity } from './utils/cart'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order')
  const [cart, setCart] = useState([])
  const [menus, setMenus] = useState([])
  const [adminMenus, setAdminMenus] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingMenus, setLoadingMenus] = useState(true)
  const [loadingAdmin, setLoadingAdmin] = useState(false)
  const [toast, setToast] = useState(null)

  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }

  const loadMenus = useCallback(async () => {
    try {
      const data = await fetchMenus()
      setMenus(data.menus)
    } catch (err) {
      showToast(err.message)
    } finally {
      setLoadingMenus(false)
    }
  }, [])

  const loadAdminData = useCallback(async () => {
    setLoadingAdmin(true)
    try {
      const [menusData, ordersData] = await Promise.all([
        fetchAdminMenus(),
        fetchOrders(),
      ])
      setAdminMenus(menusData.menus)
      setOrders(ordersData.orders)
    } catch (err) {
      showToast(err.message)
    } finally {
      setLoadingAdmin(false)
    }
  }, [])

  useEffect(() => {
    loadMenus()
  }, [loadMenus])

  useEffect(() => {
    if (currentPage === 'admin') {
      loadAdminData()
    }
  }, [currentPage, loadAdminData])

  function handleAddToCart(product, selectedOptionIds) {
    setCart((prev) => addToCart(prev, product, selectedOptionIds))
  }

  function handleUpdateQuantity(key, delta) {
    setCart((prev) => updateCartItemQuantity(prev, key, delta))
  }

  async function handleOrder() {
    if (cart.length === 0) return

    try {
      const payload = cart.map((item) => ({
        menuId: item.productId,
        quantity: item.quantity,
        selectedOptionIds: item.selectedOptionIds,
      }))

      await createOrderApi(payload)
      showToast('주문이 완료되었습니다!')
      setCart([])

      if (currentPage === 'admin') {
        await loadAdminData()
      }
    } catch (err) {
      showToast(err.message)
    }
  }

  async function handleUpdateStock(menuId, delta) {
    try {
      const result = await updateMenuStock(menuId, delta)
      setAdminMenus((prev) =>
        prev.map((menu) =>
          menu.id === menuId ? { ...menu, stock: result.stock } : menu,
        ),
      )
    } catch (err) {
      showToast(err.message)
    }
  }

  async function handleUpdateStatus(orderId, status) {
    try {
      const updated = await updateOrderStatus(orderId, status)
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updated : order)),
      )
    } catch (err) {
      showToast(err.message)
    }
  }

  function handleNavigate(page) {
    setCurrentPage(page)
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main">
        {currentPage === 'order' ? (
          <OrderPage
            menus={menus}
            loading={loadingMenus}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onOrder={handleOrder}
          />
        ) : (
          <AdminPage
            orders={orders}
            adminMenus={adminMenus}
            loading={loadingAdmin}
            onUpdateStock={handleUpdateStock}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
