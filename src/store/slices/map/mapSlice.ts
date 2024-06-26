import { createSlice, PayloadAction, UnknownAction } from "@reduxjs/toolkit";

interface HoverData {
  lng: string;
  lat: string;
  zoom: string;
  sector: string;
}

interface SelectedData {
  codigo: number;
  desc: string;
  id: number;
  nombre: string;
  place_id: number;
}

interface MapState {
  hoveredData: HoverData;
  selectedData?: SelectedData;
  hoveredFeature: string | null;
  selectedFeature: string | null;
  lastClickedFeature: string | null;
  seatData: any[];
  filteredSeatData: any[];
  hoveredSeat: string | null;
  selectedSeat: string[];
  initialView: any;
}

const initialState: MapState = {
  hoveredData: {
    lat: "",
    lng: "",
    zoom: "",
    sector: "Ninguno",
  },
  selectedData: undefined,
  hoveredFeature: null,
  selectedFeature: null,
  lastClickedFeature: null,
  seatData: [],
  filteredSeatData: [],
  hoveredSeat: null,
  selectedSeat: [""],
  initialView: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setHoveredData: (state, action: PayloadAction<HoverData>) => {
      state.hoveredData = action.payload;
    },
    setSelectedData: (
      state,
      action: PayloadAction<SelectedData | undefined>
    ) => {
      state.selectedData = action.payload;
    },
    setHoveredFeature: (state, action: PayloadAction<string | null>) => {
      state.hoveredFeature = action.payload;
    },
    setSelectedFeature: (state, action: PayloadAction<string | null>) => {
      state.selectedFeature = action.payload;
    },
    setLastClickedFeature: (state, action: PayloadAction<string | null>) => {
      state.lastClickedFeature = action.payload;
    },
    setSeatData: (state, action: PayloadAction<any[]>) => {
      state.seatData = action.payload;
    },
    setFilteredSeatData: (state, action: PayloadAction<any[]>) => {
      state.filteredSeatData = action.payload;
    },
    setHoveredSeat: (state, action: PayloadAction<string | null>) => {
      state.hoveredSeat = action.payload;
    },
    setSelectedSeat: (state, action: PayloadAction<string[]>) => {
      state.selectedSeat = action.payload;
    },
    setInitialView: (state, action: PayloadAction<any>) => {
      state.initialView = action.payload;
    },
  },
});

export const {
  setHoveredData,
  setSelectedData,
  setHoveredFeature,
  setSelectedFeature,
  setLastClickedFeature,
  setSeatData,
  setFilteredSeatData,
  setHoveredSeat,
  setSelectedSeat,
  setInitialView,
} = mapSlice.actions;

export default mapSlice.reducer;
