"use client";
import * as React from "react";
import Map, { Source, Layer } from "react-map-gl";
import type { FillLayer } from "react-map-gl";
import { updatePercentiles } from "../utils/utils";
const MAPTOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const layerStyle: FillLayer = {
  id: "data",
  type: "fill",
  paint: {
    "fill-color": {
      property: "percentile",
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
    "fill-opacity": 0.3,
  },
};

function EstadioQGIS() {
  const [allData, setAllData] = React.useState<any>();
  React.useEffect(() => {
    fetch("./estadioJSON.geojson")
      .then((resp) => resp.json())
      .then((json) => setAllData(json))
      .catch((err) => console.error("Could not load data", err));
  }, []);

  const onHover = React.useCallback(
    (event: { features: any; point: { x: any; y: any } }) => {
      const {
        features,
        point: { x, y },
      } = event;
      const hoveredFeature = features && features[0];
    },
    []
  );

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
          onMouseMove={() => onHover}
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
