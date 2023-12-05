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

app.get("/getFreeCabinets",(req,res)=>{
    const {locker}=req.query;

    db.query("select * from cabinets where cabinetstatus='available' and location =?",[locker],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
            console.log('get available cabinets');
        }
    })
})

app.get("/getPickupCabinets",(req,res)=>{
  const {locker}=req.query;

  db.query("select * from cabinets where cabinetstatus='todelivery' and location =?",[locker],(err,result)=>{
      if(err){
          console.log(err);
      }else{
          res.send(result);
          console.log('get pickup cabinets');
      }
  })
})

app.get("/getUndeliveredParcels",(req,res)=>{
  const {locker}=req.query;

  db.query("select * from parcels where status='undelivered' and location!=?",[locker],(err,result)=>{
      if(err){
          console.log(err);
      }else{
          res.send(result);
          console.log('get undelivered parcels');
      }
  })
})

app.put("/updateforpickup",(req,res)=>{
  const pickupcabinetNumber=req.body.pickupcabinetNumber
  db.query(
    "update cabinets as c join parcels as p on c.code=p.reservationcode set c.cabinetstatus= 'available', p.status='undelivered' where c.number=?",[pickupcabinetNumber],
    (err,result)=>{
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(`Cabinet ${pickupcabinetNumber} status changed`);
        console.log(`Cabinet ${pickupcabinetNumber} status changed`)
      }
    }
  )
})

app.put("/updatefordelivery", (req, res) => {
  const freecabinetNumber = req.body.freecabinetNumber;
  const parcelid = req.body.parcelid;
  const senderid = req.body.userid; // Assuming this is the sender's ID

  // Fetch recipient ID based on recipient name
  const recipientName = req.body.recipientname; // Make sure to include recipientName in your request from the frontend

  db.query(
    "SELECT userid FROM user WHERE name = ?",
    [recipientName],
    (recipientErr, recipientResult) => {
      if (recipientErr) {
        console.error(recipientErr);
        res.status(500).send("Internal Server Error");
        return;
      }

      const recipientid = recipientResult[0].userid;

      // Update cabinets and parcels
      db.query(
        "UPDATE cabinets AS c JOIN parcels AS p ON c.number = ? AND p.parcelid = ? SET c.cabinetstatus = 'topickup', p.status = 'topickup', c.code = p.reservationcode, p.iscodevalid = true, p.pickuplocation = c.location WHERE c.number = ? AND p.parcelid = ?",
        [freecabinetNumber, parcelid, freecabinetNumber, parcelid],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error(updateErr);
            res.status(500).send("Internal Server Error");
            return;
          }

          // Insert notification
          db.query(
            "INSERT INTO notification (type, content, userid, timestamp) VALUES ('pickup', 'Your sending parcel is sent to destination', ?, NOW())",
            [recipientid], // Use recipientid instead of senderid
            (notificationErr, notificationResult) => {
              if (notificationErr) {
                console.error(notificationErr);
                res.status(500).send("Internal Server Error");
              } else {
                res.send(`Cabinet ${freecabinetNumber} status changed.`);
                console.log(`Cabinet ${freecabinetNumber} status changed, parcel ${parcelid} status changed`);
              }
            }
          );
        }
      );
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
  