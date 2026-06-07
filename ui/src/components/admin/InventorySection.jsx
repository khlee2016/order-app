import InventoryCard from './InventoryCard'
import './InventorySection.css'

function InventorySection({ menus, onUpdateStock }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section-title">재고 현황</h2>
      <div className="inventory-list">
        {menus.map((menu) => (
          <InventoryCard
            key={menu.id}
            product={menu}
            stock={menu.stock}
            onUpdateStock={onUpdateStock}
          />
        ))}
      </div>
    </section>
  )
}

export default InventorySection
