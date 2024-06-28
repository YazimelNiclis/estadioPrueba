"use client";

import React, { useMemo } from "react";
import SectorInfo from "@/components/SectorInfo";
import RoundedButton from "@/components/RoundedButton";
import { BsArrowLeft } from "react-icons/bs";
import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Input,
} from "@nextui-org/react";
import useCounter from "@/hooks/useCounter";
import useMapStore from "@/app/store/mapStore";
import TicketCounter from "@/components/TicketCounter";
import Subtotal from "@/components/Subtotal";
import SeatList from "@/components/SeatList";

const MAX_TICKETS = 4;

const MapDetails: React.FC = () => {
  const { count: ticketCount, decrement, increment } = useCounter(0);
  const { selectedData, setSelectedData } = useMapStore();

  const onBackButtonClick = () => {
    setSelectedData(null);
  };

  const subtotalItems = useMemo(
    () => [
      {
        name: selectedData?.featureProperties.nombre ?? "",
        details: `x${ticketCount} entradas`,
        price: selectedData?.price ?? 0,
        quantity: ticketCount,
      },
      { name: "Canje de socios", details: "", price: -100000, quantity: 1 },
      { name: "Cargo por servicio", details: "", price: 10000, quantity: 1 },
    ],
    [ticketCount, selectedData]
  );

  if (!selectedData) return null;

  const seats = [
    {
      name: selectedData.featureProperties.nombre,
      details: "Fila N Butaca 3",
    },
    {
      name: selectedData.featureProperties.nombre,
      details: "Fila N Butaca 4",
    },
  ];

  const { availableTickets, featureProperties, price } = selectedData;

  return (
    <div className="px-6 py-4 w-full md:col-span-2 flex flex-col gap-3 max-h-[80vh] overflow-y-scroll">
      <div className="relative text-center py-1">
        <RoundedButton
          icon={BsArrowLeft}
          className="absolute left-0 top-0"
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
      <span className="text-center text-[#495F76] mx-24 text-balance text-sm">
        Este evento sólo permite compra de máximo {MAX_TICKETS} entradas por
        persona
      </span>
      <SeatList seats={seats} />
      <Accordion>
        <AccordionItem
          classNames={{
            title: "font-bold",
            heading: "bg-[#EEF4F9] px-4 rounded-lg",
            content: "p-4",
          }}
          className="my-4"
          key="1"
          title="Canje para Socios"
        >
          <h2 className="text-md font-semibold">Documento de identidad</h2>
          <Input
            placeholder="Ej: 3.345.678"
            className="bg-white mt-1"
            classNames={{ inputWrapper: "bg-white border py-2 px-4" }}
          />
        </AccordionItem>
      </Accordion>
      <Subtotal items={subtotalItems} />
      <div className="flex justify-between items-center gap-4 mt-4">
        <Button radius="full" className="bg-[#00D19D] flex-1 font-bold">
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
