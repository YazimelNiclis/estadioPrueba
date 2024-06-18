"use client";

import * as React from "react";
import Map, { Source, Layer } from "react-map-gl";
import type { FillLayer, MapLayerMouseEvent, MapRef } from "react-map-gl";
import { calculateAngle } from "../utils/utils";
import { LngLatBounds } from "mapbox-gl";

const MAPTOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const centralPoint = { lat: -25.2921546, lng: -57.6573 };
const mapBounds = new LngLatBounds(
  [-57.6595, -25.2931], // inf. izq
  [-57.655, -25.2912] // sup. der
);

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
  console.log(allData, "all");
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
          zoom: mapRef.current.getMap().getZoom().toFixed(2),
        };
        setHoveredData(newData);
      }

      setHoveredFeature(hoveredFeatureId || null);
    },
    [selectedFeature, hoveredFeature]
  );

  const getLayerStyles = React.useMemo(() => {
    const updatedLayerStyle: FillLayer = {
      ...layerStyle,
      paint: {
        ...layerStyle.paint,
        "fill-color": [
          "case",
          ["==", ["get", "id"], hoveredFeature],
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
      const clickedSeatId = features && features[0]?.properties?.id;

      if (clickedSeatId) {
        const seatState = seatData.features.find(
          (seat: any) => seat.properties.id === clickedSeatId
        )?.properties.selected;

        // actualizar estado de seleccion de asiento
        setSeatData((prevData: any) => ({
          ...prevData,
          features: prevData.features.map((seat: any) =>
            seat.properties.id === clickedSeatId
              ? {
                  ...seat,
                  properties: {
                    ...seat.properties,
                    selected: !seatState,
                  },
                }
              : seat
          ),
        }));
      }
    },
    [seatData]
  );

  const getSeatLayerStyles = React.useMemo(() => {
    return {
      id: "seats",
      type: "circle" as const,
      paint: {
        "circle-radius": 5,
        "circle-color": [
          "case",
          ["boolean", ["get", "selected"], false],
          "#FF0000", // selected color
          "#00FF00", // default color
        ],
      },
    };
  }, []);

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
          initialViewState={{
            latitude: centralPoint.lat,
            longitude: centralPoint.lng,
            zoom: 17.6,
          }}
          onZoom={(e) =>
            setHoveredData((prev) => ({
              ...prev,
              zoom: e.viewState.zoom.toFixed(2),
            }))
          }
          mapboxAccessToken={MAPTOKEN}
          interactiveLayerIds={["data"]}
          onMouseMove={onHover}
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
