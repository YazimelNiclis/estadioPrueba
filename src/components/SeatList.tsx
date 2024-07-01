import React from "react";
import { Button, Divider } from "@nextui-org/react";
import { Seat, SelectedFeatureProperties } from "@/utils/types/mapTypes";

interface SeatListProps {
  seats: Seat[];
  sector: SelectedFeatureProperties;
}

const SeatList: React.FC<SeatListProps> = ({ seats, sector }) => {
  // tenemos cientos de asientos para renderizar... preguntar sobre diseño
  const slicedSeats = seats.slice(0, 5);

  return (
    <div className="p-4">
      {slicedSeats.map(({ properties }, index) => (
        <React.Fragment key={index}>
          <div className="flex justify-between items-center my-4">
            <div>
              <h3 className="font-bold">{sector.featureProperties.nombre}</h3>
              <span className="text-sm text-[#495F76]">
                Fila {properties.row} Butaca {properties.seat}
              </span>
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
