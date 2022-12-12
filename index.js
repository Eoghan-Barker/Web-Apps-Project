var express = require("express");
var app = express();

app.get("/", (req, res) => {
  console.log("GET on /");
  res.sendFile(__dirname + "/HomePage.html");
});

app.get("/employees", (req, res) => {
    console.log("GET on /employees");
});

app.get("/departments", (req, res) => {
    console.log("GET on /departments");
});

app.get("/employeesMongoDB", (req, res) => {
    console.log("GET on /employeesMngoDB");
});

app.listen(3004, () => {
  console.log("listening on port 3004");
});