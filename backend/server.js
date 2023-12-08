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
  database: "consumerdbtest",
});

app.get("/getFreeCabinets",(req,res)=>{
    const {locker}=req.query;

    db.query("select * from cabinets where cabinetstatus='Available' and Locationname =?",[locker],(err,result)=>{
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

  db.query("select * from cabinets where cabinetstatus='Occupied' and Locationname =?",[locker],(err,result)=>{
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

  db.query("select * from parcel where status='Parcel En Route' and location!=?",[locker],(err,result)=>{
      if(err){
          console.log(err);
      }else{
          res.send(result);
          console.log('get undelivered parcels');
      }
  })
})

app.put("/updateforpickup",(req,res)=>{
  const pickupcabinetID=req.body.pickupcabinetID
  db.query(
    "update cabinets as c join parcel as p on c.Code=p.reservationCode set c.cabinetstatus= 'Available', p.status='Parcel En Route' where c.cabinetID=? and p.reservationCode=c.Code",[pickupcabinetID],
    (err,result)=>{
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(`Cabinet ${pickupcabinetID} status changed`);
        console.log(`Cabinet ${pickupcabinetID} status changed`)
      }
    }
  )
})



//  generate a unique 4-digit code
function generateUniqueCode() {

  return Math.floor(1000 + Math.random() * 9000);
}

app.put("/updatefordelivery", async (req, res) => {
  const freecabinetid = req.body.freecabinetid;
  const parcelid = req.body.parcelid;
  const recipientName = req.body.recipientname;
  const freecabinetlocation= req.body.freecabinetlocation

  // Fetch recipient ID based on recipient name
  db.query(
    "SELECT userid FROM user WHERE name = ?",
    [recipientName],
    async (recipientErr, recipientResult) => {
      if (recipientErr) {
        console.error(recipientErr);
        res.status(500).send("Internal Server Error");
        return;
      }

      const recipientid = recipientResult[0].userid;

      // Generate a unique 4-digit code
      const generatedCode = generateUniqueCode();

      // Update cabinets and parcels with the generated code
      db.query(
        "UPDATE cabinets AS c JOIN parcel AS p ON c.CabinetID = ? AND p.parcelid = ? SET c.cabinetstatus = 'Delivered', p.status = 'Parcel Ready For Pickup', c.code = ?, p.pickupcode = ?, p.iscodevalid = true, p.pickuplocation = c.Locationname WHERE c.CabinetID = ? AND p.parcelid = ?",
        [freecabinetid, parcelid, generatedCode, generatedCode, freecabinetid, parcelid],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error(updateErr);
            res.status(500).send("Internal Server Error");
            return;
          }

          // Insert notification
          db.query(
           ' INSERT INTO notification (type, content, userid, timestamp)  VALUES ("pickup", "You have a parcel  ready for pick up, pickup code is ? and pickup location is ?", ?, NOW()); ',
            [generatedCode,freecabinetlocation,recipientid],
            (notificationErr, notificationResult) => {
              if (notificationErr) {
                console.error(notificationErr);
                res.status(500).send("Internal Server Error");
              } else {
                res.send(`Cabinetid ${freecabinetid} status changed.`);
                console.log(`Cabinetid ${freecabinetid} status changed, parcel ${parcelid} status changed,notification for user${recipientid} sent`);
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
  