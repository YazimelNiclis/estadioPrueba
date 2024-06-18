"use client";
import * as React from "react";
import Map, { Source, Layer } from "react-map-gl";
import type { FillLayer } from "react-map-gl";

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

const highlightLayerStyle: FillLayer = {
  id: "highlighted-data",
  type: "fill",
  paint: {
    "fill-color": "#f00",
    "fill-opacity": 0.7,
  },
};

function EstadioQGIS() {
  const [allData, setAllData] = React.useState<any>();
  const [layerStyles, setLayerStyles] = React.useState<FillLayer>(layerStyle);

  React.useEffect(() => {
    fetch("./estadioJSON.geojson")
      .then((resp) => resp.json())
      .then((json) => setAllData(json))
      .catch((err) => console.error("Could not load data", err));
  }, []);

  const onHover = React.useCallback((event: any) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];

    if (hoveredFeature) {
      setLayerStyles((prevStyle) => ({
        ...prevStyle,
        paint: {
          ...prevStyle.paint,
          "fill-opacity": 0.7,
        },
      }));
    } else {
      setLayerStyles((prevStyle) => ({
        ...prevStyle,
        paint: {
          ...prevStyle.paint,
          "fill-opacity": 0.3,
        },
      }));
    }
  }, []);

  return (
    <>
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
        >
          <Source id="data" type="geojson" data={allData}>
            <Layer {...layerStyles} />
          </Source>
        </Map>
      )}
    </>
  );
}

export default EstadioQGIS;
