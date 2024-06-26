import { FillLayer, CircleLayer, SymbolLayer } from "react-map-gl/maplibre";

/* 
  Estilos de cada capa/layer que se agrega al mapa. Son utilizados en el componente MapLayers que se
  encarga de crear las capas.
*/

export const getLayerStyles = (
  hoveredFeature: string | null,
  selectedFeature: string | null
): FillLayer => {
  const baseStyle: FillLayer = {
    id: "data",
    type: "fill",
    source: "data",
    paint: {
      "fill-opacity": 0.5,
    },
  };

  const fillColorExpression = [
    "case",
    ["==", ["get", "id"], hoveredFeature ?? ""],
    "#E6F2FF",
    ["==", ["get", "id"], selectedFeature ?? ""],
    "#E6F2FF", // click color
    "#98CF8B", // default color
  ] as any;

  return {
    ...baseStyle,
    paint: {
      ...baseStyle.paint,
      "fill-color": fillColorExpression,
    },
  };
};

export const getSeatLayerStyles = (
  hoveredSeat: string | null,
  selectedSeat: string[]
): CircleLayer => {
  return {
    id: "seats",
    type: "circle" as const,
    source: "seats",
    paint: {
      "circle-radius": 8,
      "circle-color": [
        "case",
        ["==", ["get", "id"], hoveredSeat ?? ""],
        "#3288bd", // hover color
        ["in", ["get", "id"], ["literal", selectedSeat]],
        "#FF0000", // selected color
        "#C2C3C7", // default color
      ] as any,
    },
  };
};

export const getSeatNumbersStyle: SymbolLayer = {
  id: "seat-labels",
  type: "symbol",
  source: "seats",
  layout: {
    "text-field": ["get", "id"],
    "text-size": 6,
    "text-anchor": "center",
  },
  paint: {
    "text-color": "#000000",
  },
};
