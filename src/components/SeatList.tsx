import React from "react";
import { Button, Divider } from "@nextui-org/react";

interface SeatListProps {
  seats: { name: string; details: string }[];
}

const SeatList: React.FC<SeatListProps> = ({ seats }) => {
  return (
    <div className="p-4">
      {seats.map((seat, index) => (
        <React.Fragment key={index}>
          <div className="flex justify-between items-center my-4">
            <div>
              <h3 className="font-bold">{seat.name}</h3>
              <span className="text-sm text-[#495F76]">{seat.details}</span>
            </div>
            <div>
              <Button
                radius="full"
                variant="bordered"
                className="flex-1 font-bold"
              >
                Elegir
              </Button>
            </div>
          </div>
          {index < seats.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SeatList;
