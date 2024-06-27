//Asientos geoJSON
export interface Seat {
  type: string;
  properties: {
    id: number;
    place_id: number;
    sector_cod: string;
    row: number;
    seat: number;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

export type Point = {
  type: "Point";
  coordinates: number[];
};
export interface SeatsGeoJson {
  type: "FeatureCollection";
  name: string;
  crs: {
    type: "name";
    properties: {
      name: string;
    };
  };
  features: Seat[];
}

export interface popup {
  seatId: string;
  seatRow: string;
  seatPrice: number | undefined;
  lngLat: [number, number];
}
//Sector
export interface HoverData {
  lng: string;
  lat: string;
  zoom: string;
  sector: string;
}
export interface SelectedData {
  codigo: number;
  desc: string;
  id: number;
  nombre: string;
  place_id: number;
}

//Estadio geoJSON
export type MultiPolygon = {
  type: "MultiPolygon";
  coordinates: number[][][][];
};
export interface FeatureProperties {
  id: number;
  nombre: string;
  place_id: number;
  desc: string;
  codigo: string;
}
export interface Feature {
  type: "Feature";
  properties: FeatureProperties;
  geometry: MultiPolygon;
}
export interface StadiumGeoJson {
  type: "FeatureCollection";
  name: string;
  crs: {
    type: "name";
    properties: {
      name: string;
    };
  };
  features: Feature[];
}
