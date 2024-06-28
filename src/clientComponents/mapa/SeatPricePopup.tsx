"use client";

import { popup } from "@/utils/types/mapTypes";
import React from "react";
import { Popup } from "react-map-gl/maplibre";

interface SeatPricePopupProps {
  popupInfo: popup | null;
  setPopupInfo: (data: popup | null) => void;
}

const SeatPricePopup: React.FC<SeatPricePopupProps> = ({
  popupInfo,
  setPopupInfo,
}) => {
  return (
    <>
      {popupInfo && (
        <Popup
          closeButton={false}
          closeOnMove={true}
          longitude={popupInfo.lngLat[0]}
          latitude={popupInfo.lngLat[1]}
          onClose={() => setPopupInfo(null)}
          anchor="top"
        >
          <div>
            <p>Asiento: {popupInfo.seatId}</p>
            <p>Fila: {popupInfo.seatRow}</p>
            <p>Costo: ${popupInfo.seatPrice}</p>
          </div>
        </Popup>
      )}
    </>
  );
};

export default SeatPricePopup;
