
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
                show/hide free cabinet
              </button>
            )}
      {showFreeCabinets && (
        <div>
          {freeCabinets.map((freecabinet) => (
            <div key={freecabinet.cabinetID} className="Box">
              <p>number: {freecabinet.CabinetNumber}</p>
              <p>status: {freecabinet.cabinetstatus}</p>
              {selectedParcel && (
                <button
                  className="selectfreecabinetbutton  smallbutton"
                  onClick={() => {
                    handlePutParcelIn(freecabinet.cabinetID,freecabinet.CabinetNumber,freecabinet.Locationname,freecabinet.Locationname);
                  }}
                >
                  Put parcel in
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
