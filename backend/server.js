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

app.get("/getCabinets", (req, res) => {
  const { locker, status } = req.query;

  let query = "select * from cabinets where location=?";
  if (status === "available") {
    query = "select * from cabinets where location=? and cabinetstatus = 'available'";
  } else {
    query = " select * from cabinets where location=? and cabinetstatus='todelivery'";
  }

  db.query(query, [locker], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
      console.log("got data");
    }
  });
});

app.get("/getParcels", (req, res) => {
  const { locker } = req.query;

  db.query(
    "select * from parcels where status='undelivered'",
   
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
        console.log("got undelivery parcels");
      }
    }
  );
});

app.put("/update",(req,res)=>{
  const cabinetid=req.body.cabinetid;
  const parcelid=req.body.parcelid;
  db.query(
    "update cabinets as c "+" join parcels as p "+" on c.code=p.reservationcode "+" set c.cabinetstatus =case when c.cabinetstatus='available' then 'topickup' when c.cabinetstatus='todelivery' then 'available' else c.cabinetstatus end , " +"  p.status=case when p.status='todelivery' then 'undelivered' else p.status end, p.iscodevalid=true where c.cabinetid=?",[cabinetid],
    (err,result)=>{
      if(err){
        console.log(err);
      }else {
        res.send(`cabinet${cabinetid}status changed,${parcelid}status changed`);
        console.log(`${cabinetid}status changed,${parcelid}status changed`)
      }
    }
  )

})


// app.put("/update", (req, res) => {
//   const id = req.body.id;
//   const cabinetstatus = req.body.cabinetstatus;
//   const parcelid = req.body.parcelid;

//   if (cabinetstatus === "todelivery") {
//     db.query(
//       "update cabinets set cabinetstatus='available' where id=?",
//       [id],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//           res.send(`${id}changed status from 'occupied' to 'available`);
//           console.log(`cabinet${id}changed status from 'occupied' to 'available`);
//         }
//       }
//     );
//   } else if (cabinetstatus === "available") {
//     const sqlQuery1 = "UPDATE cabinets SET status='waittopickup', iscodevalid=true WHERE id=?";
// const sqlQuery2 = "UPDATE parcel SET status='waittopickup' WHERE parcelid=?";

// db.query(sqlQuery1, [id], (err1, result1) => {
//   if (err1) {
//     console.log(err1);
//   } else {
//     // Execute the second query
//     db.query(sqlQuery2, [parcelid], (err2, result2) => {
//       if (err2) {
//         console.log(err2);
//       } else {
//         res.send(`${id} changed status from 'available' to 'occupied', parcel status changed to 'waittopickup`);
//         console.log(`${id} changed status from 'available' to 'occupied`);
//       }
//     });
//   }
// });


    
//   }
// });


app.listen(3003, () => {
  console.log("server for driver is running on port3003");
  db.connect(function (err) {
    if (err) throw err;
    console.log("database connected");
  });
});
