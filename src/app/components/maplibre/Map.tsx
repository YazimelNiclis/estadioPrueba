"use client";

import React, { useRef, useEffect, useState } from "react";
import maplibregl, { MapLayerMouseEvent, MapMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";

//TEST COMP. RAW MAPLIBRE MIGRATION

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

/* 
const centralPoint = { lat: -25.2921546, lng: -57.6573 };
const mapBounds = new LngLatBounds(
  [-57.6595, -25.2931], // inf. izq
  [-57.655, -25.2912] // sup. der
); */

export default function Map() {
  const [allData, setAllData] = React.useState<any>(null);
  const [seatData, setSeatData] = React.useState<Seat[]>([]);

  const [hoveredSection, setHoveredSection] = React.useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng] = useState(139.753);
  const [lat] = useState(35.6844);
  const [zoom] = useState(14);

  useEffect(() => {
    Promise.all([
      fetch("./estadioJSON.geojson").then((resp) => resp.json()),
      fetch("./seats.geojson").then((resp) => resp.json()),
    ])
      .then(([estadioJSON, seatsJSON]) => {
        setAllData(estadioJSON);
        setSeatData(seatsJSON);
        console.log("fetched info");
      })
      .catch((err) => console.error("Could not load data", err));

    if (map.current) return; // evita que se inicie mas de una vez el mapa

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
      center: [-57.6573, -25.2921546],
      zoom: zoom,
    });
  }, []);

  useEffect(() => {
    if (allData !== null) {
      map.current.on("load", () => {
        map.current.addSource("estadio", {
          type: "geojson",
          data: allData,
        });

        map.current.addSource("seats", {
          type: "geojson",
          data: seatData,
        });

        map.current.addLayer({
          id: "estadio",
          type: "fill",
          source: "estadio",
          paint: {
            "fill-color": "#3288bd",
            "fill-opacity": 0.8,
          },
        });

        map.current.addLayer({
          id: "seats",
          type: "circle",
          source: "seats",
          paint: {
            "circle-radius": 8,
            "circle-color": "#C2C3C7", // Default color
          },
        });
        map.current.on("mousemove", "estadio", (event: MapLayerMouseEvent) => {
          const { features } = event;
          const hoveredSectionId = features && features[0]?.properties?.id;
          if (hoveredSectionId == hoveredSection) {
            return;
          }
          if (selectedSection && hoveredSectionId === selectedSection) {
            setHoveredSection(null);
          } else {
            setHoveredSection(hoveredSectionId || null);
          }
        });

        map.current.on("mouseover", "seats", (event: MapLayerMouseEvent) => {
          const { features } = event;
          console.log(features, "seat hover features event obj");

          const hoveredSeatId = features && features[0]?.properties?.id;
          setHoveredSeat(hoveredSeatId || null);
        });

        map.current.on("click", "seats", (event: MapLayerMouseEvent) => {
          const { features } = event;
          console.log(features, "seat click features obj");

          const seatId = features && features[0]?.properties.id;

          setSelectedSeats((prevSelectedSeats) => {
            if (prevSelectedSeats.includes(seatId)) {
              return prevSelectedSeats.filter((id) => id !== seatId);
            } else {
              return [...prevSelectedSeats, seatId];
            }
          });
        });
        /////////////
      });
    }
  }, [allData]);

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      map.current.setPaintProperty("seats", "circle-color", [
        "case",
        ["==", ["get", "id"], hoveredSeat],
        "#3288bd", // hover color
        ["in", ["get", "id"], ["literal", selectedSeats]],
        "#FF0000", // selected color
        "#C2C3C7", // default color
      ]);

      /*  map.current.setPaintProperty("estadio", "fill-color", [
        "case",
        ["==", ["get", "id"], hoveredSection],
        "#3288bd", // hover color
        ["==", ["get", "id"], selectedSection],
        "#FF0000", // selected color
        "#088", // default color
      ]); */
    }
  }, [hoveredSeat, selectedSeats]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
