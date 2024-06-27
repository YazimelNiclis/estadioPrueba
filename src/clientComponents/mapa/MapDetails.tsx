"use client";

import React, { useState } from "react";
import SectorInfo from "@/components/SectorInfo";
import RoundedButton from "@/components/RoundedButton";
import { BsArrowLeft } from "react-icons/bs";
import { HiMinus, HiPlus } from "react-icons/hi";
import useCounter from "@/hooks/useCounter";
import { Accordion, AccordionItem, Divider, Input } from "@nextui-org/react";

const MAX_TICKETS = 4;

const MapDetails: React.FC = () => {
  const { count: ticketCount, decrement, increment } = useCounter(0);

  return (
    <>
      <div className="px-6 py-4 w-full md:col-span-2 flex flex-col gap-3 max-h-[75vh]">
        <div className="relative text-center py-1">
          <RoundedButton icon={BsArrowLeft} className="absolute left-0 top-0" />
          <h1 className="text-xl font-bold">Detalles</h1>
          <SectorInfo
            availableTickets={10}
            price={120000}
            properties={{
              codigo: "GNA",
              desc: "GNA",
              id: 6,
              nombre: "Gradería norte A",
              place_id: 1,
            }}
          />
        </div>
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Cantidad</h2>
          <div className="flex gap-6 items-center justify-center">
            <RoundedButton
              icon={HiMinus}
              onClick={decrement}
              isDisabled={ticketCount < 1}
              className={ticketCount < 1 ? "opacity-20 " : ""}
            />
            <span>{ticketCount}</span>

            <RoundedButton
              icon={HiPlus}
              onClick={increment}
              isDisabled={ticketCount === MAX_TICKETS}
              className={ticketCount === MAX_TICKETS ? "opacity-20" : ""}
            />
          </div>
        </div>
        <Divider />
        <span className="text-center text-[#495F76] mx-12 text-balance">
          Este evento sólo permite compra de máximo {MAX_TICKETS} entradas por
          persona
        </span>
        {/* available seats list */}

        {/* TODO: create atomized accordionItem */}
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
      </div>
    </>
  );
};

export default MapDetails;
