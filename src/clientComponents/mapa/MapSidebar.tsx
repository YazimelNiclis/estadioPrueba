'use client';

import { Accordion, AccordionItem } from '@nextui-org/react';
import React, { useMemo } from 'react';
import useMapStore from '@/app/store/mapStore';
import SectorInfo from '@/components/SectorInfo';
import { Feature } from '@/utils/types/mapTypes';
import { generateRandomInteger } from '@/utils/utils';

function MapSidebar() {
  const { allData } = useMapStore();

  const sectorData = useMemo(() => {
    return allData?.features?.map(({ properties }: Feature) => {
      const availableTickets = generateRandomInteger(10);
      const price = (generateRandomInteger(10) + 1) * 10000;

      return { properties, availableTickets, price };
    });
  }, [allData]);

  return (
    <div className="z-[1] h-full max-h-[75vh] w-full overflow-y-scroll rounded-md border-l-1 border-gray-200 bg-white p-4 text-black md:col-span-2">
      <Accordion showDivider={false}>
        <AccordionItem
          classNames={{
            title: 'font-bold',
            heading: 'bg-[#EEF4F9] px-4 rounded-lg'
          }}
          className="my-4"
          key="1"
          title="Fecha del evento"
          subtitle={<span>20 de marzo - 20:00</span>}
        ></AccordionItem>
        <AccordionItem
          classNames={{
            title: 'font-bold',
            heading: 'bg-[#EEF4F9] px-4 rounded-lg'
          }}
          className="my-4"
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
