import React from 'react';
import MapHeader from '@/clientComponents/mapa/MapHeader';
import MapPadre from '@/clientComponents/mapa/MapPadre';
import NavBar from '@/components/navbar/NavBar';

async function getMapData() {
  const res = await fetch('http://localhost:3000/sectores.geojson');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}
async function getMapSeats() {
  const res = await fetch('http://localhost:3000/asientos-2.geojson');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

async function page() {
  const mapData = await getMapData();
  const mapSeats = await getMapSeats();
  return (
    <div className="min-h-screen w-full">
      <NavBar />
      <MapHeader />
      <MapPadre data={mapData} seats={mapSeats} />
    </div>
  );
}

export default page;
