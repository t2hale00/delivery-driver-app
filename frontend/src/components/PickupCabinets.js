
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
            <div key={pickupcabinet.cabinetID} className="Box">
              <p>cabinet id: {pickupcabinet.cabinetID}</p>
              <p>status: {pickupcabinet.cabinetstatus}</p>
              <p>cabinet number{pickupcabinet.CabinetNumber}</p>
              <button
                className="smallbutton"
                onClick={() => {
                  handlePickupCabinets(pickupcabinet.cabinetID,pickupcabinet.CabinetNumber);
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
