"use client";

import React from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import {
  getLayerStyles,
  getSeatLayerStyles,
  getSeatNumbersStyle,
} from "./layerStyles";
import useMapStore from "@/app/store/mapStore";
import { Seat, StadiumGeoJson } from "@/utils/types/mapTypes";

/* 
  Componente a cargo de la creacion de las capas/layers del mapa.
*/

interface LayersProps {
  allData: StadiumGeoJson;
  filteredSeatData: any[];
}

const Layers: React.FC<LayersProps> = ({ allData, filteredSeatData }) => {
  const { hoveredFeature, selectedFeature, hoveredSeat, selectedSeat } =
    useMapStore();

  const fillLayerStyle = getLayerStyles(hoveredFeature, selectedFeature);
  const seatLayerStyle = getSeatLayerStyles(hoveredSeat, selectedSeat);
  const seatNumbersStyle = getSeatNumbersStyle;

  return (
    <>
      {allData && (
        <Source id="data" type="geojson" data={allData}>
          <Layer {...fillLayerStyle} />
        </Source>
      )}
      {filteredSeatData && filteredSeatData.length > 0 && (
        <Source
          id="seats"
          type="geojson"
          data={{ type: "FeatureCollection", features: filteredSeatData }}
        >
          <Layer {...seatLayerStyle} />
          <Layer {...seatNumbersStyle} />
        </Source>
      )}
    </>
  );
};

export default Layers;
