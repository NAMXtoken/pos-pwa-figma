import { Moon, Sun } from 'lucide-react'
import logoImage from '../../assets/530ea6583df0689848fc4568cb58be486fd3bf0b.png'
import { sidebarSvgPaths as svgPaths } from '../../lib/svg-paths'
import { useTheme } from '../ThemeProvider'

function SidebarHero() {
  return (
    <div className="relative h-[120px] w-full overflow-hidden rounded-b-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 240 120">
        <path d="M0 0H240V101L0 120V0Z" fill="#9C2C77" className="dark:fill-[#7a2260]" />
      </svg>
      <img
        src={logoImage}
        alt="POS brand"
        className="absolute left-4 right-4 top-6 h-[72px] rounded-[8px] object-cover"
      />
    </div>
  )
}

function IconWrapper({ path }: { path: string }) {
  return (
    <svg className="shrink-0" width={24} height={24} fill="none" viewBox="0 0 24 24">
      <path d={path} fill="#2A1D1F" className="dark:fill-gray-200" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'Dashboard', path: svgPaths.p13904880, active: true },
  { label: 'Product', path: svgPaths.pe590e00 },
  { label: 'Payment', path: svgPaths.p6440600 },
  { label: 'Employee', path: svgPaths.p1a18bc80 },
  { label: 'Table', path: svgPaths.p1d49f480 },
]

function SidebarNavItem({ label, path, active }: { label: string; path: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={`flex h-12 w-full items-center gap-4 rounded-[10px] px-6 py-2 ${
        active
          ? 'bg-[#9c2c77] text-white'
          : 'text-[#2a1d1f] dark:text-gray-200 hover:bg-neutral-100 dark:hover:bg-gray-800'
      }`}
    >
      <IconWrapper path={path} />
      <span className="font-['Poppins:Regular',sans-serif] text-[16px] tracking-[0.5px]">{label}</span>
      <svg className="ml-auto" width={20} height={20} fill="none" viewBox="0 0 24 24">
        <path d={svgPaths.p2b02a600} fill={active ? '#fff' : '#2A1D1F'} className="dark:fill-gray-200" />
      </svg>
    </button>
  )
}

function ShortcutButton() {
  return (
    <button
      type="button"
      className="flex h-12 w-full items-center justify-center gap-3 rounded-[10px] bg-[#9c2c77] px-6 py-2 font-['Poppins:SemiBold',sans-serif] text-[16px] tracking-[0.5px] text-white dark:bg-[#7a2260]"
    >
      <IconWrapper path={svgPaths.p1d9bf280} />
      Cashier
    </button>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-12 w-full items-center gap-4 rounded-[10px] px-6 py-2 text-[#2a1d1f] transition-colors hover:bg-neutral-100 dark:text-gray-200 dark:hover:bg-gray-800"
    >
      {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
      <span className="font-['Poppins:Regular',sans-serif] text-[16px] tracking-[0.5px]">
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  )
}

export default function Sidebar() {
  return (
    <aside className="flex size-full flex-col bg-white dark:bg-gray-800">
      <SidebarHero />
      <div className="flex flex-1 flex-col gap-6 px-4 pb-6 pt-6">
        <ShortcutButton />
        <nav className="flex flex-col gap-3">
          {NAV_LINKS.map(item => (
            <SidebarNavItem key={item.label} label={item.label} path={item.path} active={item.active} />
          ))}
        </nav>
        <div className="mt-auto">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
