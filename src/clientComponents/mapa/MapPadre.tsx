'use client';

import React, { useEffect } from 'react';
import useMapStore from '@/app/store/mapStore';
import { SeatsGeoJson, StadiumGeoJson } from '@/utils/types/mapTypes';
import MapDetails from './MapDetails';
import MapSidebar from './MapSidebar';
import MapView from './MapView';

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
    <div className="grid w-full grid-cols-1 screen-h md:h-full md:grid-cols-5">
      <MapView />
      {selectedData ?
        <MapDetails />
      : <MapSidebar />}
    </div>
  );
};

export default MapPadre;
