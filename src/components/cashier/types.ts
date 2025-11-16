import type { MenuItem } from '../menu/MenuCard'

export type MenuEntry = MenuItem & { category: string }

export interface CartItem extends MenuItem {
  quantity: number
}
