"use client";
import * as React from "react";
import Map, { Source, Layer } from "react-map-gl";
import type { FillLayer, MapLayerMouseEvent } from "react-map-gl";

const MAPTOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
//mapStyle="mapbox://styles/mapbox/streets-v9"

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
  zoom: string;
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

  React.useEffect(() => {
    fetch("./estadioJSON.geojson")
      .then((resp) => resp.json())
      .then((json) => setAllData(json))
      .catch((err) => console.error("Could not load data", err));
  }, []);

  const onHover = React.useCallback(
    (event: MapLayerMouseEvent) => {
      const { features, lngLat } = event;
      const hoveredFeature = features && features[0];
      if (
        hoveredFeature?.properties?.nombre &&
        hoveredFeature?.properties?.nombre !== hoveredData.sector
      ) {
        const newData: HoverData = {
          ...hoveredData,
          lat: lngLat.lat.toFixed(4),
          lng: lngLat.lng.toFixed(4),
          sector: hoveredFeature?.properties?.nombre,
        };
        setHoveredData(newData);
      }
    },
    [hoveredData]
  );

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
            latitude: -25.2921546,
            longitude: -57.6573,
            zoom: 17.6,
          }}
          mapboxAccessToken={MAPTOKEN}
          interactiveLayerIds={["data"]}
          onMouseMove={onHover}
          onZoom={(e) =>
            setHoveredData((prev) => ({
              ...prev,
              zoom: e.viewState.zoom.toFixed(4),
            }))
          }
        >
          <Source id="data" type="geojson" data={allData}>
            <Layer {...layerStyle} />
          </Source>
        </Map>
      )}
    </>
  );
}

export default EstadioQGIS;
