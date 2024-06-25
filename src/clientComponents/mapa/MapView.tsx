"use client";

import * as React from "react";
import Map from "react-map-gl/maplibre";
import type { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";
import { calculateAngle } from "../../utils/utils";
import { SelectedData, HoverData } from "@/utils/types/mapTypes";
import useMapStore from "@/app/store/mapStore";
import { centralPoint, bounds } from "@/constants/mapConstants";
import "mapbox-gl/dist/mapbox-gl.css";
import Layers from "./MapLayers";

function MapView() {
  const {
    allData,
    selectedData,
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
    hoveredSeat,
    setHoveredSeat,
    selectedSeat,
    setSelectedSeat,
    zoom,
    setZoom,
    isMediumOrLarger,
    setIsMediumOrLarger,
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
      const newData: HoverData = {
        ...hoveredData,
        lat: lngLat.lat.toFixed(4),
        lng: lngLat.lng.toFixed(4),
        sector: features![0]?.properties?.nombre || "Ninguno",
      };
      setHoveredData(newData);
    },
    [hoveredData, selectedFeature]
  );

  //Handler de seleccion de sectores
  const handleFeatureSelection = React.useCallback(
    (clickedFeatureId: string | null) => {
      if (selectedFeature === clickedFeatureId) {
        setLastClickedFeature(null);
        setSelectedFeature(null);
        setFilteredSeatData([]);
      } else {
        setSelectedFeature(clickedFeatureId);
        setLastClickedFeature(clickedFeatureId);
      }
    },
    [selectedFeature]
  );

  const handleMapRotation = (
    lngLat: maplibregl.LngLat,
    clickedFeatureId: string | null
  ) => {
    if (clickedFeatureId && clickedFeatureId !== lastClickedFeature) {
      const angle = calculateAngle(lngLat, centralPoint);
      mapRef.current?.rotateTo(angle, {
        duration: 1000,
        //@ts-ignore
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
    }
  };

  // Handler click de sectores
  const onClick = React.useCallback(
    (event: MapLayerMouseEvent) => {
      const { features, lngLat } = event;

      const clickedFeatureId = features && features[0]?.properties?.id;
      const clickedFeatureCodigo = features && features[0]?.properties?.codigo;

      if (clickedFeatureId === selectedFeature) {
        return;
      }

      if (features?.length) {
        const feature = features[0]?.properties as SelectedData;
        handleFeatureSelection(clickedFeatureId);
        handleMapRotation(lngLat, clickedFeatureId);
        setSelectedData(feature);

        // Filtrar el geoJSON de asientos para extraer solo los que correspondan al sector
        if (clickedFeatureCodigo) {
          const filteredSeats = seatData.filter(
            (seat) => seat.properties.sector_cod === clickedFeatureCodigo
          );
          console.log(clickedFeatureCodigo, "feat cod");
          console.log(filteredSeats, "filteredSeats");
          setFilteredSeatData(filteredSeats);
        }
      } else {
        setLastClickedFeature(null);
        setSelectedFeature(null);
        resetMap();
        setSelectedData(undefined);
        setFilteredSeatData([]);
      }
    },
    [lastClickedFeature, selectedFeature]
  );

  const handleSeatClick = React.useCallback(
    (event: MapLayerMouseEvent) => {
      const { features } = event;
      const seatFeature = features?.find((f) => f.layer.id === "seats");
      const clickedSeatId = seatFeature?.properties?.id;
      console.log(clickedSeatId, "clicked Seat");

      if (clickedSeatId) {
        setSelectedSeat((prevSelectedSeats: string[]) => {
          if (prevSelectedSeats.includes(clickedSeatId)) {
            return prevSelectedSeats.filter(
              (seatId) => seatId !== clickedSeatId
            );
          } else {
            return [...prevSelectedSeats, clickedSeatId];
          }
        });
      }
      console.log(selectedSeat, "selected seats");
    },
    [setSelectedSeat, selectedSeat]
  );

  const handleSeatHover = React.useCallback((event: MapLayerMouseEvent) => {
    const { features } = event;
    const seatFeature = features?.find((f) => f.layer.id === "seats");
    const hoveredSeatId = seatFeature?.properties?.id;
    setHoveredSeat(hoveredSeatId || null);
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      const mediumOrLarger = window.matchMedia("(min-width: 768px)").matches;
      setIsMediumOrLarger(mediumOrLarger);

      if (isMediumOrLarger) {
        setZoom(16.6);
      } else {
        setZoom(8.5);
      }
    };
    // Setear zoom inicial basado en original screen sizde
    handleResize();
    // Resize event listener
    window.addEventListener("resize", handleResize);
    // Limpiar event listener al desmontar componente
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-2/3 overflow-auto bg-slate-200 shadow-inner border-r-2 border-r-slate-300">
      <Map
        attributionControl={false}
        ref={mapRef}
        mapStyle="https://demotiles.maplibre.org/style.json"
        initialViewState={{
          latitude: centralPoint.lat,
          longitude: centralPoint.lng,
          zoom: zoom,
        }}
        onZoom={(e) => e.viewState.zoom.toFixed(4)}
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
        <Layers allData={allData} filteredSeatData={filteredSeatData} />
      </Map>
    </div>
  );
}

export default MapView;
