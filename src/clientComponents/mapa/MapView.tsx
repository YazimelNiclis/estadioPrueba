"use client";

import * as React from "react";
import Map from "react-map-gl/maplibre";
import { LngLat } from "maplibre-gl";
import type { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";
import { calculateAngle, getSeatSize } from "../../utils/utils";
import { HoverData, FeatureProperties } from "@/utils/types/mapTypes";
import useMapStore from "@/app/store/mapStore";
import { centralPoint, bounds } from "@/constants/mapConstants";
import "mapbox-gl/dist/mapbox-gl.css";
import Layers from "./MapLayers";
import { centroid } from "@turf/turf";
import mapStyle from "../../../public/mapStyle.json";
import SeatPricePopup from "./SeatPricePopup";

/* 
  Mapa. Componente a cargo de renderizar el mapa y manejo de interacciones con el mismo.
*/

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
    setHoveredSeat,
    selectedSeat,
    setSelectedSeat,
    zoom,
    setZoom,
    isMediumOrLarger,
    setIsMediumOrLarger,
    seatSize,
    setSeatSize,
    popupInfo,
    setPopupInfo,
  } = useMapStore();

  const mapRef = React.useRef<MapRef>(null);

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
        // @ts-ignore
        center: [lngLat.lng, lngLat.lat],
        zoom: 20.5,
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
        //    // setSelectedData(feature);

        setSelectedSeat([]);

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
        setSelectedData(null);
        setFilteredSeatData([]);
        setHoveredFeature(null);
        setSelectedSeat([""]);
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
    [selectedSeat, setSelectedSeat]
  );

  const handleSeatHover = React.useCallback(
    (event: MapLayerMouseEvent) => {
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
    },
    [setHoveredSeat]
  );

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
    console.log("initial view from useEffect: " + JSON.stringify(initialView));
    const map = mapRef.current?.getMap();
    if (!map || initialView) return;

    setInitialView({
      center: map.getCenter().toArray(),
      zoom: map.getZoom(),
      pitch: map.getPitch(),
      bearing: map.getBearing(),
    });
  }, [mapRef.current]);

  React.useEffect(() => {
    const zoomToFeature = (selectedFeature: FeatureProperties) => {
      const feature = allData?.features.find(
        (f) => f.properties.id === selectedFeature.id
      );
      if (feature) {
        const centroidCoordinates = centroid(feature).geometry.coordinates;
        const lngLat = new LngLat(
          centroidCoordinates[0],
          centroidCoordinates[1]
        );
        handleMapRotation(lngLat, selectedFeature.id.toString());
      }
    };

    if (selectedData) {
      zoomToFeature(selectedData);
    } else {
      resetMap();
    }
  }, [selectedData]);

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
        <Layers
          allData={allData}
          filteredSeatData={filteredSeatData}
          seatSize={seatSize}
        />
        {popupInfo && (
          <SeatPricePopup popupInfo={popupInfo} setPopupInfo={setPopupInfo} />
        )}
      </Map>
    </div>
  );
}

export default MapView;
