import { Router } from 'express'
import {
  createOrder,
  getAllOrders,
  getNextStatus,
  getOrderById,
  updateOrderStatus,
} from '../services/orderService.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const orders = await getAllOrders()
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:orderId', async (req, res) => {
  try {
    const order = await getOrderById(req.params.orderId)

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  const items = req.body?.items

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required' })
  }

  for (const item of items) {
    if (!item.menuId || !item.quantity || item.quantity < 1) {
      return res.status(400).json({ error: 'Invalid order item' })
    }
  }

  try {
    const order = await createOrder(items)
    res.status(201).json(order)
  } catch (err) {
    const status = err.message.includes('stock') ? 400 : 500
    res.status(status).json({ error: err.message })
  }
})

router.patch('/:orderId/status', async (req, res) => {
  const { status } = req.body

  if (!status) {
    return res.status(400).json({ error: 'status is required' })
  }

  try {
    const order = await updateOrderStatus(req.params.orderId, status)

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/:orderId/next-status', async (req, res) => {
  try {
    const order = await getOrderById(req.params.orderId)

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json({ nextStatus: getNextStatus(order.status) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
