import type { MenuItem } from '../menu/MenuCard'
import type { MenuEntry } from './types'
import { MenuCard } from '../menu/MenuCard'

interface MenuGridProps {
  items: MenuEntry[]
  onAddToCart: (item: MenuItem) => void
}

export function MenuGrid({ items, onAddToCart }: MenuGridProps) {
  return (
    <div
      className="grid w-full gap-4"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))',
      }}
    >
      {items.map(item => (
        <MenuCard key={item.id} item={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}
