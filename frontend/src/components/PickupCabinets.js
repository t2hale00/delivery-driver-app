
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
            Show/Hide Cabinets for Pickup
          </button>
        )}
      {showPickupCabinets && (
        <div>
          {pickupCabinets.map((pickupcabinet) => (
            <div key={pickupcabinet.cabinetID} className="Box">
              <p>Cabinet ID: {pickupcabinet.cabinetID}</p>
              <p>Status: {pickupcabinet.cabinetstatus}</p>
              <p>Cabinet Number{pickupcabinet.CabinetNumber}</p>
              <button
                className="smallbutton"
                onClick={() => {
                  handlePickupCabinets(pickupcabinet.cabinetID,pickupcabinet.CabinetNumber);
                }}
              >
                Pick up the Parcel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PickupCabinets;
