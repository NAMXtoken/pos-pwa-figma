import type { ReactNode } from 'react'
import { Search, FiltersIcon } from '../icons'

interface MenuHeaderProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  leadingSlot?: ReactNode
}

export function MenuHeader({ categories, selectedCategory, onSelectCategory, leadingSlot }: MenuHeaderProps) {
  return (
    <div className="bg-white border-b border-[#c4c4c4] p-[24px] shrink-0">
      {/* Search and Filter */}
      <div className="mb-[26px] flex items-center gap-[24px]">
        {leadingSlot ? <div className="shrink-0">{leadingSlot}</div> : null}
        <div className="flex flex-1 items-center gap-[24px]">
          <div className="relative flex h-[52px] flex-1 items-center gap-[10px] rounded-[10px] bg-neutral-100 px-[16px] py-[10px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[10px] border border-[#c4c4c4]"
            />
            <Search />
            <p className="font-['Poppins:Regular',sans-serif] text-[16px] tracking-[0.5px] text-[#7a7a7a]">Search</p>
          </div>
          <div className="relative flex h-[52px] items-center gap-[10px] rounded-[10px] px-[16px] py-[8px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[10px] border border-[#c4c4c4]"
            />
            <FiltersIcon />
            <div className="font-['Poppins:Regular',sans-serif] text-[16px] tracking-[0.5px] text-[#2a1d1f]">
              Filter
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-[24px] overflow-x-auto">
        {categories.map((category, index) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`${
              (index === 0 && selectedCategory === 'All') || category === selectedCategory
                ? 'bg-[#9c2c77]'
                : 'bg-neutral-100'
            } relative box-border flex shrink-0 items-center justify-center gap-[10px] rounded-[6px] px-[16px] py-[8px]`}
          >
            {(index === 0 && selectedCategory === 'All') || category !== selectedCategory ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[6px] border border-[#c4c4c4]"
              />
            ) : null}
            <div
              className={`font-['Poppins:SemiBold',sans-serif] text-[16px] tracking-[0.5px] whitespace-nowrap ${
                (index === 0 && selectedCategory === 'All') || category === selectedCategory
                  ? 'text-neutral-100'
                  : 'text-[#2a1d1f]'
              }`}
            >
              {category}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
