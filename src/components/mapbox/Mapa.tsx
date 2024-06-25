"use client";
import * as React from "react";
import Map, { Source, Layer } from "react-map-gl";
import type { FillLayer, MapLayerMouseEvent, MapRef } from "react-map-gl";
import { LngLatBounds } from "mapbox-gl";
import { calculateAngle } from "../../utils/utils";
import { Divider } from "@nextui-org/react";
import { PiMagnifyingGlassLight } from "react-icons/pi";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Spinner from "@/components/Spinner";
import { MdFavoriteBorder, MdOutlineInfo } from "react-icons/md";
import { BsPersonSquare } from "react-icons/bs";
import Image from "next/image";
import { GiTicket } from "react-icons/gi";
import { LuUserSquare, LuUserSquare2 } from "react-icons/lu";
const MAPTOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/**
 * @deprecated (to be deleted)
 */
//Deprecated component.

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

const Mapa: React.FC = () => {
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
  const [selectedSeat, setSelectedSeat] = React.useState<string[]>([""]);

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

      const clickedSeat = features?.find((f) => f.layer.id === "seats");

      /*    if (clickedSeat !== undefined) {
        handleSeatClick(event);
        return;
      } */
      if (clickedFeatureId === selectedFeature) {
        return;
      }

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
    [selectedFeature, lastClickedFeature]
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
    setHoveredSeat(hoveredSeatId || null);
  }, []);

  const getSeatLayerStyles = React.useMemo(() => {
    return {
      id: "seats",
      type: "circle" as const,
      paint: {
        "circle-radius": 10,
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
    <div className="flex flex-col h-screen w-full">
      {loading && <Spinner />}
      <Navbar
        style={{ maxWidth: "none !important" }}
        className="flex justify-between bg-[#121519]"
      >
        <NavbarBrand className="ml-8">
          <Image src="/tutiLogo.png" alt="tuti" width={100} height={100} />
        </NavbarBrand>
        <NavbarContent className="mr-8" justify="end">
          <NavbarItem>
            <PiMagnifyingGlassLight color="#0BDB8F" size={25} />
          </NavbarItem>
          <NavbarItem>
            <LuUserSquare color="#0BDB8F" size={25} />
          </NavbarItem>
          <NavbarItem>
            <GiTicket color="#0BDB8F" size={25} />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <header className="bg-[#1B2128] w-full h-12">
        <p className="text-base text-white ml-8 pl-9">La Vela Puerca</p>
        <p className="text-xs text-white ml-8 pl-9">
          29 de Septiembre - 20:00 - Anfiteatro Jose A. Flores - San Bernardino
        </p>
      </header>
      <div className="flex flex-1 h-2/3">
        {allData && (
          <div className="w-2/3 bg-slate-200  shadow-inner border-r-2 border-r-slate-300">
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
          <div className="bg-white  text-black border-l-1 border-gray-200 w-1/3 z-[1]`x mt-5 rounded-md overflow-auto">
            <header className="pl-5">
              <div className="flex gap-2 justify-between content-center">
                <p className="text-2xl mb-5">Selecciona tu entrada</p>
                <div className="flex gap-2 mr-8 pr-9">
                  <MdFavoriteBorder
                    cursor={"pointer"}
                    size={20}
                    color="gray"
                    onClick={() => {}}
                    className="hover:bg-gray-200 rounded-2xl"
                  />
                  <MdOutlineInfo
                    cursor={"pointer"}
                    size={20}
                    color="gray"
                    onClick={() => {}}
                    className="hover:bg-gray-200 rounded-2xl"
                  />
                </div>
              </div>
              <Button className="bg-white border-2 rounded-3xl mr-3 hover:bg-gray-100 hover:border-gray-400">
                Cantidad
              </Button>
              <Button className="bg-white border-2  rounded-3xl mr-3 hover:bg-gray-100 hover:border-gray-400">
                Precio
              </Button>
              <Button className="bg-white border-2 rounded-3xl mr-3 hover:bg-gray-100 hover:border-gray-400">
                Mejores asientos
              </Button>
            </header>
            <br />
            <Divider orientation="horizontal" />
            <div className="bg-gray-300">
              <p className="pl-5 pb-3 pt-3">
                <b>Preventa 2</b>
              </p>
            </div>
            <Divider orientation="horizontal" />
            {selectedData ? (
              <>
                <div className="pl-5 flex gap-3 mt-3 mb-3">
                  <p className=" text-gray-700">{selectedData?.nombre}</p>
                  <p className="text-gray-500">{selectedData?.codigo}</p>
                </div>

                <Divider />
              </>
            ) : (
              allData?.features?.map((dato: any) => {
                return (
                  <>
                    <div className="pl-5 flex gap-3 mt-3 mb-3">
                      <p className=" text-gray-700">{dato.properties.nombre}</p>
                      <p className="text-gray-500">{dato.properties.codigo}</p>
                    </div>

                    <Divider />
                  </>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mapa;
