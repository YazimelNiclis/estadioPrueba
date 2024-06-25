"use client";

import * as React from "react";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import type {
  FillLayer,
  MapLayerMouseEvent,
  MapRef,
  SymbolLayer,
} from "react-map-gl/maplibre";
import { LngLatBounds } from "maplibre-gl";
import { calculateAngle } from "../../utils/utils";

const centralPoint = { lat: -25.2921546, lng: -57.6573 };
const mapBounds = new LngLatBounds(
  [-57.6595, -25.2931], // inf. izq
  [-57.655, -25.2912] // sup. der
);

const bounds: [number, number, number, number] = [
  -57.659, -25.2935, -57.6557, -25.2907,
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

const MapaML: React.FC = () => {
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
  const [lastClickedFeature, setLastClickedFeature] = React.useState<
    string | null
  >();
  //mapa
  const [initialView, setInitialView] = React.useState<any>(null);
  const mapRef = React.useRef<MapRef>(null);
  const [zoom, setZoom] = React.useState(14.5);
  const [isMediumOrLarger, setIsMediumOrLarger] = React.useState(false);
  //asientos
  const [seatData, setSeatData] = React.useState<Seat[]>([]);
  const [filteredSeatData, setFilteredSeatData] = React.useState<any[]>([]);
  const [hoveredSeat, setHoveredSeat] = React.useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = React.useState<string[]>([""]);

  const onHover = React.useCallback(
    (event: MapLayerMouseEvent) => {
      if (!isMediumOrLarger) return; // Deactivate hover for md and below

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
      "#E6F2FF", // hover color
      ["==", ["get", "id"], selectedFeature],
      "#E6F2FF", // click color
      "#98CF8B", // default color
    ];

    return {
      ...baseStyle,
      glyphs: "http://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
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

  const handleSeatHover = React.useCallback(
    (event: MapLayerMouseEvent) => {
      if (!isMediumOrLarger) return; // Deactivate hover for md and below

      const { features } = event;
      const seatFeature = features?.find((f) => f.layer.id === "seats");
      const hoveredSeatId = seatFeature?.properties?.id;
      setHoveredSeat(hoveredSeatId || null);
    },
    [isMediumOrLarger]
  );

  const getSeatLayerStyles = React.useMemo(() => {
    return {
      id: "seats",
      type: "circle" as const,
      paint: {
        "circle-radius": 8,
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

  const getSeatNumbersStyles: SymbolLayer = {
    id: "seat-labels",
    type: "symbol",
    source: "seats",
    layout: {
      "text-field": ["get", "id"],
      "text-size": 6,
      "text-anchor": "center",
    },
    paint: {
      "text-color": "#000000",
    },
  };

  React.useEffect(() => {
    Promise.all([
      fetch("./estadioJSON.geojson").then((resp) => resp.json()),
      fetch("./seats.geojson").then((resp) => resp.json()),
    ])
      .then(([estadioJSON, seatsJSON]) => {
        setAllData(estadioJSON);
        setSeatData(seatsJSON.features);
      })
      .catch((err) => console.error("Could not load data", err));
    //cargar los valores iniciales del mapa
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      setInitialView({
        center: map.getCenter(),
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
      });
    }
    const handleResize = () => {
      const isMediumOrLarger = window.matchMedia("(min-width: 768px)").matches;
      setIsMediumOrLarger(isMediumOrLarger);

      if (isMediumOrLarger) {
        setZoom(16.6);
      } else {
        setZoom(8.5);
      }
    };
    // Set initial zoom based on initial screen size
    handleResize();
    // Add resize event listener
    window.addEventListener("resize", handleResize);
    // Clean up event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <section className="w-full h-full min-h-screen  py-10 grid grid cols-1 md:grid-cols-2">
      {hoveredData && (
        <div className="hidden md:block bg-slate-500 text-white max-w-[40vw] max-h-[45vw] w-full h-full p-4 z-[1] md:absolute top-0 right-0 m-4 rounded-md">
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
        <div className="w-full md:max-w-[50vw] h-full">
          <Map
            ref={mapRef}
            /* minZoom={17}
            maxZoom={23} */
            mapStyle="https://demotiles.maplibre.org/style.json"
            initialViewState={{
              latitude: centralPoint.lat,
              longitude: centralPoint.lng,
              zoom: zoom,
            }}
            onZoom={(e) =>
              setHoveredData((prev) => ({
                ...prev,
                zoom: e.viewState.zoom.toFixed(4),
              }))
            }
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
                <Layer {...getSeatNumbersStyles} />
              </Source>
            )}
          </Map>
        </div>
      )}
    </section>
  );
};

export default MapaML;
