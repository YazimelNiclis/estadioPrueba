"use client";

import * as React from "react";
import Map from "react-map-gl/maplibre";
import type { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";
import { calculateAngle, getSeatSize } from "../../utils/utils";
import { SelectedData, HoverData } from "@/utils/types/mapTypes";
import useMapStore from "@/app/store/mapStore";
import { centralPoint, bounds } from "@/constants/mapConstants";
import "mapbox-gl/dist/mapbox-gl.css";
import Layers from "./MapLayers";
import mapStyle from "../../../public/mapStyle.json";

/* 
  Mapa. Componente a cargo de renderizar el mapa y manejo de interacciones con el mismo.
*/

function MapView() {
  const {
    allData,
    setSelectedData,
    hoveredData,
    setHoveredData,
    hoveredFeature,
    setHoveredFeature,
    selectedFeature,
    setSelectedFeature,
    lastClickedFeature,
    setLastClickedFeature,
    initialView,
    setInitialView,
    seatData,
    filteredSeatData,
    setFilteredSeatData,
    setHoveredSeat,
    selectedSeat,
    setSelectedSeat,
    zoom,
    setZoom,
    isMediumOrLarger,
    setIsMediumOrLarger,
    seatSize,
    setSeatSize
    
  } = useMapStore();

  const mapRef = React.useRef<MapRef>(null);

  // Handler de hover de sectores
  const onHover = React.useCallback(
    (event: MapLayerMouseEvent) => {
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
    },
    [hoveredData, hoveredFeature, selectedFeature]
  );

  
  const handleZoom = (e) => {
    setHoveredData((prev) => ({
      ...prev,
      zoom: e.viewState.zoom.toFixed(4),
    }));
  };

  const handleMapRotation = (
    lngLat: maplibregl.LngLat,
    clickedFeatureId: string | null
  ) => {
    if (clickedFeatureId && clickedFeatureId !== lastClickedFeature) {
      const angle = calculateAngle(lngLat, centralPoint);
      mapRef.current?.rotateTo(angle, {
        duration: 1000,
        center: [lngLat.lng, lngLat.lat],
        zoom: 21.5,
        pitch: 60,
      });
    }
  };

  const resetMap = () => {
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

  // Handler click de sectores
  const onClick = React.useCallback(
    (event: MapLayerMouseEvent) => {
      const { features, lngLat } = event;

      // Chequear si el click sucedio en la capa de asientos
      const layer = features?.find((f) => f.layer.id === "seats");
      if (layer) return;

      const clickedFeatureId = features && features[0]?.properties?.id;
      const clickedFeatureCodigo = features && features[0]?.properties?.codigo;

      // Chequear si el mismo sector fue clickeado otra vez
      if (clickedFeatureId === selectedFeature) {
        return;
      }

      if (features?.length) {
        const feature = features[0]?.properties as SelectedData;
        // Actualizar estado de sector seleccionado
        setSelectedFeature(clickedFeatureId);
        setLastClickedFeature(clickedFeatureId);

        handleMapRotation(lngLat, clickedFeatureId);
        setSelectedData(feature);

        setHoveredFeature(null);
        // Filtrar el geoJSON de asientos para extraer solo los que correspondan al sector
        if (clickedFeatureCodigo) {
          const filteredSeats = seatData.filter(
            (seat) => seat.properties.sector_cod === clickedFeatureCodigo
          );
          setFilteredSeatData(filteredSeats);
        }
      } else {
        setLastClickedFeature(null);
        setSelectedFeature(null);
        resetMap();
        setSelectedData(undefined);
        setFilteredSeatData([]);
        setHoveredFeature(null);
      }
    },
    [lastClickedFeature, selectedFeature]
  );

  const handleSeatClick = React.useCallback(
    (event: MapLayerMouseEvent) => {
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
    },
    [selectedSeat]
  );

  const handleSeatHover = React.useCallback((event: MapLayerMouseEvent) => {
    const { features } = event;
    const seatFeature = features?.find((f) => f.layer.id === "seats");
    const hoveredSeatId = seatFeature?.properties?.id;
    setHoveredSeat(hoveredSeatId || null);
  }, []);


  React.useEffect(() => {
    // Chequear screen size
    const handleResize = () => {
      const mediumOrLarger = window.matchMedia("(min-width: 768px)").matches;
      setIsMediumOrLarger(mediumOrLarger);

      if (isMediumOrLarger) {
        setZoom(16.6);
      } else {
        setZoom(8.5);
      }
    };
    // Setear zoom inicial basado en original screen size
    handleResize();
    // Resize event listener
    window.addEventListener("resize", handleResize);
    // Limpiar event listener al desmontar componente
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const newSeatSize = getSeatSize({ currentZoom: Number(hoveredData.zoom) });
    setSeatSize(newSeatSize);
  }, [hoveredData.zoom]);

  return (
    <div className="w-full md:col-span-3 h-full overflow-auto bg-slate-200 shadow-inner border-r-2 border-r-slate-300">
      <Map
        attributionControl={false}
        ref={mapRef}
        minZoom={17}
        maxZoom={23}
        mapStyle={mapStyle}
        initialViewState={{
          latitude: centralPoint.lat,
          longitude: centralPoint.lng,
          zoom: zoom,
        }}
        onZoom={handleZoom}
        maxBounds={bounds}
        interactiveLayerIds={["data", "seats"]}
        onMouseMove={(e) => {
          if (!selectedFeature) {
            onHover(e);
          }
          handleSeatHover(e);
        }}
        onClick={(e) => {
          onClick(e);
          handleSeatClick(e);
        }}
      >
        <Layers allData={allData} filteredSeatData={filteredSeatData} seatSize={seatSize} />
      </Map>
    </div>
  );
}

export default MapView;
