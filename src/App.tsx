import { lazy, Suspense, useEffect, useState } from 'react'
import { CashierLayout } from './components/cashier/CashierLayout'
import Sidebar from './components/sidebar/Sidebar'
import { ThemeProvider } from './components/ThemeProvider'
const ReloadPrompt = lazy(async () => await import('./ReloadPrompt'))

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [shouldLoadReloadPrompt, setShouldLoadReloadPrompt] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined')
      return

    const timeoutId = window.setTimeout(() => setShouldLoadReloadPrompt(true), 1500)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <ThemeProvider>
      {shouldLoadReloadPrompt && (
        <Suspense fallback={null}>
          <ReloadPrompt />
        </Suspense>
      )}
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="mx-auto flex h-screen w-full max-w-[1440px] gap-4 px-8">
          <nav
            className={`relative z-50 w-[240px] flex-shrink-0 overflow-hidden border-r border-[#c4c4c4] bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800 ${
              isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none md:pointer-events-auto md:translate-x-0'
            }`}
          >
            <Sidebar />
          </nav>
          {isSidebarOpen ? (
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/20 md:hidden"
              aria-label="Close sidebar"
              onClick={() => setIsSidebarOpen(false)}
            />
          ) : null}
          <main className="flex min-h-0 flex-1 overflow-hidden bg-white dark:bg-gray-900">
            <CashierLayout onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} isSidebarOpen={isSidebarOpen} />
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
