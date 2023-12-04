import "./App.css";
import React, { useState } from "react";
import Axios from "axios";

function App() {
  const [selectedLocker, setSelectedLocker] = useState("");
  const [message, setMessage] = useState("");
  const [freeCabinets, setFreeCabinets] = useState([]);
  const [pickupCabinets, setPickupCabinets] = useState([]);
  const [showfreecabinets, setShowFreeCabinets] = useState(false);
  const [showPickupCabinets, setShowPickupCabinets] = useState(false);
  const [showundeliveredparcels, setShowUndeliveredParcels] = useState(false);
  const [undeliveredParcels, setUndeliveredParcels] = useState([]);

  const handleLockerSelect = (event) => {
    const lockerValue = event.target.value;
    setSelectedLocker(lockerValue);
    setMessage("");
    Axios.get("http://localhost:3003/getFreeCabinets", {
      params: { locker: lockerValue },
    })
      .then((response) => {
        setFreeCabinets(response.data);
      })
      .catch((err) => {
        console.log("erro fetching freecabinets");
      });

    Axios.get("http://localhost:3003/getPickupCabinets", {
      params: { locker: lockerValue },
    })
      .then((response) => {
        setPickupCabinets(response.data);
      })
      .catch((err) => {
        console.log("erro fetching pickupcabinets");
      });


      Axios.get("http://localhost:3003/getUndeliveredParcels",{

      }).then((response)=>{
        setUndeliveredParcels(response.data)
      }).catch((err)=>{
        console.log(err);
      })
  };

  const handlePickupCabinets = (pickupcabinetNumber) => {
    Axios.put("http://localhost:3003/updateforpickup", {
      pickupcabinetNumber: pickupcabinetNumber,
    })
      .then((response) => {
        console.log("cabinet status changes to availeble");
        setMessage(
          `parcel in cabinet${pickupcabinetNumber} is picked,
          refresh page to check`
        );
      })
      .catch((err) => {
        console.error("error updating cabinet status:", err);
      });
  };




  return (
    <div className="App">
      {/* for lockerselect */}
      <div className="LockerSelect">
        <lable className="LockerSelect" htmlFor="dropdown">
          Select Locker:
        </lable>
        <select
          className="LockerSelect"
          id="dropwown"
          value={selectedLocker}
          onChange={handleLockerSelect}
        >
          <option value="">--Select--</option>
          <option value="Locker1">Locker1</option>
          <option value="Locker2">Locker2</option>
          <option value="Locker3">Locker3</option>
          <option value="Locker4">Locker4</option>
          <option value="Locker5">Locker5</option>
        </select>
        {selectedLocker && (
          <p >You selected:{selectedLocker}</p>
        )}
      </div>

      <p> {message}</p>

      {/* get pickupcabinets */}
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
                <p>number:{pickupcabinet.number}</p>
                <p>status:{pickupcabinet.cabinetstatus}</p>
                <button className="pickupbutton"
                  onClick={() => {
                    handlePickupCabinets(pickupcabinet.number);
                  }}
                >
                  pick up
                </button>
              </div>
            ))}
          </div>
        )}
      </div>



      {/* Big div for get free cabinets and undelivered parcels*/}
     <div className="pageContainer"> 
      <div className="container">

        {/* one div for get free cabinets*/}
<div className="leftbox">
   {selectedLocker && (
            <button
          
              onClick={() => {
                setShowFreeCabinets(!showfreecabinets);
              }}
            >
              show/hide free cabinet
            </button>
          )}
          {showfreecabinets && (
            <div>
              {freeCabinets.map((freecabinet) => (
                <div key={freecabinet.cabinetid} className="Box">
                  <p>number:{freecabinet.number}</p>
                  <p>status:{freecabinet.cabinetstatus}</p>
                </div>
              ))}
            </div>
          )}
</div>

        {/* one div for show undelivered parcels*/}
        <div className="rightbox">
         
          {selectedLocker && (
            <button
            
              onClick={() => {
                setShowUndeliveredParcels(!showundeliveredparcels);
              }}
            >
              show/hide undelivered parcels
            </button>
          )}
            {showundeliveredparcels && (
            <div>
              {undeliveredParcels.map((undeliveredparcel) => (
                <div key={undeliveredparcel.parcelid} className="Box">
                  <p>parcelid:{undeliveredparcel.parcelid}</p>
                  <p>status:{undeliveredparcel.status}</p>
                </div>
              ))}
            </div>
          )}

        </div>
        
      </div>
      </div>
    </div>
  );
}

export default App;
