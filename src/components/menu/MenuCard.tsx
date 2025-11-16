interface PictureSource {
  srcSet: string
  type?: string
  media?: string
  sizes?: string
}

export interface MenuImage {
  alt: string
  fallbackSrc: string
  width: number
  height: number
  sizes?: string
  fetchPriority?: 'high' | 'low' | 'auto'
  loading?: 'eager' | 'lazy'
  decoding?: 'sync' | 'async' | 'auto'
  sources?: PictureSource[]
}

interface MenuItem {
  id: string
  name: string
  price: number
  image: MenuImage
}

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const {
    alt,
    fallbackSrc,
    width,
    height,
    sizes,
    loading = 'lazy',
    fetchPriority = 'auto',
    decoding = 'async',
    sources = [],
  } = item.image

  return (
    <div
      className="relative h-[228px] w-full min-w-0 cursor-pointer transition-opacity hover:opacity-80"
      onClick={() => onAddToCart(item)}
    >
      <div className="absolute bottom-[31.58%] left-0 pointer-events-none right-0 rounded-tl-[10px] rounded-tr-[10px] top-0">
        <div aria-hidden="true" className="absolute inset-0 rounded-tl-[10px] rounded-tr-[10px]">
          <div className="absolute bg-[#d9d9d9] inset-0 rounded-tl-[10px] rounded-tr-[10px]" />
          <picture className="absolute size-full rounded-tl-[10px] rounded-tr-[10px]">
            {sources.map(({ srcSet, type, media, sizes: sourceSizes }) => (
              <source key={`${srcSet}-${type ?? 'img'}`} srcSet={srcSet} type={type} media={media} sizes={sourceSizes ?? sizes} />
            ))}
            <img
              alt={alt}
              className="absolute max-w-none object-50%-50% object-cover rounded-tl-[10px] rounded-tr-[10px] size-full"
              decoding={decoding}
              fetchPriority={fetchPriority}
              height={height}
              loading={loading}
              sizes={sizes}
              src={fallbackSrc}
              width={width}
            />
          </picture>
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

export type { MenuItem, MenuImage }
