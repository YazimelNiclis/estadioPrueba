"use client";
import * as React from "react";
import Map, { Source, Layer } from "react-map-gl";
import type { FillLayer, MapLayerMouseEvent, MapRef } from "react-map-gl";
import { LngLatBounds } from "mapbox-gl";
import { calculateAngle } from "../utils/utils";
import { Divider } from "@nextui-org/react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import Spinner from "@/app/components/Spinner";
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

function EstadioYazi() {
  const [allData, setAllData] = React.useState<any>();
  const [allDataInferior, setAllDataInferior] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(true);
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
  const [selectedFeatures, setSelectedFeatures] = React.useState<string[]>([]);
  const [selectedFeature, setSelectedFeature] = React.useState<string | null>(
    null
  );
  const [initialView, setInitialView] = React.useState<any>(null);
  const [lastClickedFeature, setLastClickedFeature] = React.useState<
    string | null
  >();
  const mapRef = React.useRef<MapRef>(null);
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
      return prevSelected;
    });
  };

  const handleMapRotation = (
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
      .catch((err) => console.error("Could not load data", err))
      .finally(() => {
        setLoading(false);
      });

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

  React.useEffect(() => {
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

  return (
    <div className="flex flex-col h-screen w-11/12">
      {loading && <Spinner />}
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">ITTI</p>
        </NavbarBrand>
        <NavbarContent className=" sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#">
              Deportes
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="#" aria-current="page">
              Musica
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Eventos
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href="#">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="#" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Divider orientation="horizontal" />
      <div className="flex flex-1">
        {allData && (
          <div className="w-1/2 p-4 m-4 bg-slate-200">
            <Map
              ref={mapRef}
              minZoom={17}
              maxZoom={20.5}
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

        {hoveredData && (
          <div className="bg-white text-black border-1 border-gray-200 w-1/2 p-4 z-[1] m-4 rounded-md overflow-auto">
            <header>
              <p className="text-3xl text-center">Recital Charly Garcia</p>
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
            </header>
          </div>
        )}
      </div>
    </div>
  );
}

export default EstadioYazi;
