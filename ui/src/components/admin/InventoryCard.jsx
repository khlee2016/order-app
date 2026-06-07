import { getStockStatus } from '../../utils/inventory'
import './InventoryCard.css'

function InventoryCard({ product, stock, onUpdateStock }) {
  const status = getStockStatus(stock)

  return (
    <article className="inventory-card">
      <h3 className="inventory-name">{product.name}</h3>
      <p className="inventory-stock">{stock}개</p>
      <span className={`inventory-status status-${status.type}`}>
        {status.label}
      </span>
      <div className="inventory-controls">
        <button
          type="button"
          className="inventory-btn"
          disabled={stock === 0}
          aria-label="재고 감소"
          onClick={() => onUpdateStock(product.id, -1)}
        >
          −
        </button>
        <button
          type="button"
          className="inventory-btn"
          aria-label="재고 증가"
          onClick={() => onUpdateStock(product.id, 1)}
        >
          +
        </button>
      </div>
    </article>
  )
}

export default InventoryCard
