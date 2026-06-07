import { PRODUCTS } from '../data/menu'

export const INITIAL_STOCK = 10

export function createInitialInventory() {
  return PRODUCTS.reduce((acc, product) => {
    acc[product.id] = INITIAL_STOCK
    return acc
  }, {})
}

export function getStockStatus(stock) {
  if (stock === 0) return { label: '품절', type: 'soldout' }
  if (stock < 5) return { label: '주의', type: 'warning' }
  return { label: '정상', type: 'normal' }
}

export function updateInventoryStock(inventory, productId, delta) {
  const current = inventory[productId] ?? 0
  const next = Math.max(0, current + delta)
  return { ...inventory, [productId]: next }
}
