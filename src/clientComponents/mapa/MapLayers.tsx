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
import { HoverData, Seat, StadiumGeoJson } from "@/utils/types/mapTypes";
import { SymbolLayerSpecification } from "maplibre-gl";

/* 
  Componente a cargo de la creacion de las capas/layers del mapa con sus correspondientes estilos.
  Docs:
    https://visgl.github.io/react-map-gl/docs/api-reference/layer
    https://docs.mapbox.com/help/glossary/style/ 
*/

interface LayersProps {
  allData: StadiumGeoJson | null;
}

const Layers: React.FC<LayersProps> = ({ allData }) => {
  const { selected, hovered, seatData } = useMapStore();
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
          ["==", ["get", "id"], hovered.feature || ""],
          "#E6F2FF", // hover color
          ["==", ["get", "id"], selected.feature || ""],
          "#E6F2FF", // click color
          "#98CF8B", // default color
        ],
      },
    };

    return baseStyle;
  }, [hovered.feature, selected.feature]);

  // Asientos
  const getSeatLayerStyles = React.useMemo(() => {
    return {
      id: "seats",
      type: "circle",
      source: "seats",
      paint: {
        "circle-radius": 5, //seatData.size,
        "circle-color": [
          "case",
          ["==", ["get", "id"], hovered.seat || ""],
          "#3288bd", // hover color
          [
            "in",
            ["get", "id"],
            ["literal", selected.seats.length ? selected.seats : [""]],
          ],
          "#FF0000", // selected color
          "#C2C3C7", // default color
        ],
      },
    };
  }, [seatData.size, hovered.seat, selected.seats]);

  // Numero de asientos
  const getSeatNumbersStyles: SymbolLayer = {
    id: "seat-labels",
    type: "symbol",
    source: "seats",
    layout: {
      "text-field": ["get", "seat"],
      "text-size": 5, //seatData.size,
      "text-anchor": "center",
      "text-allow-overlap": true,
    },
    paint: {
      "text-color": "#000000",
    },
  };

  // Codigo de sectores
  const symbolLayerStyles: SymbolLayerSpecification = {
    id: "labels",
    type: "symbol",
    source: "data",
    layout: {
      "text-field": ["get", "desc"],
      "text-size": 10,
      "text-anchor": "center",
      "text-padding": 10,
      "text-allow-overlap": false,
    },
    paint: {
      "text-color": "#000000",
      "text-halo-color": "#ffffff",
      "text-halo-width": 6,
    },
  };

  return (
    <>
      {allData && (
        <Source id="data" type="geojson" data={allData}>
          <Layer {...getLayerStyles} />
          <Layer {...symbolLayerStyles} />
        </Source>
      )}
      {seatData.filtered && seatData.filtered.length > 0 && (
        <Source
          id="seats"
          type="geojson"
          data={{ type: "FeatureCollection", features: seatData.filtered }}
        >
          <Layer {...getSeatLayerStyles} />
          <Layer {...getSeatNumbersStyles} />
        </Source>
      )}
    </>
  );
};

export default Layers;
