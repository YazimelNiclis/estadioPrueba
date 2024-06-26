"use client";
import * as React from "react";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import type {
  FillLayer,
  MapLayerMouseEvent,
  MapRef,
} from "react-map-gl/maplibre";
import { LngLat, LngLatBounds } from "maplibre-gl";
import { calculateAngle } from "../../utils/utils";
import "mapbox-gl/dist/mapbox-gl.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { centroid } from "@turf/turf";
interface FillColor {
  default: string;
  hover?: string;
  click?: string;
}

const centralPoint = { lat: -25.2921546, lng: -57.6573 };
const mapBounds = new LngLatBounds(
  [-57.6595, -25.2931], // inf. izq
  [-57.655, -25.2912] // sup. der
);

const bounds: [number, number, number, number] = [
  -57.65912, -25.29317, -57.6556, -25.291,
];

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
interface Seat {
  type: string;
  properties: {
    id: number;
    place_id: number;
    sector_cod: string;
    row: number;
    seat: number;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

function MapView(props: { data: any; seats: any }) {
  const [allData, setAllData] = React.useState<any>(props.data);
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
  const [lastClickedFeature, setLastClickedFeature] = React.useState<
    string | null
  >();
  //mapa
  const [initialView, setInitialView] = React.useState<any>(null);
  const mapRef = React.useRef<MapRef>(null);
  //asientos
  const [seatData, setSeatData] = React.useState<any[]>(props.seats.features);
  const [filteredSeatData, setFilteredSeatData] = React.useState<any[]>([]);
  const [hoveredSeat, setHoveredSeat] = React.useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = React.useState<string[]>([""]);
  const { selectedData: reduxSelectedData } = useSelector(
    (state: RootState) => state.map
  );

  React.useEffect(() => {
    if (reduxSelectedData) {
      const feature = props.data.features.find(
        (f: any) => f.properties.id === reduxSelectedData.properties.id
      );
      if (feature) {
        const centroidCoordinates = centroid(feature).geometry.coordinates;
        const lngLat = new LngLat(
          centroidCoordinates[0],
          centroidCoordinates[1]
        );
        handleMapRotation(lngLat, reduxSelectedData.properties.id);
      }
    }
  }, [reduxSelectedData, props.data]);

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

  const handleZoomAndPitchReset = () => {
    mapRef.current?.setPitch(0);
    mapRef.current?.fitBounds(mapBounds, {
      padding: 20,
      linear: true,
    });
    setLastClickedFeature(null);
  };

  const handleFeatureSelection = React.useCallback(
    (clickedFeatureId: string | null) => {
      if (selectedFeature === clickedFeatureId) {
        setLastClickedFeature(null);
        setSelectedFeature(null);
        setFilteredSeatData([]);
      } else {
        setSelectedFeature(clickedFeatureId);
        setLastClickedFeature(clickedFeatureId);
      }
    },
    [selectedFeature]
  );

  const handleMapRotation = (
    lngLat: maplibregl.LngLat,
    clickedFeatureId: string | null
  ) => {
    if (clickedFeatureId && clickedFeatureId !== lastClickedFeature) {
      const angle = calculateAngle(lngLat, centralPoint);
      mapRef.current?.rotateTo(angle, {
        duration: 1000,
        center: [lngLat.lng, lngLat.lat],
        zoom: 21.5,
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

  const onClick = React.useCallback(
    (event: MapLayerMouseEvent) => {
      const { features, lngLat } = event;
      const clickedFeatureId = features && features[0]?.properties?.id;
      const clickedFeatureCodigo = features && features[0]?.properties?.codigo;

      if (clickedFeatureId === selectedFeature) {
        return;
      }

      if (features?.length) {
        const feature = features[0]?.properties as SelectedData;
        handleFeatureSelection(clickedFeatureId);
        handleMapRotation(lngLat, clickedFeatureId);
        setSelectedData(feature);

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
        setSelectedData(undefined);
        setFilteredSeatData([]);
      }
    },
    [lastClickedFeature]
  );

  const getLayerStyles = React.useMemo(() => {
    const baseStyle: FillLayer = {
      id: "data",
      type: "fill",
      source: "data",
      paint: {
        "fill-opacity": 0.5,
      },
    };

    const fillColorExpression = [
      "case",
      ["==", ["get", "id"], hoveredFeature],
      "#3288bd", // hover color
      /* ["==", ["get", "id"], selectedFeature],
      "#000", // click color */
      "#98CF8B", // default color
    ];

    return {
      ...baseStyle,
      paint: {
        ...baseStyle.paint,
        "fill-color": fillColorExpression,
      },
    };
  }, [hoveredFeature, selectedFeature]);

  const handleSeatClick = React.useCallback((event: MapLayerMouseEvent) => {
    const { features } = event;
    const seatFeature = features?.find((f) => f.layer.id === "seats");
    const clickedSeatId = seatFeature?.properties?.id;

    if (clickedSeatId) {
      setSelectedSeat((prevSelectedSeats) => {
        if (prevSelectedSeats.includes(clickedSeatId)) {
          return prevSelectedSeats.filter((seatId) => seatId !== clickedSeatId);
        } else {
          return [...prevSelectedSeats, clickedSeatId];
        }
      });
    }
  }, []);

  const handleSeatHover = React.useCallback((event: MapLayerMouseEvent) => {
    const { features } = event;
    const seatFeature = features?.find((f) => f.layer.id === "seats");
    const hoveredSeatId = seatFeature?.properties?.id;
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
          ["in", ["get", "id"], ["literal", selectedSeat]],
          "#FF0000", // selected color
          "#C2C3C7", // default color
        ],
      },
    };
  }, [hoveredSeat, selectedSeat]);

  React.useEffect(() => {
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

  return (
    <div className="w-2/3 overflow-auto bg-slate-200 shadow-inner border-r-2 border-r-slate-300">
      <Map
        attributionControl={false}
        ref={mapRef}
        minZoom={17}
        maxZoom={20.5}
        initialViewState={{
          latitude: centralPoint.lat,
          longitude: centralPoint.lng,
          zoom: 17.6,
        }}
        maxBounds={bounds}
        interactiveLayerIds={["data", "seats"]}
        onMouseMove={(e: MapLayerMouseEvent) => {
          onHover(e);
          handleSeatHover(e);
        }}
        onClick={(e: MapLayerMouseEvent) => {
          onClick(e);
          handleSeatClick(e);
        }}
      >
        <Source id="data" type="geojson" data={allData}>
          <Layer {...getLayerStyles} />
        </Source>
        {selectedFeature && filteredSeatData.length > 0 && (
          <Source
            id="seats"
            type="geojson"
            data={{ type: "FeatureCollection", features: filteredSeatData }}
          >
            <Layer {...getSeatLayerStyles} />
          </Source>
        )}
      </Map>
    </div>
  );
}

export default MapView;
