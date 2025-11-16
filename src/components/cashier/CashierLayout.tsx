import { Menu as MenuIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { InvoicePanel } from '../invoice/InvoicePanel'
import type { MenuItem } from '../menu/MenuCard'
import { MenuHeader } from '../menu/MenuHeader'
import { MenuGrid } from './MenuGrid'
import { MENU_CATEGORIES, MENU_ITEMS } from './menu-data'
import type { CartItem } from './types'

interface CashierLayoutProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
}

export function CashierLayout({ onToggleSidebar, isSidebarOpen }: CashierLayoutProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])

  const filteredItems = useMemo(
    () => (selectedCategory === 'All' ? MENU_ITEMS : MENU_ITEMS.filter(item => item.category === selectedCategory)),
    [selectedCategory],
  )

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(entry => entry.id === item.id)
      if (existingItem) {
        return prev.map(entry => (entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry))
      }

      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
        .filter(item => item.quantity > 0),
    )
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = 0
  const tax = Math.round(subtotal * 0.11)
  const total = subtotal - discount + tax

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <MenuHeader
          categories={MENU_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          leadingSlot={
            onToggleSidebar ? (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="rounded-[10px] border border-[#c4c4c4] bg-neutral-100 p-3 text-[#2a1d1f] transition-colors hover:bg-neutral-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle sidebar"
                aria-pressed={isSidebarOpen}
              >
                <MenuIcon className="size-5" />
              </button>
            ) : null
          }
        />
        <div className="min-h-0 flex-1 overflow-auto p-[24px]">
          <MenuGrid items={filteredItems} onAddToCart={addToCart} />
        </div>
      </div>
      <InvoicePanel
        cart={cart}
        subtotal={subtotal}
        discount={discount}
        tax={tax}
        total={total}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  )
}
