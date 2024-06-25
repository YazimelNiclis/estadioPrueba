import React from "react";
import MapView from "./MapView";
import MapRightSection from "./MapRightSection";

function MapPadre(props: { data: any; seats: any }) {
  //manejar estados aquiii
  return (
    <div className="flex flex-1 max-h-[45vw] w-full h-full">
      <MapView data={props.data} seats={props.seats} />
      <MapRightSection data={props.data} />
    </div>
  );
}

export default MapPadre;
