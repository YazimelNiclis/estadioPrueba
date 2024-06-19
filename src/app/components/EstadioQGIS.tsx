"use client";

import * as React from "react";
import Map, { Source, Layer } from "react-map-gl";
import type { FillLayer, MapLayerMouseEvent } from "react-map-gl";

const MAPTOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const layerStyle: FillLayer = {
  id: "data",
  type: "fill",
  paint: {
    "fill-color": {
      property: "id",
      stops: [
        [0, "#00ff00"],
        [1, "#19ff00"],
        [2, "#32ff00"],
        [3, "#4bff00"],
        [4, "#64ff00"],
        [5, "#7dff00"],
        [6, "#96ff00"],
        [7, "#afff00"],
        [8, "#c8ff00"],
        [9, "#e1ff00"],
        [10, "#faff00"],
        [11, "#f9e600"],
        [12, "#f9cc00"],
        [13, "#f9b300"],
        [14, "#f99900"],
        [15, "#f98000"],
        [16, "#f96600"],
        [17, "#f94d00"],
        [18, "#f93300"],
        [19, "#f91a00"],
        [20, "#f90000"],
        [21, "#e60000"],
        [22, "#cc0000"],
        [23, "#b30000"],
        [24, "#990000"],
        [25, "#800000"],
      ],
    },
    "fill-opacity": 0.5,
  },
};

interface HoverData {
  lng: string;
  lat: string;
  zoom?: string;
  sector: string;
}

