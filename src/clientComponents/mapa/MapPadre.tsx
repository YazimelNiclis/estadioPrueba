"use client";

import React, { useEffect } from "react";
import MapView from "./MapView";
import useMapStore from "@/app/store/mapStore";
import { SeatsGeoJson, StadiumGeoJson } from "@/utils/types/mapTypes";
import MapSidebar from "./MapSidebar";
interface MapPadreProps {
  data: StadiumGeoJson;
  seats: SeatsGeoJson;
}

const MapPadre: React.FC<MapPadreProps> = ({ data, seats }) => {
  //manejar estados aquiii

  const { setAllData, setSeatData } = useMapStore();

  useEffect(() => {
    setAllData(data);
    setSeatData(seats.features);
    console.log(seats.features, "ALL SEATS");
  }, [data, seats, setAllData, setSeatData]);

  return (
    <div className="flex flex-1 max-h-[45vw] w-full h-full">
      <MapView />
      <MapSidebar />
    </div>
  );
};

export default MapPadre;
