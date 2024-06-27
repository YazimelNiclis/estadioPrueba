"use client";

import React from "react";
import {
  Source,
  Layer,
  FillLayer,
  SymbolLayer,
  CircleLayer,
} from "react-map-gl/maplibre";
import useMapStore from "@/app/store/mapStore";
import { StadiumGeoJson } from "@/utils/types/mapTypes";

/* 
  Componente a cargo de la creacion de las capas/layers del mapa con sus correspondientes estilos.
  Docs:
    https://visgl.github.io/react-map-gl/docs/api-reference/layer
    https://docs.mapbox.com/help/glossary/style/ 
*/

interface LayersProps {
  allData: StadiumGeoJson | null;
  filteredSeatData: any[];
}

const Layers: React.FC<LayersProps> = ({ allData, filteredSeatData }) => {
  const { hoveredFeature, selectedFeature, hoveredSeat, selectedSeat } =
    useMapStore();

  // Estadio
  const getLayerStyles = React.useMemo(() => {
    const baseStyle: FillLayer = {
      id: "data",
      type: "fill",
      source: "data",
      paint: {
        "fill-opacity": 0.5,
        "fill-color": [
          "case",
          ["==", ["get", "id"], hoveredFeature || ""],
          "#E6F2FF", // hover color
          ["==", ["get", "id"], selectedFeature || ""],
          "#E6F2FF", // click color
          "#98CF8B", // default color
        ],
      },
    };

    return baseStyle;
  }, [hoveredFeature, selectedFeature]);

  // Asientos
  const getSeatLayerStyles: CircleLayer = React.useMemo(() => {
    return {
      id: "seats",
      type: "circle" as const,
      source: "seats",
      paint: {
        "circle-radius": 8,
        "circle-color": [
          "case",
          ["==", ["get", "id"], hoveredSeat || ""],
          "#3288bd", // hover color
          [
            "in",
            ["get", "id"],
            ["literal", selectedSeat.length ? selectedSeat : [""]],
          ],
          "#FF0000", // selected color
          "#C2C3C7", // default color
        ],
      },
    };
  }, [hoveredSeat, selectedSeat]);

  // Numero de asientos
  const getSeatNumbersStyles: SymbolLayer = {
    id: "seat-labels",
    type: "symbol",
    source: "seats",
    layout: {
      "text-field": ["get", "seat"],
      "text-size": 5,
      "text-anchor": "center",
    },
    paint: {
      "text-color": "#000000",
    },
  };

  return (
    <>
      {allData && (
        <Source id="data" type="geojson" data={allData}>
          <Layer {...getLayerStyles} />
        </Source>
      )}
      {filteredSeatData && filteredSeatData.length > 0 && (
        <Source
          id="seats"
          type="geojson"
          data={{ type: "FeatureCollection", features: filteredSeatData }}
        >
          <Layer {...getSeatLayerStyles} />
          <Layer {...getSeatNumbersStyles} />
        </Source>
      )}
    </>
  );
};

export default Layers;
