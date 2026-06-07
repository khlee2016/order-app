import { useEffect, useRef } from 'react'
import { formatPrice } from '../../utils/format'
import {
  formatOrderDateTime,
  formatOrderItemLine,
  getSortedOrders,
  ORDER_STATUS,
  STATUS_BUTTON_LABEL,
  NEXT_STATUS,
} from '../../utils/orders'
import './OrderList.css'

function OrderList({ orders, onUpdateStatus }) {
  const listRef = useRef(null)
  const sortedOrders = getSortedOrders(orders)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0
    }
  }, [orders.length])

  return (
    <section className="admin-section">
      <h2 className="admin-section-title">주문 현황</h2>
      {sortedOrders.length === 0 ? (
        <p className="order-empty">처리할 주문이 없습니다.</p>
      ) : (
        <ul ref={listRef} className="order-list">
          {sortedOrders.map((order) => {
            const isCompleted = order.status === ORDER_STATUS.COMPLETED
            const nextStatus = NEXT_STATUS[order.status]
            const buttonLabel =
              STATUS_BUTTON_LABEL[order.status] || '완료'

            return (
              <li
                key={order.id}
                className={`order-item ${isCompleted ? 'order-item--completed' : ''}`}
              >
                <div className="order-info">
                  <p className="order-datetime">
                    {formatOrderDateTime(order.orderedAt)}
                  </p>
                  <div className="order-items">
                    {order.items.map((item) => (
                      <p key={item.key} className="order-item-line">
                        {formatOrderItemLine(item)}
                      </p>
                    ))}
                  </div>
                  <p className="order-amount">{formatPrice(order.totalAmount)}</p>
                </div>
                <button
                  type="button"
                  className={`btn order-action-btn ${
                    isCompleted ? 'btn-completed' : 'btn-primary'
                  }`}
                  disabled={isCompleted}
                  onClick={() => nextStatus && onUpdateStatus(order.id, nextStatus)}
                >
                  {buttonLabel}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default OrderList
