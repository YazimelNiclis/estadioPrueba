import { create } from "zustand";
import {
  Seat,
  HoverData,
  StadiumGeoJson,
  FeatureProperties,
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
  selectedData: SelectedFeatureProperties | null;
  hoveredData: HoverData;
  hoveredFeature: string | null;
  selectedFeature: string | null;
  lastClickedFeature: string | null;
  initialView: any;
  zoom: number;
  isMediumOrLarger: boolean;
  seatData: Seat[];
  filteredSeatData: any[];
  hoveredSeat: string | null;
  selectedSeat: string[];
  seatSize: number | null;
  popupInfo: popup | null;
  setAllData: (data: StadiumGeoJson) => void;
  setSelectedData: (data: SelectedFeatureProperties | null) => void;
  setHoveredData: (update: (prev: HoverData) => Partial<HoverData>) => void;
  setHoveredFeature: (feature: string | null) => void;
  setSelectedFeature: (feature: string | null) => void;
  setLastClickedFeature: (feature: string | null) => void;
  setInitialView: (view: any) => void;
  setZoom: (zoom: number) => void;
  setIsMediumOrLarger: (value: boolean) => void;
  setSeatData: (data: Seat[]) => void;
  setFilteredSeatData: (data: any[]) => void;
  setHoveredSeat: (seat: string | null) => void;
  setSelectedSeat: (seat: string[]) => void;
  setSeatSize: (size: number | null) => void;
  setPopupInfo: (data: popup | null) => void;
}

const useMapStore = create<MapStore>((set) => ({
  allData: null,
  selectedData: null,
  hoveredData: {
    lat: "",
    lng: "",
    sector: "Ninguno",
    zoom: "",
  },
  hoveredFeature: null,
  selectedFeature: null,
  lastClickedFeature: null,
  initialView: null,
  zoom: 17.5,
  isMediumOrLarger: false,
  seatData: [],
  filteredSeatData: [],
  hoveredSeat: null,
  selectedSeat: [""],
  seatSize: 0,
  popupInfo: null,
  setAllData: (data) => set({ allData: data }),
  setSelectedData: (data) => set({ selectedData: data }),
  setHoveredData: (update) =>
    set((state) => ({
      hoveredData: {
        ...state.hoveredData,
        ...update(state.hoveredData),
      },
    })),
  setHoveredFeature: (feature) => set({ hoveredFeature: feature }),
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),
  setLastClickedFeature: (feature) => set({ lastClickedFeature: feature }),
  setInitialView: (view) => set({ initialView: view }),
  setZoom: (zoom) => set({ zoom }),
  setIsMediumOrLarger: (value) => set({ isMediumOrLarger: value }),
  setSeatData: (data) => set({ seatData: data }),
  setFilteredSeatData: (data) => set({ filteredSeatData: data }),
  setHoveredSeat: (seat) => set({ hoveredSeat: seat }),
  setSelectedSeat: (seat) => set({ selectedSeat: seat }),
  setSeatSize: (size) => set({ seatSize: size }),
  setPopupInfo: (data) => set({ popupInfo: data }),
}));

export default useMapStore;