function EstadioQGIS() {
  const [allData, setAllData] = React.useState<any>();
  const [hoveredData, setHoveredData] = React.useState<HoverData>({
    lat: "",
    lng: "",
    sector: "Ninguno",
    zoom: "",
  });
  const [hoveredFeature, setHoveredFeature] = React.useState<string | null>(
    null
  );
  const [selectedFeature, setSelectedFeature] = React.useState<string | null>(
    null
  );
  //asientos
  const [seatData, setSeatData] = React.useState<any>(null);
  const [hoveredSeat, setHoveredSeat] = React.useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = React.useState<string | null>(null);
  //mapa
  const mapRef = React.useRef<any>(null);

  const onHover = React.useCallback(
    (event: MapLayerMouseEvent) => {
      const { features, lngLat } = event;
      const hoveredFeatureId = features && features[0]?.properties?.id;

      if (hoveredFeatureId === hoveredFeature) {
        return;
      }

      if (hoveredFeatureId !== selectedFeature) {
        const newData: HoverData = {
          lat: lngLat.lat.toFixed(4),
          lng: lngLat.lng.toFixed(4),
          sector: features![0]?.properties?.nombre || "Ninguno",
        };
        setHoveredData(newData);
      }

      setHoveredFeature(hoveredFeatureId || null);
    },
    [selectedFeature, hoveredFeature]
  );

  const onClick = React.useCallback(
    (event: MapLayerMouseEvent) => {
      const { features, lngLat } = event;
      const clickedFeatureId = features && features[0]?.properties?.id;
      if (clickedFeatureId !== selectedFeature) {
        setSelectedFeature(clickedFeatureId || null);

        mapRef.current?.flyTo({
          center: [lngLat.lng, lngLat.lat],
          zoom: 20,
        });

        // Fetch datos de asientos (de momento solo disponible los asientos de seccion vip a)
        fetch("./seats.geojson")
          .then((resp) => resp.json())
          .then((json) => {
            setSeatData(json);
          })
          .catch((err) => console.error("Could not load seat data", err));
      } /* else {
        setSelectedFeature(null);
        setSeatData(null); // limpiar datos de asiento al deseleccionar
      } */
    },
    [selectedFeature]
  );

  const getLayerStyles = React.useMemo(() => {
    const updatedLayerStyle: FillLayer = {
      ...layerStyle,
      paint: {
        ...layerStyle.paint,
        "fill-color": [
          "case",
          [
            "==",
            ["get", "id"],
            hoveredFeature && hoveredFeature !== selectedFeature
              ? hoveredFeature
              : null,
          ],
          "#3288bd", // hover color
          ["==", ["get", "id"], selectedFeature],
          "#000", // selected color
          [
            "interpolate",
            ["linear"],
            ["get", "id"],
            0,
            "#00ff00",
            1,
            "#19ff00",
            2,
            "#32ff00",
            3,
            "#4bff00",
            4,
            "#64ff00",
            5,
            "#7dff00",
            6,
            "#96ff00",
            7,
            "#afff00",
            8,
            "#c8ff00",
            9,
            "#e1ff00",
            10,
            "#faff00",
            11,
            "#f9e600",
            12,
            "#f9cc00",
            13,
            "#f9b300",
            14,
            "#f99900",
            15,
            "#f98000",
            16,
            "#f96600",
            17,
            "#f94d00",
            18,
            "#f93300",
            19,
            "#f91a00",
            20,
            "#f90000",
            21,
            "#e60000",
            22,
            "#cc0000",
            23,
            "#b30000",
            24,
            "#990000",
            25,
            "#800000",
          ],
        ],
      },
    };
    return updatedLayerStyle;
  }, [hoveredFeature, selectedFeature]);

  React.useEffect(() => {
    fetch("./estadioJSON.geojson")
      .then((resp) => resp.json())
      .then((json) => setAllData(json))
      .catch((err) => console.error("Could not load data", err));
  }, []);

  const handleSeatClick = React.useCallback(
    (event: MapLayerMouseEvent) => {
      const { features } = event;
      const seatFeature = features?.find((f) => f.layer.id === "seats");
      const clickedSeatId = seatFeature?.properties?.id;

      if (clickedSeatId !== selectedSeat) {
        setSelectedSeat(clickedSeatId || null);
      } else {
        setSelectedSeat(null);
      }
    },
    [selectedSeat]
  );

  const handleSeatHover = React.useCallback((event: MapLayerMouseEvent) => {
    const { features } = event;
    const hoveredSeatId = features && features[0]?.properties?.id;
    setHoveredSeat(hoveredSeatId || null);
  }, []);

  const getSeatLayerStyles = React.useMemo(() => {
    return {
      id: "seats",
      type: "circle" as const,
      paint: {
        "circle-radius": 5,
        "circle-color": [
          "case",
          ["==", ["get", "id"], hoveredSeat],
          "#3288bd", // hover color
          ["==", ["get", "id"], selectedSeat],
          "#FF0000", // selected color
          "#00FF00", // default color
        ],
      },
    };
  }, [hoveredSeat, selectedSeat]);

  return (
    <>
      {hoveredData && (
        <div className="bg-slate-700 text-white p-4 z-[1] absolute top-0 left-0 m-4 rounded-md">
          Longitude: {hoveredData.lng} | Latitude: {hoveredData.lat} | Zoom:{" "}
          {hoveredData.zoom} | Sector: {hoveredData.sector}
        </div>
      )}
      {allData && (
        <Map
          ref={mapRef}
          initialViewState={{
            latitude: -25.2921546,
            longitude: -57.6573,
            zoom: 17.6,
          }}
          onZoom={(e) =>
            setHoveredData((prev) => ({
              ...prev,
              zoom: e.viewState.zoom.toFixed(4),
            }))
          }
          mapboxAccessToken={MAPTOKEN}
          interactiveLayerIds={["data", "seats"]}
          onMouseMove={(e) => {
            onHover(e);
            handleSeatHover(e);
          }}
          onClick={(e) => {
            onClick(e);
            handleSeatClick(e);
          }}
        >
          <Source id="data" type="geojson" data={allData}>
            <Layer {...getLayerStyles} />
          </Source>
          {seatData && (
            <Source id="seats" type="geojson" data={seatData}>
              <Layer {...getSeatLayerStyles} />
            </Source>
          )}
        </Map>
      )}
    </>
  );
}

export default EstadioQGIS;
