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
            console.log(result);
        }
    })
})




app.listen(3003, () => {
    console.log("server for driver is running on port3003");
    db.connect(function (err) {
      if (err) throw err;
      console.log("database connected");
    });
  });
  