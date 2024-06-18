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
        [0, "#3288bd"],
        [1, "#66c2a5"],
        [2, "#abdda4"],
        [3, "#e6f598"],
        [4, "#ffffbf"],
        [5, "#fee08b"],
        [6, "#fdae61"],
        [7, "#f46d43"],
        [8, "#d53e4f"],
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
    sector: "",
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
      const newData: HoverData = {
        ...hoveredData,
        lat: lngLat.lat.toFixed(4),
        lng: lngLat.lng.toFixed(4),
        sector: hoveredFeature?.properties?.nombre || "Ninguno",
      };
      setHoveredData(newData);
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
