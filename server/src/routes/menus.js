import { Router } from 'express'
import {
  getMenusForAdmin,
  getMenusForOrder,
  updateMenuStock,
} from '../services/menuService.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const menus = await getMenusForOrder()
    res.json({ menus })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/admin', async (_req, res) => {
  try {
    const menus = await getMenusForAdmin()
    res.json({ menus })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/:menuId/stock', async (req, res) => {
  const delta = Number(req.body?.delta)

  if (!Number.isInteger(delta)) {
    return res.status(400).json({ error: 'delta must be an integer' })
  }

  try {
    const menu = await updateMenuStock(req.params.menuId, delta)

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' })
    }

    res.json({ id: menu.id, stock: menu.stock })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
