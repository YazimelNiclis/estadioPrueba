import React from "react";
import { Divider } from "@nextui-org/react";
import { FeatureProperties, SelectedData } from "@/utils/types/mapTypes";
import useMapStore from "@/app/store/mapStore";
import { currencyFormatter } from "@/utils/utils";

interface SectorInfoProps {
  properties: FeatureProperties;
  availableTickets: number;
  price: number;
}

const SectorInfo: React.FC<SectorInfoProps> = ({
  properties,
  availableTickets,
  price,
}) => {
  const { setSelectedData } = useMapStore();

  const onClick = () => {
    if (isSoldOut) return;

    const selectedData = {
      ...properties,
      codigo: Number(properties.codigo),
    } as SelectedData;
    setSelectedData(selectedData);
  };

  const isSoldOut = availableTickets === 0;

  return (
    <>
      <div
        className={`flex justify-between mt-1 p-4 gap-2  text-balance ${
          isSoldOut ? "opacity-30" : "hover:cursor-pointer hover:bg-slate-50"
        }`}
        onClick={onClick}
      >
        <div className="flex flex-col justify-center gap-1 text-left">
          <h2 className="text-lg font-semibold">{properties.nombre}</h2>
          <span className="text-sm text-[#495F76]">
            {isSoldOut
              ? "Agotado"
              : `Queda${availableTickets > 1 ? "n" : ""} ${availableTickets}`}
          </span>
        </div>
        <div className="flex flex-col justify-center gap-1 text-right">
          <h2 className="text-lg font-semibold">
            {currencyFormatter.format(price)}
          </h2>
          <span className="text-sm text-[#495F76]">Precio por persona</span>
        </div>
      </div>
      <Divider />
    </>
  );
};

export default SectorInfo;
