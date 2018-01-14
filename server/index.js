const express = require("express");
const app = express();

const addr = process.env.ADDR || "localhost:4000";
const [host, port] = addr.split(":");

let allUserTransactions = [];
let userNames = ["Alice", "Bob", "Chris", "Doris"];
let items = ["coffee", "bagel", "sandwich", "milkshake", "water", "salad"];
let transaction = generateTransactions(500);
let mapsTrans = []; // list of all valid transactions for graph or map

app.get("/trans", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.json(transaction);
});

app.get("/test", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //return all not-completed tasks in the database
    let myJSON = getUserTransactions(req.query.name);
    res.json(myJSON);
});

app.get("/test2", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  var d_start = new Date(2014, 1, 1, 0, 0, 0, 0);
  var d_end = new Date(2017, 12, 12, 59, 59, 59, 999);
  graphTrans(transaction, "coffee", d_start, d_end, 49.2827, -123, 100000);
  var myJSON = mapsTrans;
  res.json(myJSON);

});


app.get("/test3/:lat&:item", (req, res) => {
  var d_start = new Date(2014, 1, 1, 0, 0, 0, 0);
  var d_end = new Date(2017, 12, 12, 59, 59, 59, 999);
  graphTrans(transaction, req.params.item, d_start, d_end, req.params.lat, -123, 100000);
  var myJSON = mapsTrans;
  res.json(myJSON);

});

app.listen(port, host, () => {
    console.log(`server is listening at http://${addr}....`);
});

function generateTransactions(num) {
  let trans = [num];
  for (let i = 0; i < num; i++) {
    trans[i] = {
      user: userNames[Math.floor(Math.random() * userNames.length)],
      item: items[Math.floor(Math.random() * items.length)],
      price: getRandomInRange(0.5, 30, 2),
      date: generateNewDate(),
      lat: getRandomInRange(48, 52, 4),
      lon: getRandomInRange(-122, -124, 4),
    }
    
  }
  return trans;
}

function generateNewDate() {
  var year = getRandomInRange(2010, 2018, 0);
  var month = getRandomInRange(1, 12, 0);
  if (month == 4 || month == 6 || month == 9 || month == 11) {
    var days = getRandomInRange(1, 30, 0);
  } else if (month == 2) {
    if (year % 4 == 0) {
      var days = getRandomInRange(1,29,0);
    } else {
      var days = getRandomInRange(1, 28, 0);
    }
  } else {
    var days = getRandomInRange(1,31,0);
  }
  var d = new Date(year,
                  month,
                  days,
                  getRandomInRange(0,23,0), //hour
                  getRandomInRange(0,59,0), //minute
                  getRandomInRange(0,59,0), //second
                  getRandomInRange(0,999,0)); //millisecond
  return d;
}

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}

function getUserTransactions (name) {
  var count = 0;
  //console.log(transaction);
  if (allUserTransactions !== []) {
    allUserTransactions = [];
  }
  for(let i = 0; i < transaction.length; i++) {
    if (transaction[i].user == name) {
       allUserTransactions.push(transaction[i]);
    }
  }
  return allUserTransactions;
}

function graphTrans (data, item, startDate, endDate, lat, lon, radius){
  if ( mapsTrans != []) {
    mapsTrans = [];
  }
  for(i=0; i < data.length; i++ ){
    if(data[i].item == item){
      if (data[i].date.getTime() > startDate.getTime() &&
          data[i].date.getTime() < endDate.getTime()) {
            if (getDistanceFromLatLonInM(lat, lon, data[i].lat, data[i].lon) < radius) {
              mapsTrans.push(data[i]);
            }
          }
        }
      }
    }



function isInside(latCenter, lonCenter, radius, latTest, lonTest){
  let r = 6371000;
  let dlon = lonTest - lonCenter;
  let dlat = latTest - latCenter;
  let a = Math.pow((Math.sin(dlat/2)), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow( (Math.sin(dlon/2)), 2);
  let c = 2 * Math.pow(Math.atan( Math.sqrt(a), Math.sqrt(1-a) ), 2);
  let d = r * c; //(where R is the radius of the Earth)
  if (d <= radius){return 1;}
  else {return 0;}
}

//TODO currently only checking Lat. Long not working.
function isInsideBox(latCenter, lonCenter, radius, latTest, lonTest){
  return ( latCenter + radius > latTest &&
           latCenter - radius < latTest);// && // latTest between latCenter +- radius
        //   lonCenter + radius < lonTest &&
        //   lonCenter - radius > lonTest); // lonTest between lonCenter +- radius

/*
  var eRad = 6517219; // metres
  var latCenter_rad = Math.radians(latCenter);
  var latTest_rad = Math.radians(latTest);
  var dlat = Math.radians(latTest-latCenter);
  var dlon = Math.radians(lonTest-lonCenter);

  var a = Math.sin(dlat/2) * Math.sin(dlat/2) +
        Math.cos(latCenter) * Math.cos(latTest) *
        Math.sin(dlon/2) * Math.sin(dlon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var d = eRad * c;

  return (radius < d);
  */
}

 Math.radians = function (degrees) {
   return degrees* Math.PI/180;
 };


 function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
   var erad = 6371000; // Radius of the earth in m
   var dLat = deg2rad(lat2-lat1);  // deg2rad below
   var dLon = deg2rad(lon2-lon1);

   var a =
     Math.sin(dLat/2) * Math.sin(dLat/2) +
     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
     Math.sin(dLon/2) * Math.sin(dLon/2)
     ;
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
   var d = erad * c; // Distance in km

   return d;

 }

 function deg2rad(deg) {
   return deg * (Math.PI/180)
 }
