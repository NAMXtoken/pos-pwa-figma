import { Trash2 } from 'lucide-react'
import { PlusIcon, RemoveIcon } from '../icons'
import type { MenuImage } from '../menu/MenuCard'

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    image: MenuImage
    quantity: number
  }
  onUpdateQuantity: (id: string, delta: number) => void
  onRemove: (id: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { fallbackSrc, alt, width, height, sources = [] } = item.image

  return (
    <div className="bg-neutral-100 box-border flex gap-[12px] items-center p-[12px] rounded-[10px] w-full relative">
      <div aria-hidden="true" className="absolute border-[#c4c4c4] border-[0.7px] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="relative rounded-[10px] shrink-0 size-[80px]">
        <picture className="absolute inset-0 size-full rounded-[10px]">
          {sources.map(({ srcSet, type, media, sizes }) => (
            <source key={`${srcSet}-${type ?? 'img'}`} srcSet={srcSet} type={type} media={media} sizes={sizes} />
          ))}
          <img
            alt={alt}
            className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full"
            decoding="async"
            height={height}
            loading="lazy"
            src={fallbackSrc}
            width={width}
          />
        </picture>
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
            <PlusIcon />
          </button>
          <div className="font-['Poppins:SemiBold',sans-serif] text-[#2a1d1f] text-[16px] tracking-[0.5px]">
            {item.quantity}
          </div>
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="bg-[#9c2c77] flex items-center justify-center rounded-[6px] shrink-0 size-[28px]"
          >
            <RemoveIcon />
          </button>
        </div>
      </div>
      <button onClick={() => onRemove(item.id)} className="shrink-0">
        <Trash2 className="size-[24px] text-[#CE372F]" />
      </button>
    </div>
  );
}
