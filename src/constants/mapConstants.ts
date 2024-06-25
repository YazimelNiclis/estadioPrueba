import { LngLatBounds } from "maplibre-gl";

export const centralPoint = { lat: -25.2921546, lng: -57.6573 };

export const mapBounds = new LngLatBounds(
  [-57.6595, -25.2931], // inf. izq
  [-57.655, -25.2912] // sup. der
);

export const bounds: [number, number, number, number] = [
  -57.65912, -25.29317, -57.6556, -25.291,
];
