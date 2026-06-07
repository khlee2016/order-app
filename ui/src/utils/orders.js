import { formatCartItemLabel } from './cart'

export const ORDER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  COMPLETED: 'completed',
}

export const STATUS_BUTTON_LABEL = {
  [ORDER_STATUS.PENDING]: '제조 시작',
  [ORDER_STATUS.PREPARING]: '제조 완료',
  [ORDER_STATUS.COMPLETED]: '완료',
}

export const NEXT_STATUS = {
  [ORDER_STATUS.PENDING]: ORDER_STATUS.PREPARING,
  [ORDER_STATUS.PREPARING]: ORDER_STATUS.COMPLETED,
}

export function getDashboardStats(orders) {
  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === ORDER_STATUS.PENDING).length,
    preparing: orders.filter((o) => o.status === ORDER_STATUS.PREPARING).length,
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
  const orderRank = {
    [ORDER_STATUS.PENDING]: 0,
    [ORDER_STATUS.PREPARING]: 1,
    [ORDER_STATUS.COMPLETED]: 2,
  }

  return [...orders].sort((a, b) => {
    const rankDiff = orderRank[a.status] - orderRank[b.status]
    if (rankDiff !== 0) return rankDiff
    return new Date(b.orderedAt) - new Date(a.orderedAt)
  })
}
