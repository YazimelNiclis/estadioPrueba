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
    console.log(seats, "ALL SEATS");
  }, [data, seats, setAllData, setSeatData]);

  return (
    <div className="w-full h-full min-h-screen md:screen-h grid grid-cols-1 md:grid-cols-5">
      <MapView />
      <MapSidebar />
    </div>
  );
};

export default MapPadre;
