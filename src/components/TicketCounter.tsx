import React from "react";
import RoundedButton from "@/components/RoundedButton";
import { HiMinus, HiPlus } from "react-icons/hi";

interface TicketCounterProps {
  count: number;
  increment: () => void;
  decrement: () => void;
  maxCount: number;
  availableTickets: number;
}

const TicketCounter: React.FC<TicketCounterProps> = ({
  count,
  increment,
  decrement,
  maxCount,
  availableTickets,
}) => {
  const isIncrementButtonDisabled =
    count === maxCount || count === availableTickets;
  const isDecrementButtonDisabled = count < 1;

  return (
    <div className="flex items-center justify-between p-4">
      <h2 className="font-semibold">Cantidad</h2>
      <div className="flex gap-6 items-center justify-center">
        <RoundedButton
          icon={HiMinus}
          onClick={decrement}
          isDisabled={isDecrementButtonDisabled}
          className={isDecrementButtonDisabled ? "opacity-20" : ""}
        />
        <span>{count}</span>
        <RoundedButton
          icon={HiPlus}
          onClick={increment}
          isDisabled={isIncrementButtonDisabled}
          className={isIncrementButtonDisabled ? "opacity-20" : ""}
        />
      </div>
    </div>
  );
};

export default TicketCounter;
