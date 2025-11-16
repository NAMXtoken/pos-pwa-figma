import menuImageFallback from '../../assets/menu-215w.png'
import menuImage215w from '../../assets/menu-215w.webp'
import menuImage430w from '../../assets/menu-430w.webp'
import type { MenuEntry } from './types'
import type { MenuImage } from '../menu/MenuCard'

const createMenuImage = (overrides?: Partial<MenuImage>): MenuImage => ({
  alt: 'Menu item thumbnail',
  fallbackSrc: menuImageFallback,
  width: 215,
  height: 156,
  decoding: 'async',
  sizes: '(max-width: 768px) 50vw, 215px',
  sources: [
    {
      type: 'image/webp',
      srcSet: `${menuImage430w}`,
      media: '(min-resolution: 2dppx)',
      sizes: '(max-width: 768px) 50vw, 215px',
    },
    {
      type: 'image/webp',
      srcSet: `${menuImage215w}`,
      sizes: '(max-width: 768px) 50vw, 215px',
    },
  ],
  ...overrides,
})

const RAW_ITEMS: Array<Omit<MenuEntry, 'image'> & { imageOverrides?: Partial<MenuImage> }> = [
  { id: '1', name: 'Nasi Goreng', price: 20000, category: 'Food', imageOverrides: { fetchPriority: 'high', loading: 'eager' } },
  { id: '2', name: 'Mie Goreng', price: 18000, category: 'Noodles' },
  { id: '3', name: 'Chicken Fried Rice', price: 22000, category: 'Food' },
  { id: '4', name: 'Seafood Fried Rice', price: 28000, category: 'Food' },
  { id: '5', name: 'Veggie Spring Rolls', price: 15000, category: 'Snacks' },
  { id: '6', name: 'Spicy Ramen Bowl', price: 26000, category: 'Noodles' },
  { id: '7', name: 'Thai Iced Tea', price: 14000, category: 'Drinks' },
  { id: '8', name: 'Matcha Latte', price: 16000, category: 'Drinks' },
  { id: '9', name: 'Indomie Special', price: 19000, category: 'Noodles' },
  { id: '10', name: 'Satay Skewers', price: 24000, category: 'Snacks' },
  { id: '11', name: 'Fried Banana', price: 12000, category: 'Snacks' },
  { id: '12', name: 'Es Cendol', price: 13000, category: 'Drinks' },
]

export const MENU_ITEMS: MenuEntry[] = RAW_ITEMS.map(({ imageOverrides, ...item }) => ({
  ...item,
  image: createMenuImage({
    alt: `${item.name} plated dish`,
    ...imageOverrides,
  }),
}))

export const MENU_CATEGORIES = ['All', 'Food', 'Drinks', 'Snacks', 'Noodles']
