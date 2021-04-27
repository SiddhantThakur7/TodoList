//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/climate", function(req, res){
  const url = "opeweatherAPI";
  https.get(url, function(response){
    console.log(response.statusCode);
    response.on("data", function(data){

      var jdata = (JSON.parse(data));
      const temp = jdata.main.temp;
      console.log(temp);

      var des = jdata.weather[0].description;
      console.log(des);

      var icon = jdata.weather[0].icon;

      res.write("<h1>The weather now is " + des + " conditions </h1>");
      res.write("<h1>The temperature in MH is " + temp + " celcius</h1>");
      res.send();
    });
  });
});

app.post("/", function(req, res){

  var n1 = Number(req.body.num1);
  var n2 = Number(req.body.num2);
  var result = n1 + n2;
  res.send("Result = " + result);
});


app.listen(3000, function(){
  console.log("Server Started");
});
