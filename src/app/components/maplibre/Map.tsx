"use client";

import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
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
            "circle-radius": 5,
            "circle-color": "#000",
          },
        });
      });
    }
  }, [allData]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
