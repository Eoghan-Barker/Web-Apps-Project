var express = require("express");
var app = express();
var ejs = require("ejs");
var sqlDAO = require("./mysqlDAO");
var mongoDAO = require("./mongoDAO");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log("GET on /");
  res.render("home");
});

app.get("/employees", (req, res) => {
  console.log("GET on /employees");

  sqlDAO.getEmp().then(data => {
    res.render("employees", {employees: data});
  })
  .catch(err => {
    res.send(err);
  });
});

app.get("/departments", (req, res) => {
  console.log("GET on /departments");
  
  sqlDAO.getDept().then(data => {
    res.render("departments", {departments: data});
  })
  .catch(err => {
    res.send(err);
  });
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
