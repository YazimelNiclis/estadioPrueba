import React from "react";
import { Divider } from "@nextui-org/react";
import { FeatureProperties, SelectedData } from "@/utils/types/mapTypes"; // Adjust the import path as necessary
import useMapStore from "@/app/store/mapStore";

const currencyFormatter = new Intl.NumberFormat("es-PY", {
  style: "currency",
  currency: "PYG",
});

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
    const selectedData = {
      ...properties,
      codigo: Number(properties.codigo),
    } as SelectedData;
    setSelectedData(selectedData);
  };

  return (
    <>
      <div
        className="flex justify-between mt-1 p-4 gap-2 hover:cursor-pointer hover:bg-slate-50 text-balance"
        onClick={onClick}
      >
        <div className="flex flex-col justify-center gap-1">
          <h2 className="text-lg font-semibold">{properties.nombre}</h2>
          {!!availableTickets && (
            <span className="text-sm text-[#495F76]">
              {availableTickets > 1 ? "Quedan" : "Queda"} {availableTickets}
            </span>
          )}
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
