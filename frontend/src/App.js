// test
import "./App.css";
import React, { useState } from "react";
import Axios from "axios";
import LockerSelect from "./components/LockerSelect";
import PickupCabinets from "./components/PickupCabinets";
import FreeCabinets from "./components/FreeCabinets";
import UndeliveredParcels from "./components/UndeliveredParcels";

function App() {
  const [selectedLocker, setSelectedLocker] = useState(false);
  const [message, setMessage] = useState("");
  const [freeCabinets, setFreeCabinets] = useState([]);
  const [pickupCabinets, setPickupCabinets] = useState([]);
  const [undeliveredParcels, setUndeliveredParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
const[notification,setNotification]=useState('')
const[selectedParcelrecipientName,setSelectedParcelrecipientName]=useState('');

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
        console.log("error fetching free cabinets");
      });
 //getPickupCabinets
    Axios.get("http://localhost:3003/getPickupCabinets", {
      params: { locker: lockerValue },
    })
      .then((response) => {
        setPickupCabinets(response.data);
      })
      .catch((err) => {
        console.log("error fetching pickup cabinets");
      });
  //getUndeliveredParcels
    Axios.get("http://localhost:3003/getUndeliveredParcels", {
      params: { locker: lockerValue },
    })
      .then((response) => {
        setUndeliveredParcels(response.data);
      })
      .catch((err) => {
        console.log("error fetching undelivered parcels");
      });
  };

  const handlePickupCabinets = (pickupcabinetID,pickupcabinetnumber) => {
    Axios.put("http://localhost:3003/updateforpickup", {
      pickupcabinetID: pickupcabinetID,
    })
      .then((response) => {
        console.log("cabinet status changes to available");
        setMessage(
          `parcel in cabinet${pickupcabinetnumber} is picked,
         cabinet${pickupcabinetnumber} is free now`
        );
        setTimeout(() => {
          setPickupCabinets((prevpickupCabinets) =>
            prevpickupCabinets.filter(
              (pickupcabinet) => pickupcabinet.cabinetID !==  pickupcabinetID
            )
          );
        }, 2000);
      })
      .catch((err) => {
        console.error("error updating cabinet status:", err);
      });
  };

  const handleSelectedParcel = (parcelid,recipientname) => {
    setSelectedParcel(parcelid);
    setMessage(`parcel ${parcelid} is selected,`);
    setButtonClicked(true);
    setSelectedParcelrecipientName(recipientname)
  };

  const handlePutParcelIn = (freecabinetid,freecabinetnumber,freecabinetLocationname) => {
    const parcelid = selectedParcel;
 const recipientname=selectedParcelrecipientName;
 const cabinetlocationname=freecabinetLocationname
 
    Axios.put("http://localhost:3003/updatefordelivery", {
      freecabinetid: freecabinetid,
      parcelid: parcelid,
      recipientname:recipientname,
      freecabinetlocation:cabinetlocationname,
    })
      .then((response) => {
        setButtonClicked(true);
        setMessage(`parcel ${parcelid} is put in cabinet${freecabinetnumber}`);

        setTimeout(() => {
          setFreeCabinets((prevCabinets) =>
            prevCabinets.filter(
              (freecabinet) => freecabinet.cabinetID !== freecabinetid
            )
          );
          setUndeliveredParcels((prevParcels) =>
            prevParcels.filter(
              (undeliveredparcel) => undeliveredparcel.parcelid !== parcelid
            )
          );
        }, 2000);
      })
      .catch((err) => {
        console.log("error fetching update for delivery:", err);
      });
  };

  return (
    <div className="App">
      <LockerSelect
        selectedLocker={selectedLocker}
        handleLockerSelect={handleLockerSelect}
      />
      <p>{message}</p>

      <PickupCabinets
       
        pickupCabinets={pickupCabinets}
        handlePickupCabinets={handlePickupCabinets}
        selectedLocker={selectedLocker}
        
      />

      <div className="pageContainer">
        <div className="container">
          <FreeCabinets
           
            freeCabinets={freeCabinets}
            selectedParcel={selectedParcel}
            handlePutParcelIn={handlePutParcelIn}
            selectedLocker={selectedLocker}
          />

          <UndeliveredParcels
        selectedParcel={selectedParcel}
            undeliveredParcels={undeliveredParcels}
            handleSelectedParcel={handleSelectedParcel}
            message={message}
            selectedLocker={selectedLocker}

          />
        </div>
      </div>




    </div>
  );
}

export default App;
