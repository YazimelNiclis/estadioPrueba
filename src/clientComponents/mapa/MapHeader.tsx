import { Button } from "@nextui-org/react";
import React from "react";

function MapHeader() {
  return (
    <header className="bg-[#1B2128] w-full px-24 py-2 flex justify-between items-center">
      <div>
        <p className="text-lg font-bold text-white ">La Vela Puerca</p>
        <p className="text-xs text-white">
          29 de Septiembre - 20:00 - Anfiteatro Jose A. Flores - San Bernardino
        </p>
      </div>
      <Button
        variant="bordered"
        radius="full"
        className="text-white px-2 w-fit"
        size="sm"
      >
        Más información
      </Button>
    </header>
  );
}

export default MapHeader;
