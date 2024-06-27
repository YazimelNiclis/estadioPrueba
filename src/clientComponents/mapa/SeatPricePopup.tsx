"use client";

import React from "react";
import { Popup } from "react-map-gl/maplibre";

interface SeatPricePopupProps {
  seatId?: string;
  seatPrice?: number | undefined;
  lngLat: [number, number];
}

const SeatPricePopup: React.FC<SeatPricePopupProps> = ({
  seatId,
  seatPrice,
  lngLat,
}) => {
  const [showPopup, setShowPopup] = React.useState<boolean>(true);

  return (
    <>
      {showPopup && (
        <Popup
          longitude={lngLat[0]}
          latitude={lngLat[1]}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setShowPopup(false)}
          anchor="top"
        >
          <div>
            <p>Seat: {seatId}</p>
            <p>Price: ${seatPrice}</p>
          </div>
        </Popup>
      )}
    </>
  );
};

export default SeatPricePopup;
