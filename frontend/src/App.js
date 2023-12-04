import "./App.css";
import React, { useState } from "react";
import Axios from "axios";

function App() {
  const [selectedLocker, setSelectedLocker] = useState(false);
  const [message, setMessage] = useState("");
  const [freeCabinets, setFreeCabinets] = useState([]);
  const [pickupCabinets, setPickupCabinets] = useState([]);
  const [showfreecabinets, setShowFreeCabinets] = useState(false);
  const [showPickupCabinets, setShowPickupCabinets] = useState(false);
  const [showundeliveredparcels, setShowUndeliveredParcels] = useState(false);
  const [undeliveredParcels, setUndeliveredParcels] = useState([]);
  const[selectedParcel,setSelectParcel]=useState('');
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleLockerSelect = (event) => {
    const lockerValue = event.target.value;
    setSelectedLocker(lockerValue);
    setMessage("");

    //getFreeCabinets
    Axios.get("http://localhost:3003/getFreeCabinets", {
      params: { locker: lockerValue },
    })
      .then((response) => {
        setFreeCabinets(response.data);
      })
      .catch((err) => {
        console.log("erro fetching freecabinets");
      });

    //getPickupCabinets
    Axios.get("http://localhost:3003/getPickupCabinets", {
      params: { locker: lockerValue },
    })
      .then((response) => {
        setPickupCabinets(response.data);
      })
      .catch((err) => {
        console.log("erro fetching pickupcabinets");
      });

    //getUndeliveredParcels
    Axios.get("http://localhost:3003/getUndeliveredParcels", {
      params: { locker: lockerValue },
    })
      .then((response) => {
        setUndeliveredParcels(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePickupCabinets = (pickupcabinetNumber) => {
    Axios.put("http://localhost:3003/updateforpickup", {
      pickupcabinetNumber: pickupcabinetNumber,
    })
      .then((response) => {
        console.log("cabinet status changes to availeble");
        setMessage(
          `parcel in cabinet${pickupcabinetNumber} is picked,
         cabinet${pickupcabinetNumber} is free now`
        );
      })
      .catch((err) => {
        console.error("error updating cabinet status:", err);
      });
  };

  const handleSelectedParcel=(parcelid)=>{

    setSelectParcel(parcelid)
    setMessage(`parcel ${parcelid} is selected,`);
    setButtonClicked(true);

  }

  const handlePutParcelIn=(freecabinetnumber)=>{
    const parcelid=selectedParcel;
    Axios.put("http://localhost:3003/updatefordelivery",{
      freecabinetNumber:freecabinetnumber,parcelid:parcelid}).then(
        (response)=>{
          setButtonClicked(true);
          setMessage(`parcel ${parcelid} is put in cabinet${freecabinetnumber}`)
        }
      ).catch((err)=>{
        console.log("error fetching updatefor delivery:",err)
      })
    
  }




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
        {selectedLocker && <p>You selected:{selectedLocker}</p>}
      </div>
      <p>{message}</p>
      

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
                <p>status:{pickupcabinet.cabinetstatus} </p>
                <button
                  className="smallbutton"
                  onClick={() => {
                    handlePickupCabinets(pickupcabinet.number);
                  }}
                >
                  pick up the parcel
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
                    {selectedParcel&&<button className="selectfreecabinetbutton  smallbutton"
                    onClick={()=>{
                      handlePutParcelIn(freecabinet.number)
                      }}>
                      put parcel in
                    </button>}
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
            {showundeliveredparcels && selectedLocker && (
              <div>
                {!selectedParcel?<h2 style={{color:'red'}}>delivery step:<br/>
                1. select one parcel <br/>
                2.select a freecabinet to put in 
                </h2> : <h2 style={{color:'red'}}>{message}</h2>}
                {undeliveredParcels.map((undeliveredparcel) => (
                  <div key={undeliveredparcel.parcelid} className="Box">
                    <p>parcelid:{undeliveredparcel.parcelid}</p>
                    <p>status:{undeliveredparcel.status}</p>
                   
                    <p>pickuplocation:{undeliveredparcel.pickuplocation}</p>
                    <button className="smallbutton"
                     onClick={() => {
                      if (!buttonClicked) {
                        handleSelectedParcel(undeliveredparcel.parcelid);
                      }
                    }}
                    disabled={buttonClicked}
                    style={{
                      backgroundColor: buttonClicked ? '#a0c4ff' : '#fff', // Light blue when disabled
                      color: buttonClicked ? '#fff' : '#3a76b5', // White text when disabled
                      border: buttonClicked ? '2px solid #a0c4ff' : '2px solid #3a76b5', // Light blue border when disabled
                    }}
                  >
                    {buttonClicked ? 'Selected' : 'Select it'}
                    </button>
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
