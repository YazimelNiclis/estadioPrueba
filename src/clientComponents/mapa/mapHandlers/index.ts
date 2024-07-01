import { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";
import { LngLat } from "maplibre-gl";
import { calculateAngle } from "@/utils/utils";
import { HoverData, Seat, SelectedData } from "@/utils/types/mapTypes";
import { centralPoint } from "@/constants/mapConstants";
import useMapStore from "@/app/store/mapStore";

const { setSelected, setHovered, setSeatData, setPopupInfo } =
  useMapStore.getState();

// Handler hover sectores
export const onHover = (
  event: MapLayerMouseEvent,
  hovered: {
    data: HoverData;
    feature: string | null;
    seat: string | null;
  },
  selected: {
    data: SelectedData | undefined;
    feature: string | null;
    lastClickedFeature: string | null;
    seats: string[];
  }
) => {
  const { features } = event;
  const hoveredFeatureId = features && features[0]?.properties?.id;

  if (hoveredFeatureId == hovered.feature) {
    return;
  }
  if (selected.feature && hoveredFeatureId === selected.feature) {
    setHovered({ feature: null });
  } else {
    setHovered({ feature: hoveredFeatureId || null });
  }

  const { lngLat } = event;
  const newData: HoverData = {
    ...hovered.data,
    lat: lngLat.lat.toFixed(4),
    lng: lngLat.lng.toFixed(4),
    sector: features![0]?.properties?.nombre || "Ninguno",
  };
  setHovered({ data: newData });
};

export const handleZoom = (e) => {
  setHovered((prev) => ({
    data: {
      ...prev.data,
      zoom: e.viewState.zoom.toFixed(4),
    },
  }));
};

export const handleMapRotation = (
  mapRef: React.RefObject<MapRef>,
  lngLat: LngLat,
  clickedFeatureId: string | null,
  selected: {
    data: SelectedData | undefined;
    feature: string | null;
    lastClickedFeature: string | null;
    seats: string[];
  }
) => {
  if (clickedFeatureId && clickedFeatureId !== selected.lastClickedFeature) {
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
  selected: {
    data: SelectedData | undefined;
    feature: string | null;
    lastClickedFeature: string | null;
    seats: string[];
  },
  seatData: {
    allSeats: Seat[];
    filtered: any[];
    size: number;
  },
  mapRef: React.RefObject<MapRef>,
  mapView: {
    initialView: any;
    zoom: number;
    isMediumOrLarger: boolean;
  }
) => {
  const { features, lngLat } = event;

  // Chequear si el click sucedio en la capa de asientos
  const layer = features?.find((f) => f.layer.id === "seats");
  if (layer) return;

  const clickedFeatureId = features && features[0]?.properties?.id;
  const clickedFeatureCodigo = features && features[0]?.properties?.codigo;

  // Filtrar el geoJSON de asientos para extraer solo los que correspondan al sector
  if (clickedFeatureCodigo) {
    const filteredSeats = seatData.allSeats.filter(
      (seat) => seat.properties.sector_cod === clickedFeatureCodigo
    );
    setSeatData({ filtered: filteredSeats });
  }

  // Chequear si el mismo sector fue clickeado otra vez
  if (clickedFeatureId === selected.feature) {
    return;
  }

  if (features?.length) {
    const feature = features[0]?.properties as SelectedData;
    // Actualizar estado de sector seleccionado
    setSelected({
      feature: clickedFeatureId,
      lastClickedFeature: clickedFeatureId,
    });

    handleMapRotation(mapRef, lngLat, clickedFeatureId, selected);

    setSelected({
      data: feature,
      seats: [],
    });

    setHovered({ feature: null });
  } else {
    setSelected({
      lastClickedFeature: null,
      feature: null,
    });
    resetMap(mapRef, mapView.initialView, mapView.zoom);
    setSelected({
      data: undefined,
      seats: [""],
    });
    setSeatData({ filtered: [] });
    setHovered({ feature: null });
  }
};

export const handleSeatClick = (
  event: MapLayerMouseEvent,
  selected: {
    data: SelectedData | undefined;
    feature: string | null;
    lastClickedFeature: string | null;
    seats: string[];
  }
) => {
  const { features } = event;
  const seatFeature = features?.find((f) => f.layer.id === "seats");
  const clickedSeatId = seatFeature?.properties?.id;

  if (clickedSeatId) {
    if (selected.seats.length >= 1) {
      // Si el asiento ya esta seleccionado, remover el asiento
      if (selected.seats.includes(clickedSeatId)) {
        const removeSeat = selected.seats.filter(
          (seatId) => seatId !== clickedSeatId
        );
        setSelected({ seats: removeSeat });
        return removeSeat;
      } else {
        // Si no pertenece al array de elegidos, agregar el asiento
        const addNewSeat = [...selected.seats, clickedSeatId];
        setSelected({ seats: addNewSeat });
        return addNewSeat;
      }
    } else {
      const addSeat = [clickedSeatId];
      setSelected({ seats: addSeat });
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
  setHovered({ seat: hoveredSeatId || null });
};
