import { Button } from '@nextui-org/react';
import React from 'react';

function MapHeader() {
  return (
    <header className="flex w-full items-center justify-between bg-[#1B2128] px-24 py-2">
      <div>
        <p className="text-lg font-bold text-white">La Vela Puerca</p>
        <p className="text-xs text-white">
          29 de Septiembre - 20:00 - Anfiteatro Jose A. Flores - San Bernardino
        </p>
      </div>
      <Button
        variant="bordered"
        radius="full"
        className="w-fit px-2 text-white"
        size="sm"
      >
        Más información
      </Button>
    </header>
  );
}

export default MapHeader;
