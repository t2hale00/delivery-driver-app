import "./App.css";
import React, { useState } from "react";
import Axios from "axios";

function App() {
  const [selectedLocker, setSelectedLocker] = useState("");
  const [message, setMessage] = useState("");
  const [freeCabinets, setFreeCabinets] = useState([]);
  const [showfreecabinets,setShowFreeCabinets]=useState(false)

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
        console.log("erro fetching ");
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
          <p className="LockerSelect">You selected:{selectedLocker}</p>
        )}
      </div>

      <div>
        {selectedLocker && (
          <button className="showfreecabinet"
          onClick={()=>{setShowFreeCabinets(!showfreecabinets)

          }}>show/hide free cabinet</button>
        )}
        {showfreecabinets&&<div>{freeCabinets.map((freecabinet) => (
          <div key={freecabinet.cabinetid} className="Box">
            <p>number:{freecabinet.number}</p>
            <p>status:{freecabinet.cabinetstatus}</p>
          </div>
        ))}</div>}
      </div>
    </div>
  );
}

export default App;
