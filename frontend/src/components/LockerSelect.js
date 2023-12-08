
import React from "react";

function LockerSelect({ selectedLocker, handleLockerSelect }) {
  return (
    <div className="LockerSelect">
      <label className="LockerSelect" htmlFor="dropdown">
        Select Locker:
      </label>
      <select
        className="LockerSelect"
        id="dropwown"
        value={selectedLocker}
        onChange={handleLockerSelect}
      >
        <option value="">--Select--</option>
        <option value="Prisma Linnanmaa Oulu">Prisma Linnanmaa Oulu</option>
        <option value="Prisma Limingantulli Oulu">Prisma Limingantulli Oulu</option>
        <option value="Prisma Raksila Oulu">Prisma Raksila Oulu</option>
        <option value="K-Citymarket Oulu Rusko">K-Citymarket Oulu Rusko</option>
        <option value="K-Citymarket Oulu Raksila">K-Citymarket Oulu Raksila</option>
      </select>
      {selectedLocker && <p>You selected: {selectedLocker}</p>}
    </div>
  );
}

export default LockerSelect;
