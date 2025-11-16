interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  return (
    <div 
      className="h-[228px] relative shrink-0 w-[215px] cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => onAddToCart(item)}
    >
      <div className="absolute bottom-[31.58%] left-0 pointer-events-none right-0 rounded-tl-[10px] rounded-tr-[10px] top-0">
        <div aria-hidden="true" className="absolute inset-0 rounded-tl-[10px] rounded-tr-[10px]">
          <div className="absolute bg-[#d9d9d9] inset-0 rounded-tl-[10px] rounded-tr-[10px]" />
          <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-tl-[10px] rounded-tr-[10px] size-full" src={item.image} />
        </div>
        <div aria-hidden="true" className="absolute border-[#c4c4c4] border-[1px_1px_0px] border-solid inset-0 rounded-tl-[10px] rounded-tr-[10px]" />
      </div>
      <div className="absolute bg-white bottom-0 box-border content-stretch flex flex-col gap-[8px] items-center left-0 p-[8px] right-0 rounded-bl-[10px] rounded-br-[10px] top-[68.42%]">
        <div aria-hidden="true" className="absolute border-[#c4c4c4] border-[0px_1px_1px] border-solid inset-0 pointer-events-none rounded-bl-[10px] rounded-br-[10px]" />
        <div className="flex flex-col font-['Poppins:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center tracking-[0.5px] w-full">
          <p className="leading-[normal]">{item.name}</p>
        </div>
        <div className="flex flex-col font-['Poppins:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9c2c77] text-[16px] text-center tracking-[0.5px] w-full">
          <p className="leading-[normal]">Rp {item.price.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export type { MenuItem };
