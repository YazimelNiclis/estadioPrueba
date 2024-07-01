"use client";

import React, { useEffect } from "react";
import MapView from "./MapView";
import useMapStore from "@/app/store/mapStore";
import { SeatsGeoJson, StadiumGeoJson } from "@/utils/types/mapTypes";
import MapSidebar from "./MapSidebar";
import MapDetails from "./MapDetails";
interface MapPadreProps {
  data: StadiumGeoJson;
  seats: SeatsGeoJson;
}

const MapPadre: React.FC<MapPadreProps> = ({ data, seats }) => {
  const { setAllData, setSeatData, selectedData } = useMapStore();

  useEffect(() => {
    setAllData(data);
    setSeatData(seats.features);
  }, [data, seats, setAllData, setSeatData]);

  return (
    <div className="w-full md:h-full screen-h grid grid-cols-1 md:grid-cols-5">
      <MapView />
      {selectedData ? <MapDetails /> : <MapSidebar />}
    </div>
  );
};

export default MapPadre;
