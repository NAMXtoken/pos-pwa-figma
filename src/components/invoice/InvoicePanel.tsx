import { Bill24Outline, Percentage24Outline } from '../icons';
import { CartItem } from './CartItem';

interface CartItemType {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface InvoicePanelProps {
  cart: CartItemType[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export function InvoicePanel({ 
  cart, 
  subtotal, 
  discount, 
  tax, 
  total, 
  onUpdateQuantity, 
  onRemoveItem 
}: InvoicePanelProps) {
  return (
    <div className="bg-white w-[25vw] border-l border-[#c4c4c4] flex flex-col h-full">
      {/* Invoice Header */}
      <div className="p-[24px] border-b border-[#c4c4c4]">
        <div className="flex items-center justify-between">
          <div className="font-['Poppins:SemiBold',sans-serif] text-[#2a1d1f] text-[24px]">
            Invoice
          </div>
          <div className="flex gap-[16px] items-center">
            <Bill24Outline />
            <div className="font-['Poppins:Regular',sans-serif] text-[#2a1d1f] text-[18px] tracking-[0.5px]">
              #0001
            </div>
          </div>
        </div>
      </div>

      {/* Cart Items - Scrollable */}
      <div className="flex-1 overflow-y-auto p-[16px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex flex-col gap-[8px]">
          {cart.map(item => (
            <CartItem 
              key={item.id} 
              item={item} 
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      </div>

      {/* Bottom Summary - Fixed */}
      <div className="bg-white border-t border-[#c4c4c4] p-[16px]">
        <div className="flex flex-col gap-[12px]">
          {/* Promo Button */}
          <button className="bg-[#9c2c77] h-[38px] rounded-[10px] w-full">
            <div aria-hidden="true" className="absolute border-[#c4c4c4] border-[0.7px] border-solid inset-0 pointer-events-none rounded-[10px]" />
            <div className="box-border content-stretch flex gap-[12px] h-[38px] items-center justify-center px-[12px] py-[6px] relative w-full">
              <Percentage24Outline />
              <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-neutral-100 tracking-[0.5px]">Promo & Discount</p>
            </div>
          </button>

          {/* Totals */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex gap-[12px] items-start text-[#2a1d1f] text-[16px] tracking-[0.5px]">
              <div className="font-['Poppins:Regular',sans-serif]">Subtotal</div>
              <div className="font-['Poppins:SemiBold',sans-serif] ml-auto">Rp {subtotal.toLocaleString()}</div>
            </div>
            <div className="flex gap-[12px] items-start text-[#2a1d1f] text-[16px] tracking-[0.5px]">
              <div className="font-['Poppins:Regular',sans-serif]">Discount</div>
              <div className="font-['Poppins:SemiBold',sans-serif] ml-auto">-Rp {discount.toLocaleString()}</div>
            </div>
            <div className="flex gap-[12px] items-start text-[#2a1d1f] text-[16px] tracking-[0.5px]">
              <div className="font-['Poppins:Regular',sans-serif]">Tax</div>
              <div className="font-['Poppins:SemiBold',sans-serif] ml-auto">Rp {tax.toLocaleString()}</div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-0 w-full">
            <svg className="block w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 413 1">
              <path d="M0.4 0.4H412.401" stroke="#9C2C77" strokeDasharray="16 16" strokeLinecap="round" strokeWidth="0.8" />
            </svg>
          </div>

          {/* Total */}
          <div className="flex gap-[12px] items-center text-[#2a1d1f] text-[20px]">
            <div className="font-['Poppins:Regular',sans-serif]">Total</div>
            <div className="font-['Poppins:SemiBold',sans-serif] ml-auto">Rp {total.toLocaleString()}</div>
          </div>

          {/* Select Table Button */}
          <button className="bg-[#9c2c77] h-[38px] rounded-[10px] w-full">
            <div className="box-border content-stretch flex gap-[10px] h-[38px] items-center justify-center px-[12px] py-[6px] relative w-full">
              <div className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-center text-white tracking-[0.5px]">
                Select Table
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
