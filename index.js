var express = require("express");
var app = express();
var ejs = require("ejs");
var sqlDAO = require("./mysqlDAO");
var mongoDAO = require("./mongoDAO");
const { check, validationResult } = require("express-validator");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log("GET on /");
  res.render("home");
});

app.get("/employees", (req, res) => {
  console.log("GET on /employees");

  sqlDAO
    .getEmp()
    .then((data) => {
      res.render("employees", { employees: data });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/employees/edit/:eid", (req, res) => {
  sqlDAO
    .getUpdate(req.params.eid)
    .then((data) => {
      console.log(data);
      res.render("editemployee", { employee: data[0], errors: undefined });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post(
  "/employees/edit/:eid",
  [check("ename").isLength({ min: 5 }).withMessage("Employee name must be at least 5 characters")],
  [check("role").equals("Manager").withMessage("Role must be either Manager or Employee")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sqlDAO
    .getUpdate(req.params.eid)
    .then((data) => {
      console.log(data);
      res.render("editemployee", { errors: errors.errors, employee: data[0] });;
    })
    .catch((err) => {
      res.send(err);
    });
    } else {
      // Further processing on
      // user supplied data
    }
  }
);

app.get("/departments", (req, res) => {
  console.log("GET on /departments");

  sqlDAO
    .getDept()
    .then((data) => {
      res.render("departments", { departments: data });
    })
    .catch((err) => {
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
