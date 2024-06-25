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
