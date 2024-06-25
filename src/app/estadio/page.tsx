import React from "react";
import NavBar from "@/components/navbar/NavBar";
import MapHeader from "@/clientComponents/mapa/MapHeader";
import MapView from "@/clientComponents/mapa/MapView";
import MapRightSection from "@/clientComponents/mapa/MapRightSection";
import MapPadre from "@/clientComponents/mapa/MapPadre";

async function getMapData() {
  const res = await fetch("http://localhost:3000/estadioJSON.geojson");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
async function getMapSeats() {
  const res = await fetch("http://localhost:3000/seats.geojson");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

async function page() {
  const mapData = await getMapData();
  const mapSeats = await getMapSeats();
  return (
    <>
      <NavBar />
      <MapHeader />
      <MapPadre data={mapData} seats={mapSeats} />
    </>
  );
}

export default page;
