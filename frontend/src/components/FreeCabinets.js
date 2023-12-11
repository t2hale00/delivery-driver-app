
import React from "react";
import { useState } from "react";

function FreeCabinets({ freeCabinets, selectedParcel, handlePutParcelIn,selectedLocker }) {

  const [showFreeCabinets, setShowFreeCabinets] = useState(false);
  return (
    <div>
        {selectedLocker && (
              <button
                onClick={() => {
                  setShowFreeCabinets(!showFreeCabinets);
                }}
              >
                Show/Hide Free Cabinets
              </button>
            )}
      {showFreeCabinets && (
        <div>
          {freeCabinets.map((freecabinet) => (
            <div key={freecabinet.cabinetID} className="Box">
              <p>Cabinet Number: {freecabinet.CabinetNumber}</p>
              <p>Status: {freecabinet.cabinetstatus}</p>
              {selectedParcel && (
                <button
                  className="selectfreecabinetbutton  smallbutton"
                  onClick={() => {
                    handlePutParcelIn(freecabinet.cabinetID,freecabinet.CabinetNumber,freecabinet.Locationname,freecabinet.Locationname);
                  }}
                >
                  Put Parcel In
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FreeCabinets;
