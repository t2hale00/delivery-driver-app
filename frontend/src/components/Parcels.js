import React, { useState } from "react";


function Parcels({ getParcels, parcels, Chooseparcel }) {
  const [selectedParcelId, setSelectedParcelId] = useState(null);

  const handleChooseParcel = (parcelId) => {
    if (!selectedParcelId) {
      // Perform the choose parcel action
      Chooseparcel(parcelId);

      // Update the state to prevent further clicks
      setSelectedParcelId(parcelId);
    }
  };

  return (
    <div className="Parcels">
      <button className="Parcels" onClick={() => getParcels()}>show undelivered Parcels</button>
      {parcels.map((parcel) => (
        <div key={parcel.id} className="Box">
          <p>id:{parcel.parcelid}</p>
          <p>senderid:{parcel.senderid}</p>
          <p>status:{parcel.status}</p>
          
          <button className="ChooseParcels"
            onClick={() => handleChooseParcel(parcel.parcelid)}
            disabled={selectedParcelId === parcel.parcelid}
          >
            choose this to delivery
          </button>
        </div>
      ))}
    </div>
  );
}

export default Parcels;
