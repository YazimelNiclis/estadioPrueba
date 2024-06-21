import React from "react";
import NavBar from "@/components/navbar/NavBar";
import MapHeader from "@/clientComponents/mapa/MapHeader";
import Map from "@/clientComponents/mapa/Map";
import MapRightSection from "@/clientComponents/mapa/MapRightSection";

async function getMapData() {
  const res = await fetch("http://localhost:3000/estadioJSON.geojson");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

async function page() {
  const mapData = await getMapData();
  return (
    <>
      <NavBar />
      <MapHeader />
      <Map data={mapData} />
      <MapRightSection data={mapData} />
    </>
  );
}

export default page;
