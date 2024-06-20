"use client";

import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  LegacyRef,
} from "react";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import type { FillLayer, MapRef } from "react-map-gl";

import type {
  MapLayerMouseEvent,
  ViewStateChangeEvent,
  LngLat,
} from "react-map-gl/maplibre";
import { calculateAngle } from "../utils/utils";

const MAPTOKEN = process.env.NEXT_PUBLIC_MAPLIBRE_TOKEN; // Cambia este valor al token de MapLibre si es necesario

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

const centralPoint = { lat: -25.2921546, lng: -57.6573 };

const bounds: [number, number, number, number] = [
  -57.659, -25.2935, -57.6557, -25.2907,
];
const zoomThreshold = 20.5;

interface HoverData {
  lng: string;
  lat: string;
  zoom: number;
  sector: string;
}

interface SelectedData {
  codigo: number;
  desc: string;
  id: number;
  nombre: string;
  place_id: number;
}

const initialHoveredData: HoverData = {
  lat: "",
  lng: "",
  sector: "Ninguno",
  zoom: 0,
};

export function EstadoMapLibre() {
  const [allData, setAllData] = useState<any>();
  const [selectedData, setSelectedData] = useState<SelectedData | undefined>();
  const [hoveredData, setHoveredData] = useState<HoverData>(initialHoveredData);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [initialView, setInitialView] = useState<any>(null);
  const [lastClickedFeature, setLastClickedFeature] = useState<string | null>();
  const [seatData, setSeatData] = useState<any>(null);
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const mapRef = useRef<MapRef>(null);

  const onHover = useCallback(
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

  const handleZoomAndPitchReset = () => {
    mapRef.current?.setPitch(0);
    mapRef.current?.fitBounds(bounds, {
      padding: 20,
      linear: true,
    });
    setLastClickedFeature(null);
  };

  const handleFeatureSelection = (clickedFeatureId: string | null) => {
    setSelectedFeatures((prevSelected) => {
      if (prevSelected.includes(clickedFeatureId || "")) {
        if (clickedFeatureId === lastClickedFeature) {
          handleZoomAndPitchReset();
        }
        return prevSelected.filter((id) => id !== clickedFeatureId);
      } else {
        setLastClickedFeature(clickedFeatureId);
        return [...prevSelected, clickedFeatureId || ""];
      }
    });
  };

  const handleMapRotation = (
    lngLat: maplibregl.LngLat,
    clickedFeatureId: string | null
  ) => {
    if (clickedFeatureId && clickedFeatureId !== lastClickedFeature) {
      const angle = calculateAngle(lngLat, centralPoint);
      mapRef.current?.rotateTo(angle, {
        duration: 1000,
        center: [lngLat.lng, lngLat.lat],
        zoom: 20.6,
        pitch: 50,
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

  const onClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const { features, lngLat } = event;
      const clickedFeatureId = features && features[0]?.properties?.id;
      setSelectedFeature(clickedFeatureId || null);
      if (features?.length) {
        const feature = features[0]?.properties as SelectedData;
        handleFeatureSelection(clickedFeatureId);
        handleMapRotation(lngLat, clickedFeatureId);
        setSelectedData(feature);
      } else {
        resetMap();
        setSelectedData(undefined);
      }
    },
    [lastClickedFeature]
  );

  const getLayerStyles = useMemo(() => {
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

  useEffect(() => {
    fetch("./estadioJSON.geojson")
      .then((resp) => resp.json())
      .then((json) => setAllData(json))
      .catch((err) => console.error("Could not load data", err));

    // Fetch datos de asientos (de momento solo disponible los asientos de seccion vip a)
    fetch("./seats.geojson")
      .then((resp) => resp.json())
      .then((json) => {
        setSeatData(json);
      })
      .catch((err) => console.error("Could not load seat data", err));
    //cargo los valores iniciales del mapa
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      setInitialView({
        center: map.getCenter(),
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      });
    }
  }, []);

  useEffect(() => {
    //cargo los valores iniciales del mapa
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      setInitialView({
        center: map.getCenter(),
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      });
    }
  }, [allData]);

  const handleSeatClick = useCallback(
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

  const handleSeatHover = useCallback((event: MapLayerMouseEvent) => {
    const { features } = event;
    const hoveredSeatId = features && features[0]?.properties?.id;
    setHoveredSeat(hoveredSeatId || null);
  }, []);

  const getSeatLayerStyles = useMemo(() => {
    const circleColor = [
      "case",
      ["==", ["get", "id"], hoveredSeat],
      "#3288bd", // hover color
      ["==", ["get", "id"], selectedSeat],
      "#FF0000", // selected color
      "#00FF00", // default color
    ];

    const isZoomedIn = hoveredData.zoom > zoomThreshold;

    return {
      id: "seats",
      type: "circle" as const,
      paint: {
        "circle-radius": 5,
        "circle-opacity": isZoomedIn ? 1 : 0,
        "circle-color": circleColor,
        "circle-stroke-color": "#000000",
        "circle-stroke-width": 1,
        "circle-stroke-opacity": isZoomedIn ? 1 : 0,
      },
    };
  }, [hoveredSeat, selectedSeat, hoveredData]);

  const onZoom = (e: ViewStateChangeEvent) =>
    setHoveredData((prev) => ({
      ...prev,
      zoom: e.viewState.zoom,
    }));

  return (
    <>
      {hoveredData && (
        <div className="bg-slate-500 text-white max-w-[40vw] max-h-[45vw] w-full h-full p-4 z-[1] absolute top-0 right-0 m-4 rounded-md">
          <p>
            Longitude: {hoveredData.lng} | Latitude: {hoveredData.lat} | Zoom:
            {hoveredData.zoom.toFixed(4)} | Sector: {hoveredData.sector}
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
            ref={mapRef}
            minZoom={17}
            maxZoom={21}
            initialViewState={{
              latitude: centralPoint.lat,
              longitude: centralPoint.lng,
              zoom: 17.6,
            }}
            onZoom={onZoom}
            maxBounds={bounds}
            // mapLib={import('maplibre-gl')} // Asegúrate de importar maplibre-gl en tu proyecto
            mapboxAccessToken={MAPTOKEN}
            interactiveLayerIds={["data"]}
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
        </div>
      )}
    </>
  );
}
