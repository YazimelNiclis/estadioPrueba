"use client";

import { Button, Divider } from "@nextui-org/react";
import React from "react";
import { MdFavoriteBorder, MdOutlineInfo } from "react-icons/md";
import useMapStore from "@/app/store/mapStore";
import { Feature, StadiumGeoJson } from "@/utils/types/mapTypes";

/* 
  Sidebar al lado del mapa.
*/

function MapSidebar() {
  const { hoveredData, selectedData, setSelectedData, allData } = useMapStore();
  const [mapData, setMapData] = React.useState<StadiumGeoJson | null>(allData);

  return (
    <div className="w-full md:col-span-2 h-full bg-white text-black border-l-1 border-gray-200  z-[1]`x mt-5 rounded-md overflow-auto">
      <header className="pl-5">
        <div className="flex gap-2 justify-between content-center">
          <p className="text-2xl mb-5">Selecciona tu entrada</p>
          <div className="flex gap-2 mr-8 pr-9">
            <MdFavoriteBorder
              cursor={"pointer"}
              size={20}
              color="gray"
              onClick={() => {}}
              className="hover:bg-gray-200 rounded-2xl"
            />
            <MdOutlineInfo
              cursor={"pointer"}
              size={20}
              color="gray"
              onClick={() => {}}
              className="hover:bg-gray-200 rounded-2xl"
            />
          </div>
        </div>
        <Button className="bg-white border-2 rounded-3xl mr-3 hover:bg-gray-100 hover:border-gray-400">
          Cantidad
        </Button>
        <Button className="bg-white border-2  rounded-3xl mr-3 hover:bg-gray-100 hover:border-gray-400">
          Precio
        </Button>
        <Button className="bg-white border-2 rounded-3xl mr-3 hover:bg-gray-100 hover:border-gray-400">
          Mejores asientos
        </Button>
      </header>
      <br />
      <Divider orientation="horizontal" />
      <div className="bg-gray-300">
        <p className="pl-5 pb-3 pt-3">
          <b>Preventa 2</b>
        </p>
      </div>
      <Divider orientation="horizontal" />
      {selectedData ? (
        <>
          <div className="pl-5 flex gap-3 mt-3 mb-3">
            <p className=" text-gray-700">{selectedData?.nombre}</p>
            <p className="text-gray-500">{selectedData?.codigo}</p>
          </div>

          <Divider />
        </>
      ) : (
        mapData?.features?.map((dato: Feature, index: number) => {
          return (
            <div key={index.toString()} id={index.toString()}>
              <div className="pl-5 flex gap-3 mt-3 mb-3">
                <p className=" text-gray-700">{dato.properties.nombre}</p>
                <p className="text-gray-500">{dato.properties.codigo}</p>
              </div>

              <Divider />
            </div>
          );
        })
      )}
    </div>
  );
}

export default MapSidebar;
