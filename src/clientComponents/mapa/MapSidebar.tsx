"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import React, { useMemo } from "react";
import useMapStore from "@/app/store/mapStore";
import { Feature } from "@/utils/types/mapTypes";
import { generateRandomInteger } from "@/utils/utils";
import SectorInfo from "@/components/SectorInfo";

function MapSidebar() {
  const { allData } = useMapStore();

  const sectorData = useMemo(() => {
    return allData?.features?.map(({ properties }: Feature) => {
      const availableTickets = generateRandomInteger(5);
      const price = generateRandomInteger(10) * 10000;

      return { properties, availableTickets, price };
    });
  }, [allData]);

  return (
    <div className="w-full md:col-span-2 h-full bg-white text-black border-l-1 border-gray-200  z-[1] p-4 rounded-md overflow-auto">
      <Accordion variant="splitted">
        <AccordionItem
          classNames={{ title: "font-bold" }}
          key="1"
          title="Fecha del evento"
          subtitle={<span>20 de marzo - 20:00</span>}
        ></AccordionItem>
        <AccordionItem
          classNames={{ title: "font-bold" }}
          key="2"
          title="Seleccionar entradas"
        >
          {sectorData?.map(({ properties, availableTickets, price }) => (
            <SectorInfo
              key={properties.id}
              properties={properties}
              availableTickets={availableTickets}
              price={price}
            />
          ))}
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default MapSidebar;
