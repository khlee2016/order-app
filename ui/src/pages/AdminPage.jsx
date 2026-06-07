import AdminDashboard from '../components/admin/AdminDashboard'
import InventorySection from '../components/admin/InventorySection'
import OrderList from '../components/admin/OrderList'
import { getDashboardStats } from '../utils/orders'
import './AdminPage.css'

function AdminPage({
  orders,
  adminMenus,
  loading,
  onUpdateStock,
  onUpdateStatus,
}) {
  const stats = getDashboardStats(orders)

  if (loading) {
    return <p className="page-loading">관리자 데이터를 불러오는 중...</p>
  }

  return (
    <div className="admin-page">
      <AdminDashboard stats={stats} />
      <InventorySection menus={adminMenus} onUpdateStock={onUpdateStock} />
      <OrderList orders={orders} onUpdateStatus={onUpdateStatus} />
    </div>
  )
}

export default AdminPage
