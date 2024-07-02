"use client";

import * as React from "react";
import Map from "react-map-gl/maplibre";
import { LngLat, StyleSpecification } from "maplibre-gl";
import type { MapRef } from "react-map-gl/maplibre";
import { getSeatSize } from "../../utils/utils";
import { FeatureProperties } from "@/utils/types/mapTypes";
import useMapStore from "@/app/store/mapStore";
import { centralPoint, bounds } from "@/constants/mapConstants";
import "mapbox-gl/dist/mapbox-gl.css";
import Layers from "./MapLayers";
import { centroid } from "@turf/turf";
import mapStyle from "../../../public/mapStyle.json";
import SeatPricePopup from "./SeatPricePopup";
import {
  onHover,
  handleMapRotation,
  handleSectorClick,
  handleSeatClick,
  handleSeatHover,
  handleZoom,
  resetMap,
  zoomToFeature,
} from "./mapHandlers";

/* 
  Mapa. Componente a cargo de renderizar el mapa y manejo de interacciones con el mismo.
*/

function MapView() {
  const {
    allData,
    hoveredData,
    selected,
    hovered,
    mapView,
    setMapView,
    seatData,
    setSeatData,
    popupInfo,
    setPopupInfo,
  } = useMapStore();

  const mapRef = React.useRef<MapRef>(null);

  React.useEffect(() => {
    // Chequear screen size
    const handleResize = () => {
      const mediumOrLarger = window.matchMedia("(min-width: 768px)").matches;
      setMapView({ isMediumOrLarger: mediumOrLarger });

      if (mapView.isMediumOrLarger) {
        setMapView({ zoom: 16.6 });
      } else {
        setMapView({ zoom: 8.5 });
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
    const map = mapRef.current?.getMap();
    if (!map || mapView.initialView) return;

    setMapView({
      initialView: {
        center: map.getCenter().toArray(),
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      },
    });
  }, [mapRef.current]);

  React.useEffect(() => {
    if (selected.data) {
      zoomToFeature(selected.data.featureProperties, allData, mapRef, selected);
    } /* else {
      resetMap(mapRef, mapView);
    } */
  }, [selected.data, selected]);

  React.useEffect(() => {
    const newSeatSize = getSeatSize({ currentZoom: Number(hoveredData.zoom) });
    setSeatData({ size: newSeatSize });
  }, [hoveredData.zoom]);

  return (
    <div className="w-full md:col-span-3 h-full overflow-auto bg-slate-200 shadow-inner border-r-2 border-r-slate-300">
      <Map
        attributionControl={false}
        ref={mapRef}
        minZoom={17}
        maxZoom={23}
        mapStyle={mapStyle as StyleSpecification}
        initialViewState={{
          latitude: centralPoint.lat,
          longitude: centralPoint.lng,
          zoom: mapView.zoom,
        }}
        onZoom={handleZoom}
        maxBounds={bounds}
        interactiveLayerIds={["data", "seats"]}
        onMouseMove={(e) => {
          if (!selected.feature) {
            onHover(e, hoveredData, hovered, selected);
          }
          handleSeatHover(e);
        }}
        onClick={(e) => {
          handleSectorClick(e, selected, seatData, mapRef, mapView);
          handleSeatClick(e, selected);
        }}
      >
        <Layers allData={allData} />
        {popupInfo && (
          <SeatPricePopup popupInfo={popupInfo} setPopupInfo={setPopupInfo} />
        )}
      </Map>
    </div>
  );
}

export default MapView;
