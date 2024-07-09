'use client';

import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Input
} from '@nextui-org/react';
import React, { useMemo } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import useMapStore from '@/app/store/mapStore';
import RoundedButton from '@/components/RoundedButton';
import SeatList from '@/components/SeatList';
import SectorInfo from '@/components/SectorInfo';
import Subtotal from '@/components/Subtotal';
import TicketCounter from '@/components/TicketCounter';
import useCounter from '@/hooks/useCounter';

const MAX_TICKETS = 4;

const MapDetails: React.FC = () => {
  const { count: ticketCount, decrement, increment } = useCounter(0);
  const { selectedData, setSelectedData, filteredSeatData } = useMapStore();
  // const hola = "";
  const onBackButtonClick = () => {
    setSelectedData(null);
  };

  // mock data
  const subtotalItems = useMemo(
    () => [
      {
        name: selectedData?.featureProperties.nombre ?? '',
        details: `x${ticketCount} entradas`,
        price: selectedData?.price ?? 0,
        quantity: ticketCount
      },
      {
        name: 'Canje de socios',
        details: '',
        price: selectedData?.price ?? 0 * -0.3,
        quantity: 0
      },
      {
        name: 'Cargo por servicio',
        details: '',
        price: 10000,
        quantity: 1
      }
    ],
    [ticketCount, selectedData]
  );

  if (!selectedData) return null;

  const { availableTickets, featureProperties, price } = selectedData;

  return (
    <div className="flex max-h-[80vh] w-full flex-col gap-3 overflow-y-scroll px-6 py-4 md:col-span-2">
      <div className="relative py-1 text-center">
        <RoundedButton
          icon={BsArrowLeft}
          className="absolute top-0 left-0"
          onClick={onBackButtonClick}
        />
        <h1 className="text-xl font-bold">Detalles</h1>
        <SectorInfo
          availableTickets={availableTickets}
          price={price}
          properties={featureProperties}
        />
      </div>
      <TicketCounter
        count={ticketCount}
        increment={increment}
        decrement={decrement}
        maxCount={MAX_TICKETS}
        availableTickets={availableTickets}
      />
      <Divider />
      <span className="mx-24 text-balance text-center text-sm text-[#495F76]">
        Este evento sólo permite compra de máximo {MAX_TICKETS} entradas por
        persona
      </span>
      <SeatList seats={filteredSeatData} sector={selectedData} />
      <Accordion>
        <AccordionItem
          classNames={{
            title: 'font-bold',
            heading: 'bg-[#EEF4F9] px-4 rounded-lg',
            content: 'p-4'
          }}
          className="my-4"
          key="1"
          title="Canje para Socios"
        >
          <h2 className="font-semibold text-md">Documento de identidad</h2>
          <Input
            placeholder="Ej: 3.345.678"
            className="mt-1 bg-white"
            classNames={{
              inputWrapper: 'bg-white border py-2 px-4'
            }}
          />
        </AccordionItem>
      </Accordion>
      <Subtotal items={subtotalItems} />
      <div className="flex items-center justify-between gap-4 mt-4">
        <Button radius="full" className="flex-1 bg-[#00D19D] font-bold">
          Comprar ahora
        </Button>
        <Button radius="full" variant="bordered" className="flex-1 font-bold">
          Agregar al carrito
        </Button>
      </div>
    </div>
  );
};

export default MapDetails;
