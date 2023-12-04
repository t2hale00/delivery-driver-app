


function ShowCabinets({
  Cabinets,
  getCabinets,
  handleParcel,
  donetext,
  isButtonClicked,
  message
}) {
  return (
    <div className="ShowCabinets">
      <button className="ShowCabinets" onClick={() => getCabinets("available")}>
        show free cabinets
      </button>
      <button className="ShowCabinets" onClick={() => getCabinets("occupied")}>
        show pickup cabinets
      </button>
      <div>
        {Cabinets.map((cabinet) => (
          <div key={cabinet.cabinetid} className="Box">
            <p>cabinetid:{cabinet.cabinetid}</p>
            <p>Number:{cabinet.number}</p>
            <p>status:{cabinet.cabinetstatus}</p>
            
            
            <button
              onClick={() => {
                if (!isButtonClicked) {
                  handleParcel(cabinet.cabinetid, cabinet.number,cabinet.cabinetstatus,cabinet.location);
                }
              }}
              disabled={cabinet.isButtonClicked}
            >
              {donetext}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowCabinets;
