"use client";

import React, { useEffect, useState, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

//TEST COMP. NO FUNCIONA

const MapRaw = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [hoveredData, setHoveredData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      center: [-58.38202, -34.60376],
      zoom: 14,
    });

    map.current.on("load", () => {
      // Load images and add sources
      Promise.all([
        fetch("./estadioJSON.geojson").then((res) => res.json()),
        fetch("./seats.geojson").then((res) => res.json()),
      ]).then(([estadioData, seatsData]) => {
        map.current.addSource("estadio", {
          type: "geojson",
          data: estadioData,
        });

        map.current.addSource("seats", {
          type: "geojson",
          data: seatsData,
        });

        map.current.addLayer({
          id: "estadio",
          type: "fill",
          source: "estadio",
          paint: {
            "fill-color": "#088",
            "fill-opacity": 0.8,
          },
        });

        map.current.addLayer({
          id: "seats",
          type: "circle",
          source: "seats",
          paint: {
            "circle-radius": 5,
            "circle-color": [
              "case",
              ["==", ["get", "id"], hoveredSeat],
              "#3288bd", // hover color
              ["in", ["get", "id"], ["literal", selectedSeats]],
              "#FF0000", // selected color
              "#C2C3C7", // default color
            ],
          },
        });

        map.current.on("mousemove", "seats", (e) => {
          if (e.features.length > 0) {
            setHoveredSeat(e.features[0].properties.id);
          } else {
            setHoveredSeat(null);
          }
        });

        map.current.on("click", "seats", (e) => {
          const seatId = e.features[0].properties.id;
          setSelectedSeats((prevSelectedSeats) => {
            if (prevSelectedSeats.includes(seatId)) {
              return prevSelectedSeats.filter((id) => id !== seatId);
            } else {
              return [...prevSelectedSeats, seatId];
            }
          });
        });
      });
    });

    map.current.on("move", () => {
      const { lng, lat } = map.current.getCenter();
      setHoveredData({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.current.getZoom().toFixed(2),
      });
    });
  }, []);

  return (
    <>
      <div
        id="map-container"
        ref={mapContainer}
        className="max-w-[50vw] absolute w-full h-full left-0 top-0 bottom-0"
      />
    </>
  );
};

export default MapRaw;
