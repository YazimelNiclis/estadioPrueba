import { create } from "zustand";
import {
  Seat,
  HoverData,
  StadiumGeoJson,
  popup,
  SelectedFeatureProperties,
} from "@/utils/types/mapTypes";

/* 
  Zustand map store.
  Con zustand puede haber mas de un store.
*/
/* 
  La unica herramienta que se necesita es la funcion create de zustand. 
  Se declara la store, incluyendo el valor (o estado) y las funciones que modifican al estado.
*/

interface MapStore {
  allData: StadiumGeoJson | null;
  hoveredData: HoverData;
  seatData: {
    allSeats: Seat[];
    filtered: any[];
    size: number;
  };
  selected: {
    data: SelectedFeatureProperties | null;
    feature: string | null;
    lastClickedFeature: string | null;
    seats: string[];
  };
  hovered: {
    feature: string | null;
    seat: string | null;
  };
  mapView: {
    initialView: any;
    zoom: number;
    isMediumOrLarger: boolean;
  };
  popupInfo: popup | null;
  setAllData: (data: StadiumGeoJson) => void;
  setHoveredData: (update: (prev: HoverData) => Partial<HoverData>) => void;
  setSeatData: (update: Partial<MapStore["seatData"]>) => void;
  setSelected: (selected: Partial<MapStore["selected"]>) => void;
  setHovered: (hovered: Partial<MapStore["hovered"]>) => void;
  setMapView: (update: Partial<MapStore["mapView"]>) => void;
  setPopupInfo: (data: popup | null) => void;
}

const useMapStore = create<MapStore>((set) => ({
  allData: null,
  hoveredData: {
    lat: "",
    lng: "",
    sector: "Ninguno",
    zoom: "",
  },
  seatData: {
    allSeats: [],
    filtered: [],
    size: 0,
  },
  selected: {
    data: null,
    feature: null,
    lastClickedFeature: null,
    seats: [""],
  },
  hovered: {
    feature: null,
    seat: null,
  },
  mapView: {
    initialView: null,
    zoom: 17.5,
    isMediumOrLarger: false,
  },
  popupInfo: null,
  setAllData: (data) => set({ allData: data }),
  setHoveredData: (update) =>
    set((state) => ({
      hoveredData: {
        ...state.hoveredData,
        ...update(state.hoveredData),
      },
    })),
  setSeatData: (update) =>
    set((state) => ({
      seatData: { ...state.seatData, ...update },
    })),
  setSelected: (selected) =>
    set((state) => ({
      selected: {
        ...state.selected,
        ...selected,
      },
    })),
  setHovered: (hovered) =>
    set((state) => ({
      hovered: {
        ...state.hovered,
        ...hovered,
      },
    })),
  setMapView: (update) =>
    set((state) => ({
      mapView: { ...state.mapView, ...update },
    })),
  setPopupInfo: (data) => set({ popupInfo: data }),
}));

export default useMapStore;
