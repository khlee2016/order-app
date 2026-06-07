import { OPTIONS } from '../data/menu'

export function getCartKey(productId, selectedOptionIds) {
  const sorted = [...selectedOptionIds].sort()
  return `${productId}:${sorted.join(',')}`
}

export function calcUnitPrice(basePrice, selectedOptionIds) {
  const extra = selectedOptionIds.reduce((sum, id) => {
    const option = OPTIONS.find((o) => o.id === id)
    return sum + (option?.extraPrice ?? 0)
  }, 0)
  return basePrice + extra
}

export function getOptionLabels(selectedOptionIds) {
  return selectedOptionIds
    .map((id) => OPTIONS.find((o) => o.id === id)?.name)
    .filter(Boolean)
}

export function formatCartItemLabel(productName, optionLabels) {
  const optionPart =
    optionLabels.length > 0 ? ` (${optionLabels.join(', ')})` : ''
  return `${productName}${optionPart}`
}

export function formatCartItemName(productName, optionLabels, quantity) {
  return `${formatCartItemLabel(productName, optionLabels)} X ${quantity}`
}

export function updateCartItemQuantity(cart, key, delta) {
  return cart
    .map((item) => {
      if (item.key !== key) return item

      const quantity = item.quantity + delta
      if (quantity <= 0) return null

      return {
        ...item,
        quantity,
        lineTotal: item.unitPrice * quantity,
      }
    })
    .filter(Boolean)
}

export function addToCart(cart, product, selectedOptionIds) {
  const key = getCartKey(product.id, selectedOptionIds)
  const unitPrice = calcUnitPrice(product.price, selectedOptionIds)
  const optionLabels = getOptionLabels(selectedOptionIds)

  const existing = cart.find((item) => item.key === key)
  if (existing) {
    return cart.map((item) =>
      item.key === key
        ? {
            ...item,
            quantity: item.quantity + 1,
            lineTotal: unitPrice * (item.quantity + 1),
          }
        : item,
    )
  }

  return [
    ...cart,
    {
      key,
      productId: product.id,
      productName: product.name,
      selectedOptionIds,
      selectedOptionLabels: optionLabels,
      unitPrice,
      quantity: 1,
      lineTotal: unitPrice,
    },
  ]
}

export function getCartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.lineTotal, 0)
}
