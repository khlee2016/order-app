import { apiFetch } from './client'

export function fetchOrders() {
  return apiFetch('/orders')
}

export function fetchOrder(orderId) {
  return apiFetch(`/orders/${orderId}`)
}

export function createOrder(items) {
  return apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify({ items }),
  })
}

export function updateOrderStatus(orderId, status) {
  return apiFetch(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}
