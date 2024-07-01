import {
  MapLayerMouseEvent,
  MapRef,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import { LngLat } from "maplibre-gl";
import { calculateAngle } from "@/utils/utils";
import { HoverData, SelectedFeatureProperties } from "@/utils/types/mapTypes";
import { centralPoint } from "@/constants/mapConstants";
import useMapStore from "@/app/store/mapStore";

const {
  setSelectedData,
  setHoveredData,
  setHoveredFeature,
  setSelectedFeature,
  setLastClickedFeature,
  setFilteredSeatData,
  setSelectedSeat,
  setPopupInfo,
  setHoveredSeat,
} = useMapStore.getState();

// Handler hover sectores
export const onHover = (
  event: MapLayerMouseEvent,
  hoveredFeature: string | null,
  selectedFeature: string | null,
  hoveredData: HoverData
) => {
  const { features } = event;
  const hoveredFeatureId = features && features[0]?.properties?.id;

  if (hoveredFeatureId == hoveredFeature) {
    return;
  }
  if (selectedFeature && hoveredFeatureId === selectedFeature) {
    setHoveredFeature(null);
  } else {
    setHoveredFeature(hoveredFeatureId || null);
  }

  const { lngLat } = event;
  const newData: Partial<HoverData> = {
    ...hoveredData,
    lat: lngLat.lat.toFixed(4),
    lng: lngLat.lng.toFixed(4),
    sector: features![0]?.properties?.nombre || "Ninguno",
  };
  setHoveredData(() => newData);
};

export const handleZoom = (e: ViewStateChangeEvent) => {
  setHoveredData((prev) => ({
    ...prev,
    zoom: e.viewState.zoom.toFixed(4),
  }));
};

export const handleMapRotation = (
  mapRef: React.RefObject<MapRef>,
  lngLat: LngLat,
  clickedFeatureId: string | null,
  lastClickedFeature: string | null
) => {
  if (clickedFeatureId && clickedFeatureId !== lastClickedFeature) {
    const angle = calculateAngle(lngLat, centralPoint);
    mapRef.current?.rotateTo(angle, {
      duration: 1000,
      // @ts-ignore
      center: [lngLat.lng, lngLat.lat],
      zoom: 20.5,
      pitch: 60,
    });
  }
};

export const resetMap = (
  mapRef: React.RefObject<MapRef>,
  initialView: any,
  zoom: number
) => {
  if (initialView) {
    mapRef.current?.easeTo({
      duration: 1000,
      center: initialView.center,
      zoom: initialView.zoom,
      pitch: initialView.pitch,
      bearing: initialView.bearing,
    });
  } else {
    // Temporal fix
    mapRef.current?.easeTo({
      duration: 1000,
      center: [-57.6573, -25.2921546],
      zoom: zoom,
    });
  }
};

// Handler click sectores
export const handleSectorClick = (
  event: MapLayerMouseEvent,
  selectedFeature: string | null,
  lastClickedFeature: string | null,
  seatData: any[],
  mapRef: React.RefObject<MapRef>,
  initialView: any,
  zoom: number
) => {
  const { features, lngLat } = event;

  // Chequear si el click sucedio en la capa de asientos
  const layer = features?.find((f) => f.layer.id === "seats");
  if (layer) return;

  const clickedFeatureId = features && features[0]?.properties?.id;
  const clickedFeatureCodigo = features && features[0]?.properties?.codigo;

  // Filtrar el geoJSON de asientos para extraer solo los que correspondan al sector
  if (clickedFeatureCodigo) {
    const filteredSeats = seatData.filter(
      (seat) => seat.properties.sector_cod === clickedFeatureCodigo
    );
    setFilteredSeatData(filteredSeats);
  }

  // Chequear si el mismo sector fue clickeado otra vez
  if (clickedFeatureId === selectedFeature) {
    return;
  }

  if (features?.length) {
    // Actualizar estado de sector seleccionado
    setSelectedFeature(clickedFeatureId);
    setLastClickedFeature(clickedFeatureId);
    handleMapRotation(mapRef, lngLat, clickedFeatureId, lastClickedFeature);

    setSelectedSeat([]);

    setHoveredFeature(null);
  } else {
    setLastClickedFeature(null);
    setSelectedFeature(null);
    resetMap(mapRef, initialView, zoom);
    setSelectedData(null);
    setFilteredSeatData([]);
    setHoveredFeature(null);
    setSelectedSeat([""]);
  }
};

export const handleSeatClick = (
  event: MapLayerMouseEvent,
  selectedSeat: string[]
) => {
  const { features } = event;
  const seatFeature = features?.find((f) => f.layer.id === "seats");
  const clickedSeatId = seatFeature?.properties?.id;

  if (clickedSeatId) {
    if (selectedSeat.length >= 1) {
      // Si el asiento ya esta seleccionado, remover el asiento
      if (selectedSeat.includes(clickedSeatId)) {
        const removeSeat = selectedSeat.filter(
          (seatId) => seatId !== clickedSeatId
        );
        setSelectedSeat(removeSeat);
        return removeSeat;
      } else {
        // Si no pertenece al array de elegidos, agregar el asiento
        const addNewSeat = [...selectedSeat, clickedSeatId];
        setSelectedSeat(addNewSeat);
        return addNewSeat;
      }
    } else {
      const addSeat = [clickedSeatId];
      setSelectedSeat(addSeat);
      return addSeat;
    }
  }
};

export const handleSeatHover = (event: MapLayerMouseEvent) => {
  const { features, lngLat } = event;
  const seatFeature = features?.find((f) => f.layer.id === "seats");
  const hoveredSeatId = seatFeature?.properties?.id;
  const hoveredSeatNumber = seatFeature?.properties?.seat;
  const hoveredSeatRow = seatFeature?.properties?.row;

  if (hoveredSeatId && lngLat) {
    setPopupInfo({
      seatId: hoveredSeatNumber as string,
      seatRow: hoveredSeatRow as string,
      seatPrice: undefined,
      lngLat: [lngLat.lng, lngLat.lat],
    });
  } else {
    setPopupInfo(null);
  }
  setHoveredSeat(hoveredSeatId || null);
};
