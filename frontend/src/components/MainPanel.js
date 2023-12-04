import React, { useState } from "react";
import LockerSelect from "./LockerSelect";
import ShowCabinets from "./ShowCabinets";
import Axios from "axios";
import Parcels from "./Parcels";


function MainPanel() {
  const [selectedLocker, setSelectedLocker] = useState("");
  const [Cabinets, setCabinets] = useState([]);
  const [message, setMessage] = useState("");
  const [doneText, setDoneText] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleLockerSelect = (event) => {
    setSelectedLocker(event.target.value);
    setMessage("");
  };

  const getCabinets = (status) => {
    if (!selectedLocker) {
      setMessage("please select Locker first");
    } else {
      Axios.get("http://localhost:3003/getCabinets", {
        params: { locker: selectedLocker, status: status },
      })
        .then((response) => {
          setCabinets(response.data);
          setDoneText(status === "available" ? "put parcel in" : "Pickup");
        })
        .catch((error) => {
          console.log("error fetching cabinets");
        });
    }
  };



  const [selectedParcel, setSelectedParcel] = useState(false);

  const Chooseparcel = (parcelid) => {
    setSelectedParcel(parcelid);

    console.log(selectedParcel);
    setMessage(`parcel ${parcelid} is selected`);
  };

  const handleParcel = (cabinetid, cabinetnumber,cabinetstatus) => {
    const parcelid=selectedParcel;
    if(!selectedParcel&& cabinetstatus==='available'){
      setMessage('select undelivered parcel first')}
      else{
    Axios.put("http://localhost:3003/update", { cabinetid: cabinetid ,cabinetstatus:cabinetstatus,parcelid:parcelid}).then(
      (response) => {
        if(cabinetstatus==='available'){
        console.log("cabinet status changed");
        setMessage(`parcel${parcelid} is put in cabinet${cabinetnumber} `);}
        else if(cabinetstatus==='todelivery'){
          setMessage(`parcel in cabinet${cabinetnumber} is picked up,cabinet${cabinetnumber} is available now`)
        }

        setCabinets((prevCabinets) =>
          prevCabinets.map((cabinet) =>
            cabinet.id === cabinetid
              ? { ...cabinet, isButtonClicked: true }
              : cabinet
          )
        );
      }
    )};
  };

  
  const [parcels, setParcels] = useState([]);

  const getParcels = () => {
    if (!selectedLocker) {
      setMessage("please select Locker first");
    } else {
      Axios.get("http://localhost:3003/getParcels", {
        params: { locker: selectedLocker },
      })
        .then((response) => {
          setParcels(response.data);
        })
        .catch((error) => {
          console.log("error fetching cabinets");
        });
    }
  };







  return (
    <div>
      <LockerSelect
        selectedLocker={selectedLocker}
        handleLockerSelect={handleLockerSelect}
      />
      <p>{message}</p>

      <ShowCabinets
        getCabinets={getCabinets}
        Cabinets={Cabinets}
        handleParcel={handleParcel}
        donetext={doneText}
        isButtonClicked={isButtonClicked}
      />
      <Parcels
        getParcels={getParcels}
        parcels={parcels}
        Chooseparcel={Chooseparcel}
      />
    </div>
  );
}

export default MainPanel;
