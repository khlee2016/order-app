import { formatPrice } from '../utils/format'
import { formatCartItemLabel, getCartTotal } from '../utils/cart'
import './Cart.css'

function Cart({ items, onUpdateQuantity, onOrder }) {
  const total = getCartTotal(items)
  const isEmpty = items.length === 0

  return (
    <section className="cart">
      <h2 className="cart-title">장바구니</h2>
      <div className="cart-body">
        <ul className="cart-list">
          {isEmpty ? (
            <li className="cart-empty">담은 상품이 없습니다.</li>
          ) : (
            items.map((item) => (
              <li key={item.key} className="cart-item">
                <span className="cart-item-name">
                  {formatCartItemLabel(item.productName, item.selectedOptionLabels)}
                </span>
                <div className="cart-item-controls">
                  <div className="quantity-control">
                    <button
                      type="button"
                      className="quantity-btn"
                      aria-label="수량 감소"
                      onClick={() => onUpdateQuantity(item.key, -1)}
                    >
                      −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      type="button"
                      className="quantity-btn"
                      aria-label="수량 증가"
                      onClick={() => onUpdateQuantity(item.key, 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-item-price">{formatPrice(item.lineTotal)}</span>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="cart-footer">
          <p className="cart-total">
            총 금액 <strong>{formatPrice(total)}</strong>
          </p>
          <button
            type="button"
            className="btn btn-primary order-btn"
            disabled={isEmpty}
            onClick={onOrder}
          >
            주문하기
          </button>
        </div>
      </div>
    </section>
  )
}

export default Cart
