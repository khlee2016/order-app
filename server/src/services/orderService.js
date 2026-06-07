import { pool } from '../db/pool.js'

const STATUS_TRANSITIONS = {
  pending: 'preparing',
  preparing: 'completed',
}

function mapOrderItem(row, options) {
  return {
    key: `${row.id}`,
    productId: row.menu_id,
    productName: row.menu_name,
    selectedOptionIds: options.map((o) => o.option_id),
    selectedOptionLabels: options.map((o) => o.option_name),
    unitPrice: row.unit_price,
    quantity: row.quantity,
    lineTotal: row.line_total,
  }
}

async function fetchOrderById(orderId, client = pool) {
  const orderResult = await client.query(
    'SELECT id, ordered_at, status, total_amount FROM orders WHERE id = $1',
    [orderId],
  )

  if (orderResult.rowCount === 0) return null

  const order = orderResult.rows[0]
  const itemsResult = await client.query(
    `SELECT id, menu_id, menu_name, quantity, unit_price, line_total
     FROM order_items WHERE order_id = $1 ORDER BY id`,
    [orderId],
  )

  const items = []
  for (const item of itemsResult.rows) {
    const optionsResult = await client.query(
      `SELECT option_id, option_name
       FROM order_item_options WHERE order_item_id = $1`,
      [item.id],
    )
    items.push(mapOrderItem(item, optionsResult.rows))
  }

  return {
    id: order.id,
    orderedAt: order.ordered_at.toISOString(),
    status: order.status,
    totalAmount: order.total_amount,
    items,
  }
}

export async function getAllOrders() {
  const result = await pool.query(
    'SELECT id FROM orders ORDER BY ordered_at DESC',
  )

  const orders = []
  for (const row of result.rows) {
    const order = await fetchOrderById(row.id)
    if (order) orders.push(order)
  }
  return orders
}

export async function getOrderById(orderId) {
  return fetchOrderById(orderId)
}

export async function createOrder(items) {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    let totalAmount = 0
    const resolvedItems = []

    for (const item of items) {
      const menuResult = await client.query(
        'SELECT id, name, price, stock FROM menus WHERE id = $1 FOR UPDATE',
        [item.menuId],
      )

      if (menuResult.rowCount === 0) {
        throw new Error(`Menu not found: ${item.menuId}`)
      }

      const menu = menuResult.rows[0]

      if (menu.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${menu.name}`)
      }

      let optionExtra = 0
      const selectedOptions = []

      for (const optionId of item.selectedOptionIds || []) {
        const optionResult = await client.query(
          'SELECT id, name, price FROM options WHERE id = $1 AND menu_id = $2',
          [optionId, item.menuId],
        )

        if (optionResult.rowCount === 0) {
          throw new Error(`Option not found: ${optionId}`)
        }

        const option = optionResult.rows[0]
        optionExtra += option.price
        selectedOptions.push(option)
      }

      const unitPrice = menu.price + optionExtra
      const lineTotal = unitPrice * item.quantity
      totalAmount += lineTotal

      resolvedItems.push({
        menu,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
        selectedOptions,
      })
    }

    const orderResult = await client.query(
      `INSERT INTO orders (status, total_amount)
       VALUES ('pending', $1)
       RETURNING id, ordered_at, status, total_amount`,
      [totalAmount],
    )

    const order = orderResult.rows[0]

    for (const resolved of resolvedItems) {
      await client.query(
        'UPDATE menus SET stock = stock - $1 WHERE id = $2',
        [resolved.quantity, resolved.menu.id],
      )

      const itemResult = await client.query(
        `INSERT INTO order_items
         (order_id, menu_id, menu_name, quantity, unit_price, line_total)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          order.id,
          resolved.menu.id,
          resolved.menu.name,
          resolved.quantity,
          resolved.unitPrice,
          resolved.lineTotal,
        ],
      )

      const orderItemId = itemResult.rows[0].id

      for (const option of resolved.selectedOptions) {
        await client.query(
          `INSERT INTO order_item_options (order_item_id, option_id, option_name)
           VALUES ($1, $2, $3)`,
          [orderItemId, option.id, option.name],
        )
      }
    }

    await client.query('COMMIT')
    return fetchOrderById(order.id)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export async function updateOrderStatus(orderId, nextStatus) {
  const current = await pool.query(
    'SELECT id, status FROM orders WHERE id = $1',
    [orderId],
  )

  if (current.rowCount === 0) return null

  const currentStatus = current.rows[0].status
  const allowedNext = STATUS_TRANSITIONS[currentStatus]

  if (allowedNext !== nextStatus) {
    throw new Error(`Invalid status transition: ${currentStatus} -> ${nextStatus}`)
  }

  await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [
    nextStatus,
    orderId,
  ])

  return fetchOrderById(orderId)
}

export function getNextStatus(currentStatus) {
  return STATUS_TRANSITIONS[currentStatus] || null
}
