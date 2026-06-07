import { PRODUCTS } from '../../data/menu'
import InventoryCard from './InventoryCard'
import './InventorySection.css'

function InventorySection({ inventory, onUpdateStock }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section-title">재고 현황</h2>
      <div className="inventory-list">
        {PRODUCTS.map((product) => (
          <InventoryCard
            key={product.id}
            product={product}
            stock={inventory[product.id] ?? 0}
            onUpdateStock={onUpdateStock}
          />
        ))}
      </div>
    </section>
  )
}

export default InventorySection
