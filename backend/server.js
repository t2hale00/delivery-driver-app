const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "driverdb",
});

app.get("/getFreeCabinets", (req, res) => {
  const { locker } = req.query;

  db.query(
    "select * from cabinets where cabinetstatus='available' and location =?",
    [locker],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log("get available cabinets");
      }
    }
  );
});

app.get("/getPickupCabinets", (req, res) => {
  const { locker } = req.query;

  db.query(
    "select * from cabinets where cabinetstatus='todelivery' and location =?",
    [locker],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log("get pickup cabinets");
      }
    }
  );
});

app.get("/getUndeliveredParcels", (req, res) => {
  const { locker } = req.query;

  db.query(
    "select * from parcels where status='undelivered' and location!=?",
    [locker],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log("get undelivered parcels");
      }
    }
  );
});

app.put("/updateforpickup", (req, res) => {
  const pickupcabinetNumber = req.body.pickupcabinetNumber;
  db.query(
    "update cabinets as c join parcels as p on c.code=p.reservationcode set c.cabinetstatus= 'available', p.status='undelivered' where c.number=?",
    [pickupcabinetNumber],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(`Cabinet ${pickupcabinetNumber} status changed`);
        console.log(`Cabinet ${pickupcabinetNumber} status changed`);
      }
    }
  );
});

app.put("/updatefordelivery", (req, res) => {
  const freecabinetNumber = req.body.freecabinetNumber;
  const parcelid = req.body.parcelid;
  // const freecabinetlocation=req.body.freecabinetlocation
  db.query(
    "update cabinets as c join parcels as p  set c.cabinetstatus= 'topickup', p.status='topickup' ,c.code=p.reservationcode ,p.iscodevalid=true,p.pickuplocation= c.location where c.number=? and p.parcelid=?",
    [freecabinetNumber, parcelid],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(`Cabinet ${freecabinetNumber} status changed,`);
        console.log(
          `Cabinet ${freecabinetNumber} status changed,parcel${parcelid} status changed`
        );
      }
    }
  );
});

app.listen(3003, () => {
  console.log("server for driver is running on port3003");
  db.connect(function (err) {
    if (err) throw err;
    console.log("database connected");
  });
});
