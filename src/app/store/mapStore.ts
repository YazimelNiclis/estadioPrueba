import { create } from "zustand";
import { Seat, HoverData, SelectedData } from "@/utils/types/mapTypes";

interface MapStore {
  allData: any;
  selectedData: SelectedData | undefined;
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
  setAllData: (data: any) => void;
  setSelectedData: (data: SelectedData | undefined) => void;
  setHoveredData: (data: HoverData) => void;
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
}

const useMapStore = create<MapStore>((set) => ({
  allData: null,
  selectedData: undefined,
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
  zoom: 14.5,
  isMediumOrLarger: false,
  seatData: [],
  filteredSeatData: [],
  hoveredSeat: null,
  selectedSeat: [""],
  setAllData: (data) => set({ allData: data }),
  setSelectedData: (data) => set({ selectedData: data }),
  setHoveredData: (data) => set({ hoveredData: data }),
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
}));

export default useMapStore;
