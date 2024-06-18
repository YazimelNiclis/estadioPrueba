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
  zoom: string;
  sector: string;
}
interface SelectedData {
  codigo: number;
  desc: string;
  id: number;
  nombre: string;
  place_id: number;
}

function EstadioYazi() {
  const [allData, setAllData] = React.useState<any>();
  const [selectedData, setSelectedData] = React.useState<
    SelectedData | undefined
  >(undefined);
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

  const onClick = React.useCallback((event: MapLayerMouseEvent) => {
    const { features } = event;
    const clickedFeatureId = features && features[0]?.properties?.id;
    setSelectedFeature(clickedFeatureId || null);
    if (features?.length) {
      const feature = features[0]?.properties as SelectedData;
      setSelectedData(feature);
    } else {
      setSelectedData(undefined);
    }
  }, []);

  const getLayerStyles = React.useMemo(() => {
    if (!hoveredFeature && !selectedFeature) {
      return layerStyle;
    }

    const updatedLayerStyle: FillLayer = {
      ...layerStyle,
      paint: {
        ...layerStyle.paint,
        "fill-color": [
          "case",
          ["==", ["get", "id"], hoveredFeature],
          "#3288bd", // hover
          ["==", ["get", "id"], selectedFeature],
          "#000", // click
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

  // const onHover = React.useCallback(
  //   (event: MapLayerMouseEvent) => {
  //     const { features, lngLat } = event;
  //     const hoveredFeature = features && features[0];
  //     if (
  //       hoveredFeature?.properties?.nombre &&
  //       hoveredFeature?.properties?.nombre !== hoveredData.sector
  //     ) {
  //       const newData: HoverData = {
  //         ...hoveredData,
  //         lat: lngLat.lat.toFixed(4),
  //         lng: lngLat.lng.toFixed(4),
  //         sector: hoveredFeature?.properties?.nombre,
  //       };
  //       setHoveredData(newData);
  //     }
  //   },
  //   [hoveredData]
  // );

  const bounds: [number, number, number, number] = [
    -57.659, -25.2935, -57.6557, -25.2907,
  ];

  return (
    <>
      {hoveredData && (
        <div className="bg-slate-500 text-white max-w-[40vw] max-h-[45vw] w-full h-full p-4 z-[1] absolute top-0 right-0 m-4 rounded-md">
          <p>
            Longitude: {hoveredData.lng} | Latitude: {hoveredData.lat} | Zoom:
            {hoveredData.zoom} | Sector: {hoveredData.sector}
          </p>
          <br />
          {selectedData && (
            <>
              <p className="text-xl">Datos seleccionados:</p>
              <p>Codigo: {selectedData?.codigo}</p>
              <p>Descripcion: {selectedData?.desc}</p>
              <p>Id: {selectedData?.id}</p>
              <p>Nombre: {selectedData?.nombre}</p>
              <p>Place id: {selectedData?.place_id}</p>
            </>
          )}
        </div>
      )}
      {allData && (
        <div className="max-w-[50vw] absolute w-full h-full left-0 top-0 bottom-0">
          <Map
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
            maxBounds={bounds}
            mapboxAccessToken={MAPTOKEN}
            interactiveLayerIds={["data"]}
            onMouseMove={onHover}
            onClick={onClick}
          >
            <Source id="data" type="geojson" data={allData}>
              <Layer {...getLayerStyles} />
            </Source>
          </Map>
        </div>
      )}
    </>
  );
}

export default EstadioYazi;
