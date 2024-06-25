import { FillLayer, CircleLayer } from "react-map-gl/maplibre";

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
    ["==", ["get", "id"], hoveredFeature],
    "#E6F2FF", // hover color
    ["==", ["get", "id"], selectedFeature],
    "#E6F2FF", // click color
    "#98CF8B", // default color
  ];

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
    type: "circle",
    paint: {
      "circle-radius": 8,
      "circle-color": [
        "case",
        ["==", ["get", "id"], hoveredSeat],
        "#3288bd", // hover color
        ["in", ["get", "id"], ["literal", selectedSeat]],
        "#FF0000", // selected color
        "#C2C3C7", // default color
      ],
    },
  };
};
