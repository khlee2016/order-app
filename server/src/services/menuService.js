import { pool } from '../db/pool.js'

export async function getMenusForOrder() {
  const menusResult = await pool.query(
    'SELECT id, name, description, price, image_url FROM menus ORDER BY name',
  )

  const optionsResult = await pool.query(
    'SELECT id, menu_id, name, price FROM options ORDER BY menu_id, name',
  )

  const optionsByMenu = optionsResult.rows.reduce((acc, row) => {
    if (!acc[row.menu_id]) acc[row.menu_id] = []
    acc[row.menu_id].push({
      id: row.id,
      name: row.name,
      price: row.price,
    })
    return acc
  }, {})

  return menusResult.rows.map((menu) => ({
    id: menu.id,
    name: menu.name,
    description: menu.description,
    price: menu.price,
    imageUrl: menu.image_url,
    options: optionsByMenu[menu.id] || [],
  }))
}

export async function getMenusForAdmin() {
  const result = await pool.query(
    'SELECT id, name, stock FROM menus ORDER BY name',
  )

  return result.rows.map((menu) => ({
    id: menu.id,
    name: menu.name,
    stock: menu.stock,
  }))
}

export async function updateMenuStock(menuId, delta) {
  const result = await pool.query(
    `UPDATE menus
     SET stock = GREATEST(0, stock + $2)
     WHERE id = $1
     RETURNING id, stock`,
    [menuId, delta],
  )

  if (result.rowCount === 0) {
    return null
  }

  return result.rows[0]
}
