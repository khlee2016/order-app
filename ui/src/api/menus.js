import { apiFetch } from './client'

export function fetchMenus() {
  return apiFetch('/menus')
}

export function fetchAdminMenus() {
  return apiFetch('/menus/admin')
}

export function updateMenuStock(menuId, delta) {
  return apiFetch(`/menus/${menuId}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ delta }),
  })
}
