"use client";

import React, { useState } from "react";
import SectorInfo from "@/components/SectorInfo";
import RoundedButton from "@/components/RoundedButton";
import { BsArrowLeft } from "react-icons/bs";
import { HiMinus, HiPlus } from "react-icons/hi";
import useCounter from "@/hooks/useCounter";
import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Input,
} from "@nextui-org/react";
import { FeatureProperties } from "@/utils/types/mapTypes";
import { currencyFormatter } from "@/utils/utils";
import useMapStore from "@/app/store/mapStore";

const MAX_TICKETS = 4;
const featureProperties: FeatureProperties = {
  codigo: "GNA",
  desc: "GNA",
  id: 6,
  nombre: "Gradería norte A",
  place_id: 1,
};
const availableTickets = 10;
const price = 120000;

const MapDetails: React.FC = () => {
  const { count: ticketCount, decrement, increment } = useCounter(0);
  const { setSelectedData } = useMapStore();

  const onBackButtonClick = () => {
    setSelectedData(undefined);
  };

  const isIncrementButtonDisabled =
    ticketCount === MAX_TICKETS || ticketCount === availableTickets;
  const isDecrementButtonDisabled = ticketCount < 1;

  return (
    <>
      <div className="px-6 py-4 w-full md:col-span-2 flex flex-col gap-3 max-h-[80vh] overflow-y-scroll">
        <div className="relative text-center py-1">
          <RoundedButton
            icon={BsArrowLeft}
            className="absolute left-0 top-0"
            onClick={onBackButtonClick}
          />
          <h1 className="text-xl font-bold">Detalles</h1>
          {/* selected sector */}
          <SectorInfo
            availableTickets={availableTickets}
            price={price}
            properties={featureProperties}
          />
        </div>
        <div className="flex items-center justify-between p-4">
          <h2 className="font-semibold">Cantidad</h2>
          <div className="flex gap-6 items-center justify-center">
            <RoundedButton
              icon={HiMinus}
              onClick={decrement}
              isDisabled={isDecrementButtonDisabled}
              className={isDecrementButtonDisabled ? "opacity-20 " : ""}
            />
            <span>{ticketCount}</span>

            <RoundedButton
              icon={HiPlus}
              onClick={increment}
              isDisabled={isIncrementButtonDisabled}
              className={isIncrementButtonDisabled ? "opacity-20" : ""}
            />
          </div>
        </div>
        <Divider />
        <span className="text-center text-[#495F76] mx-24 text-balance text-sm">
          Este evento sólo permite compra de máximo {MAX_TICKETS} entradas por
          persona
        </span>
        {/* available seats list */}
        <div className="p-4">
          <div className="flex justify-between items-center my-4">
            <div>
              <h3 className="font-bold">Gradería norte A</h3>
              <span className="text-sm text-[#495F76]">Fila N Butaca 3</span>
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
          <Divider />
          <div className="flex justify-between items-center my-4">
            <div>
              <h3 className="font-bold">Gradería norte A</h3>
              <span className="text-sm text-[#495F76]">Fila N Butaca 4</span>
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
          <Divider />
        </div>

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
        {/* subtotal */}
        <div className="p-4">
          <h2 className="text-lg text-center font-bold">Subtotal</h2>
          <div className="flex justify-between items-center my-4">
            <div>
              <h3>Gradería norte A</h3>
              <span className="text-sm text-[#495F76]">x2 entradas</span>
            </div>
            <div>
              <h3 className="font-bold">
                {currencyFormatter.format(price * ticketCount)}
              </h3>
            </div>
          </div>
          <Divider />
          <div className="flex justify-between items-center my-4">
            <div>
              <h3>Canje de socios</h3>
            </div>
            <div>
              <h3 className="font-bold">{currencyFormatter.format(-100000)}</h3>
            </div>
          </div>
          <Divider />
          <div className="flex justify-between items-center my-4">
            <div>
              <h3>Cargo por servicio</h3>
            </div>
            <div>
              <h3 className="font-bold">{currencyFormatter.format(10000)}</h3>
            </div>
          </div>
          <Divider />
          {/* total */}
          <div className="flex justify-between items-center my-4">
            <div>
              <h3 className="text-lg font-semibold">Total</h3>
            </div>
            <div>
              <h3 className="font-bold">{currencyFormatter.format(110000)}</h3>
              <span className="text-sm text-[#495F76]">Iva incluido</span>
            </div>
          </div>
          {/* CTA */}
          <div className="flex justify-between items-center gap-4 mt-4 ">
            <Button radius="full" className="bg-[#00D19D] flex-1 font-bold">
              Comprar ahora
            </Button>
            <Button
              radius="full"
              variant="bordered"
              className="flex-1 font-bold"
            >
              Agregar al carrito
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapDetails;
