'use client';

import React, { useEffect } from 'react';
import MapView from './MapView';
import { SeatsGeoJson, StadiumGeoJson } from '@/utils/types/mapTypes';
import MapSidebar from './MapSidebar';
import MapDetails from './MapDetails';

import useMapStore from '@/app/store/mapStore';
interface MapPadreProps {
    data: StadiumGeoJson;
    seats: SeatsGeoJson;
}

const MapPadre: React.FC<MapPadreProps> = ({ data, seats }) => {
    const { setAllData, setSeatData, selectedData } = useMapStore();
    const hola = 0;

    useEffect(() => {
        setAllData(data);
        setSeatData(seats.features);
    }, [data, seats, setAllData, setSeatData]);

    return (
        <div className="screen-h grid w-full grid-cols-1 md:h-full md:grid-cols-5">
            <MapView />
            {selectedData ? <MapDetails /> : <MapSidebar />}
        </div>
    );
};

export default MapPadre;
