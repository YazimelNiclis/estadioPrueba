import { range } from "d3-array";
import { scaleQuantile } from "d3-scale";

import type GeoJSON from "geojson";

export function updatePercentiles(
  featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
  accessor: (f: GeoJSON.Feature<GeoJSON.Geometry>) => number
): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
  const { features } = featureCollection;
  const scale = scaleQuantile().domain(features.map(accessor)).range(range(9));
  return {
    type: "FeatureCollection",
    features: features.map((f) => {
      const value = accessor(f);
      const properties = {
        ...f.properties,
        value,
        percentile: scale(value),
      };
      return { ...f, properties };
    }),
  };
}

/**
 * Interface for geographical coordinates.
 */
interface Coordinates {
  lng: number;
  lat: number;
}

/**
 * Calculates the angle between two geographical points.
 * The angle is measured clockwise from the north direction to the direction from point 1 to point 2.
 * 
 * @param point1 - The first geographical point with longitude and latitude.
 * @param point2 - The second geographical point with longitude and latitude.
 * @returns The angle in degrees from 0 to 360.
 */
export const calculateAngle = (point1: Coordinates, point2: Coordinates): number => {
  const { lng: lng1, lat: lat1 } = point1;
  const { lng: lng2, lat: lat2 } = point2;

  // Calculate the differences in coordinates
  const deltaLng = lng2 - lng1;
  
  // Calculate the y component of the angle
  const y = Math.sin(deltaLng) * Math.cos(lat2);
  
  // Calculate the x component of the angle
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
  
  // Calculate the angle in radians and convert it to degrees
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  
  return (angle + 360) % 360;
};


/**
 * Interface for the parameters of the getSeatSize function.
 */
interface SeatSizeParams {
  currentZoom: number;
  minZoom?: number;
  maxZoom?: number;
  minSize?: number;
  maxSize?: number;
}

/**
 * Calculates the seat size based on the current zoom level.
 *
 * @param {SeatSizeParams} params - The parameters for calculating seat size.
 * @returns {number} The calculated seat size.
 */
export const getSeatSize = ({
  currentZoom,
  minZoom = 20,
  maxZoom = 22,
  minSize = 3,
  maxSize = 9,
}: SeatSizeParams): number => {
  if (currentZoom < minZoom) return 0; //minSize;
  if (currentZoom > maxZoom) return maxSize;

  const interpolatedSize =
    minSize +
    ((currentZoom - minZoom) / (maxZoom - minZoom)) * (maxSize - minSize);
  return interpolatedSize;
};