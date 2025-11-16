import { Trash2 } from 'lucide-react';
import { Plus24Outline, Remove24Outline } from '../icons';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="bg-neutral-100 box-border flex gap-[12px] items-center p-[12px] rounded-[10px] w-full relative">
      <div aria-hidden="true" className="absolute border-[#c4c4c4] border-[0.7px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="relative rounded-[10px] shrink-0 size-[80px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={item.image} />
      </div>
      <div className="flex flex-col gap-[6px] grow min-w-0">
        <div className="font-['Poppins:Regular',sans-serif] text-[#2a1d1f] text-[16px] tracking-[0.5px]">
          {item.name}
        </div>
        <div className="font-['Poppins:SemiBold',sans-serif] text-[#9c2c77] text-[16px] tracking-[0.5px]">
          Rp {item.price.toLocaleString()}
        </div>
        <div className="flex gap-[12px] items-center">
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="bg-[#9c2c77] flex items-center justify-center rounded-[6px] shrink-0 size-[28px]"
          >
            <Plus24Outline />
          </button>
          <div className="font-['Poppins:SemiBold',sans-serif] text-[#2a1d1f] text-[16px] tracking-[0.5px]">
            {item.quantity}
          </div>
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="bg-[#9c2c77] flex items-center justify-center rounded-[6px] shrink-0 size-[28px]"
          >
            <Remove24Outline />
          </button>
        </div>
      </div>
      <button onClick={() => onRemove(item.id)} className="shrink-0">
        <Trash2 className="size-[24px] text-[#CE372F]" />
      </button>
    </div>
  );
}
