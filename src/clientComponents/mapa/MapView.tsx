'use client';

import { centroid } from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LngLat, StyleSpecification } from 'maplibre-gl';
import * as React from 'react';
import { NavigationControl } from 'react-map-gl';
import Map from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import useMapStore from '@/app/store/mapStore';
import { bounds, centralPoint } from '@/constants/mapConstants';
import { FeatureProperties } from '@/utils/types/mapTypes';
import mapStyle from '../../../public/mapStyle.json';
import { getSeatSize } from '../../utils/utils';
import Layers from './MapLayers';
import SeatPricePopup from './SeatPricePopup';
import {
  handleMapRotation,
  handleSeatClick,
  handleSeatHover,
  handleSectorClick,
  handleZoom,
  onHover,
  resetMap
} from './mapHandlers';

/* 
  Mapa. Componente a cargo de renderizar el mapa y manejo de interacciones con el mismo.
*/

function MapView() {
  const {
    allData,
    selectedData,
    hoveredData,
    hoveredFeature,
    selectedFeature,
    lastClickedFeature,
    initialView,
    setInitialView,
    seatData,
    filteredSeatData,
    selectedSeat,
    zoom,
    setZoom,
    isMediumOrLarger,
    setIsMediumOrLarger,
    seatSize,
    setSeatSize,
    popupInfo,
    setPopupInfo,
    lastZoom
  } = useMapStore();

  const mapRef = React.useRef<MapRef>(null);

  React.useEffect(() => {
    // Chequear screen size
    const handleResize = () => {
      const mediumOrLarger = window.matchMedia('(min-width: 768px)').matches;
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
    window.addEventListener('resize', handleResize);
    // Limpiar event listener al desmontar componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || initialView) return;

    setInitialView({
      center: map.getCenter().toArray(),
      zoom: map.getZoom(),
      pitch: map.getPitch(),
      bearing: map.getBearing()
    });
  }, [mapRef.current]);

  React.useEffect(() => {
    const zoomToFeature = (selectedFeature: FeatureProperties) => {
      const feature = allData?.features.find(
        f => f.properties.id === selectedFeature.id
      );
      if (feature) {
        const centroidCoordinates = centroid(feature).geometry.coordinates;
        const lngLat = new LngLat(
          centroidCoordinates[0],
          centroidCoordinates[1]
        );
        handleMapRotation(
          mapRef,
          lngLat,
          selectedFeature.id.toString(),
          lastClickedFeature
        );
      }
    };

    if (selectedData) {
      zoomToFeature(selectedData.featureProperties);
    } else {
      resetMap(mapRef, initialView, zoom);
    }
  }, [selectedData]);

  React.useEffect(() => {
    const newSeatSize = getSeatSize({
      currentZoom: Number(hoveredData.zoom)
    });
    setSeatSize(newSeatSize);
  }, [hoveredData.zoom]);

  return (
    <div className="w-full h-full overflow-auto border-r-2 shadow-inner border-r-slate-300 bg-slate-200 md:col-span-3">
      <Map
        attributionControl={false}
        ref={mapRef}
        minZoom={17.5}
        maxZoom={23}
        mapStyle={mapStyle as StyleSpecification}
        initialViewState={{
          latitude: centralPoint.lat,
          longitude: centralPoint.lng,
          zoom
        }}
        onZoom={e => handleZoom(e, mapRef, initialView, zoom, lastZoom)}
        maxBounds={bounds}
        interactiveLayerIds={['data', 'seats']}
        onMouseMove={e => {
          if (!selectedFeature) {
            onHover(e, hoveredFeature, selectedFeature, hoveredData);
          }
          handleSeatHover(e);
        }}
        onClick={e => {
          handleSectorClick(
            e,
            selectedFeature,
            lastClickedFeature,
            seatData,
            mapRef,
            initialView,
            zoom
          );
          handleSeatClick(e, selectedSeat);
        }}
      >
        <Layers
          allData={allData}
          filteredSeatData={filteredSeatData}
          seatSize={seatSize ?? 0}
        />
        {popupInfo && (
          <SeatPricePopup popupInfo={popupInfo} setPopupInfo={setPopupInfo} />
        )}

        {/* Navigation Control */}
        <div style={{ position: 'absolute', right: 10, top: 10 }}>
          <NavigationControl showCompass={false} />
        </div>
      </Map>
    </div>
  );
}

export default MapView;
