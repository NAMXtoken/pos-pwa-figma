import type { MenuItem } from './components/menu/MenuCard'
import imgRectangle14 from 'figma:asset/c05e6de5de57114fb8368acf4185ea17704e6e0c.png'
import { useState } from 'react'
import { InvoicePanel } from './components/invoice/InvoicePanel'
import { MenuCard } from './components/menu/MenuCard'
import { MenuHeader } from './components/menu/MenuHeader'

interface CartItem extends MenuItem {
  quantity: number
}

export default function App() {
  const [selectedCategory, setSelectedCategory]
    = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)

  // Sample menu items
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Nasi Goreng',
      price: 20000,
      image: imgRectangle14,
    },
    {
      id: '2',
      name: 'Mie Goreng',
      price: 18000,
      image: imgRectangle14,
    },
    {
      id: '3',
      name: 'Nasi Goreng Special',
      price: 25000,
      image: imgRectangle14,
    },
    {
      id: '4',
      name: 'Fried Rice Combo',
      price: 30000,
      image: imgRectangle14,
    },
    {
      id: '5',
      name: 'Chicken Fried Rice',
      price: 22000,
      image: imgRectangle14,
    },
    {
      id: '6',
      name: 'Seafood Fried Rice',
      price: 28000,
      image: imgRectangle14,
    },
    {
      id: '7',
      name: 'Vegetable Fried Rice',
      price: 17000,
      image: imgRectangle14,
    },
    {
      id: '8',
      name: 'Thai Fried Rice',
      price: 24000,
      image: imgRectangle14,
    },
    {
      id: '9',
      name: 'Indonesian Fried Rice',
      price: 20000,
      image: imgRectangle14,
    },
    {
      id: '10',
      name: 'Chinese Fried Rice',
      price: 21000,
      image: imgRectangle14,
    },
    {
      id: '11',
      name: 'Japanese Fried Rice',
      price: 26000,
      image: imgRectangle14,
    },
    {
      id: '12',
      name: 'Korean Fried Rice',
      price: 27000,
      image: imgRectangle14,
    },
  ]

  const categories = [
    'All',
    'Food',
    'Drinks',
    'Snacks',
    'Noodles',
  ]

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        cartItem => cartItem.id === item.id,
      )
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        )
      }
      else {
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map(item =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(1, item.quantity + delta),
              }
            : item,
        )
        .filter(item => item.quantity > 0)
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prevCart =>
      prevCart.filter(item => item.id !== id),
    )
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const tax = Math.round(subtotal * 0.11)
  const total = subtotal - discount + tax

  return (
    <div className="bg-white flex h-screen w-full overflow-hidden">
      {/* Left Section - Menu */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Header */}
        <MenuHeader
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Menu Grid */}
        <div className="flex-1 overflow-hidden p-[24px]">
          <div className="grid grid-cols-4 gap-[24px]">
            {menuItems.map(item => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Invoice */}
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
