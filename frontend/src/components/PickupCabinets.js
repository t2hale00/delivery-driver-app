
import React from "react";
import { useState } from "react";

function PickupCabinets({ pickupCabinets, handlePickupCabinets,selectedLocker, }) {

    const [showPickupCabinets, setShowPickupCabinets] = useState(false);
    
  return (
    <div>
     {selectedLocker && (
          <button
            onClick={() => {
              setShowPickupCabinets(!showPickupCabinets);
            }}
          >
            show/hide pickup cabinet
          </button>
        )}
      {showPickupCabinets && (
        <div>
          {pickupCabinets.map((pickupcabinet) => (
            <div key={pickupcabinet.cabinetid} className="Box">
              <p>cabinet number: {pickupcabinet.number}</p>
              <p>status: {pickupcabinet.cabinetstatus}</p>
              <button
                className="smallbutton"
                onClick={() => {
                  handlePickupCabinets(pickupcabinet.number);
                }}
              >
                Pick up the parcel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PickupCabinets;