import './AdminDashboard.css'

function AdminDashboard({ stats }) {
  const items = [
    { label: '총 주문', value: stats.total },
    { label: '주문 접수', value: stats.pending },
    { label: '제조 중', value: stats.preparing },
    { label: '제조 완료', value: stats.completed },
  ]

  return (
    <section className="admin-section">
      <h2 className="admin-section-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        {items.map((item, index) => (
          <span key={item.label} className="dashboard-stat">
            {index > 0 && <span className="dashboard-divider">/</span>}
            {item.label} <strong>{item.value}</strong>
          </span>
        ))}
      </div>
    </section>
  )
}

export default AdminDashboard
