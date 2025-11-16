import { Search, Filters24Outline } from '../icons';

interface MenuHeaderProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function MenuHeader({ categories, selectedCategory, onSelectCategory }: MenuHeaderProps) {
  return (
    <div className="bg-white border-b border-[#c4c4c4] p-[24px] shrink-0">
      {/* Search and Filter */}
      <div className="flex gap-[24px] mb-[26px]">
        <div className="bg-neutral-100 box-border content-stretch flex gap-[10px] items-center px-[16px] py-[10px] rounded-[10px] flex-1 h-[52px]">
          <div aria-hidden="true" className="absolute border-[#c4c4c4] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[10px]" />
          <Search />
          <p className="font-['Poppins:Regular',sans-serif] text-[#7a7a7a] text-[16px] tracking-[0.5px]">Search</p>
        </div>
        <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[8px] rounded-[10px] h-[52px]">
          <Filters24Outline />
          <div className="font-['Poppins:Regular',sans-serif] text-[#2a1d1f] text-[16px] tracking-[0.5px]">
            Filter
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
            } box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[8px] rounded-[6px] shrink-0 relative`}
          >
            {(index === 0 && selectedCategory === 'All') || category !== selectedCategory ? (
              <div aria-hidden="true" className="absolute border-[#c4c4c4] border-[0.7px] border-solid inset-0 pointer-events-none rounded-[6px]" />
            ) : null}
            <div className={`font-['Poppins:SemiBold',sans-serif] text-[16px] tracking-[0.5px] whitespace-nowrap ${
              (index === 0 && selectedCategory === 'All') || category === selectedCategory
                ? 'text-neutral-100'
                : 'text-[#2a1d1f]'
            }`}>
              {category}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
