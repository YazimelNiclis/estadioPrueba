import { Divider } from '@nextui-org/react';
import React, { useMemo } from 'react';
import { currencyFormatter } from '@/utils/utils';

interface SubtotalItem {
  name: string;
  details: string;
  price: number;
  quantity: number;
}

interface SubtotalProps {
  items: SubtotalItem[];
}

const Subtotal: React.FC<SubtotalProps> = ({ items }) => {
  const total = useMemo(() => {
    return items.reduce(
      (sum, { price, quantity }) => sum + price * quantity,
      0
    );
  }, [items]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-center">Subtotal</h2>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center justify-between my-4">
            <div className="text-left">
              <h3>{item.name}</h3>
              <span className="text-sm text-[#495F76]">{item.details}</span>
            </div>
            <div className="text-right">
              <h3 className="font-bold">
                {currencyFormatter.format(item.price * item.quantity)}
              </h3>
            </div>
          </div>
          <Divider className="bg-transparent border-t border-dashed" />{' '}
        </React.Fragment>
      ))}
      <div className="flex items-center justify-between my-4">
        <div>
          <h3 className="text-lg font-semibold">Total</h3>
        </div>
        <div className="text-right">
          <h3 className="font-bold">{currencyFormatter.format(total)}</h3>
          <span className="text-sm text-[#495F76]">Iva incluido</span>
        </div>
      </div>
    </div>
  );
};

export default Subtotal;
