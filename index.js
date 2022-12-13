var express = require("express");
var app = express();
var ejs = require("ejs");
var mongoDAO = require("./mongoDAO");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log("GET on /");
  //res.sendFile(__dirname + "/HomePage.html");
  res.render("home");
});

app.get("/employees", (req, res) => {
  console.log("GET on /employees");
  res.render("employees");
});

app.get("/departments", (req, res) => {
  console.log("GET on /departments");
  res.render("departments");
});

app.get("/employeesMongoDB", (req, res) => {
  console.log("GET on /employeesMngoDB");

  mongoDAO
    .findAll()
    .then((data) => {
      res.render("employeesMongoDB", { employees: data });
    })
    .catch((error) => {
      res.send(error);
    });
});

app.listen(3004, () => {
  console.log("listening on port 3004");
});
