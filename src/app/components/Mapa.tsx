"use client";

import * as React from "react";
import Map, { Source, Layer } from "react-map-gl";
import type { FillLayer, MapLayerMouseEvent, MapRef } from "react-map-gl";
import { LngLatBounds } from "mapbox-gl";
import { calculateAngle } from "../utils/utils";

const MAPTOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const layerStyle: FillLayer = {
  id: "data",
  type: "fill",
  paint: {
    "fill-color": {
      property: "id",
      stops: [
        [1, "#98CF8B"],
        [2, "#A2B2B2"],
      ],
    },
    "fill-opacity": 0.5,
  },
};

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

const Mapa: React.FC = () => {
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
  //asientos
  const [seatData, setSeatData] = React.useState<Seat[]>([]);
  const [filteredSeatData, setFilteredSeatData] = React.useState<any[]>([]);
  const [hoveredSeat, setHoveredSeat] = React.useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = React.useState<string[]>([]);

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

  /*   const handleMapRotation = (
    lngLat: mapboxgl.LngLat,
    clickedFeatureId: string | null
  ) => {
    if (clickedFeatureId && clickedFeatureId !== lastClickedFeature) {
      const angle = calculateAngle(lngLat, centralPoint);
      mapRef.current?.rotateTo(angle, {
        duration: 1000,
        center: [lngLat.lng, lngLat.lat],
        zoom: 19.5,
        pitch: 50,
      });
    }
  }; */

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

      if (features?.length) {
        const feature = features[0]?.properties as SelectedData;
        handleFeatureSelection(clickedFeatureId);
        //handleMapRotation(lngLat, clickedFeatureId);
        mapRef.current?.flyTo({
          center: [lngLat.lng, lngLat.lat],
          zoom: 20,
        });
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
            1,
            "#98CF8B",
            2,
            "#A2B2B2",
          ],
        ],
      },
    };
    return updatedLayerStyle;
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
    //const hoveredSeatId = features && features[0]?.properties?.id;
    setHoveredSeat(hoveredSeatId || null);
    //console.log(hoveredSeatId, "hovered seat");
  }, []);

  /*  const getSeatLayerStyles = React.useMemo(() => {
 //3args
    const matchExpression = [
      "match",
      ["get", "id"],
      ...(hoveredSeat ? [hoveredSeat, "#3288bd"] : []),
      ...selectedSeat.flatMap((seat) => [seat, "#FF0000"]),
      "#00FF00", // Default color for non-selected seats
    ];

    return {
      id: "seats",
      type: "circle" as const,
      paint: {
        "circle-radius": 5,
        "circle-color":
          matchExpression.length > 4
            ? matchExpression
            : ["match", ["get", "id"], "", "#00FF00"],
      },
    };
  }, [hoveredSeat, selectedSeat]); */
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
          //["==", ["get", "id"], selectedSeat],
          ["in", ["get", "id"], ["literal", selectedSeat]],
          "#FF0000", // selected color
          "#00FF00", // default color
        ],
      },
    };
  }, [hoveredSeat, selectedSeat]);

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
            ref={mapRef}
            //minZoom={17}
            //maxZoom={20.5}
            initialViewState={{
              latitude: centralPoint.lat,
              longitude: centralPoint.lng,
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
      )}
    </>
  );
};

export default Mapa;
