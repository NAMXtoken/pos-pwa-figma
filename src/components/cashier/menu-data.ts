import menuImage from '../../image.png'
import type { MenuEntry } from './types'

export const MENU_ITEMS: MenuEntry[] = [
  { id: '1', name: 'Nasi Goreng', price: 20000, image: menuImage, category: 'Food' },
  { id: '2', name: 'Mie Goreng', price: 18000, image: menuImage, category: 'Noodles' },
  { id: '3', name: 'Chicken Fried Rice', price: 22000, image: menuImage, category: 'Food' },
  { id: '4', name: 'Seafood Fried Rice', price: 28000, image: menuImage, category: 'Food' },
  { id: '5', name: 'Veggie Spring Rolls', price: 15000, image: menuImage, category: 'Snacks' },
  { id: '6', name: 'Spicy Ramen Bowl', price: 26000, image: menuImage, category: 'Noodles' },
  { id: '7', name: 'Thai Iced Tea', price: 14000, image: menuImage, category: 'Drinks' },
  { id: '8', name: 'Matcha Latte', price: 16000, image: menuImage, category: 'Drinks' },
  { id: '9', name: 'Indomie Special', price: 19000, image: menuImage, category: 'Noodles' },
  { id: '10', name: 'Satay Skewers', price: 24000, image: menuImage, category: 'Snacks' },
  { id: '11', name: 'Fried Banana', price: 12000, image: menuImage, category: 'Snacks' },
  { id: '12', name: 'Es Cendol', price: 13000, image: menuImage, category: 'Drinks' },
]

export const MENU_CATEGORIES = ['All', 'Food', 'Drinks', 'Snacks', 'Noodles']
