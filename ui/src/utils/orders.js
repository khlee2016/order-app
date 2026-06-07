import { formatCartItemLabel } from './cart'

export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
}

export function createOrder(cartItems, totalAmount) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    orderedAt: new Date().toISOString(),
    items: cartItems.map((item) => ({ ...item })),
    totalAmount,
    status: ORDER_STATUS.PENDING,
  }
}

export function getDashboardStats(orders) {
  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === ORDER_STATUS.PENDING).length,
    preparing: 0,
    completed: orders.filter((o) => o.status === ORDER_STATUS.COMPLETED).length,
  }
}

export function formatOrderDateTime(isoString) {
  const date = new Date(isoString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}월 ${day}일 ${hours}:${minutes}`
}

export function formatOrderItemLine(item) {
  const label = formatCartItemLabel(item.productName, item.selectedOptionLabels)
  return `${label} x ${item.quantity}`
}

export function getSortedOrders(orders) {
  return [...orders].sort((a, b) => {
    if (a.status !== b.status) {
      if (a.status === ORDER_STATUS.PENDING) return -1
      if (b.status === ORDER_STATUS.PENDING) return 1
    }
    return new Date(b.orderedAt) - new Date(a.orderedAt)
  })
}

export function startPreparation(orders, orderId) {
  return orders.map((order) =>
    order.id === orderId
      ? { ...order, status: ORDER_STATUS.COMPLETED }
      : order,
  )
}
