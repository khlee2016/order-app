import AdminDashboard from '../components/admin/AdminDashboard'
import InventorySection from '../components/admin/InventorySection'
import OrderList from '../components/admin/OrderList'
import { getDashboardStats } from '../utils/orders'
import './AdminPage.css'

function AdminPage({ orders, inventory, onUpdateStock, onStartPreparation }) {
  const stats = getDashboardStats(orders)

  return (
    <div className="admin-page">
      <AdminDashboard stats={stats} />
      <InventorySection
        inventory={inventory}
        onUpdateStock={onUpdateStock}
      />
      <OrderList orders={orders} onStartPreparation={onStartPreparation} />
    </div>
  )
}

export default AdminPage
