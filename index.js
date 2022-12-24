var express = require("express");
var app = express();
var ejs = require("ejs");
var sqlDAO = require("./mysqlDAO");
var mongoDAO = require("./mongoDAO");
const { check, validationResult } = require("express-validator");
app.set("view engine", "ejs");

// Home page
app.get("/", (req, res) => {
  console.log("GET on /");
  res.render("home");
});

// Employees page
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

// Edit employee page
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
  [
    check("ename")
      .isLength({ min: 5 })
      .withMessage("Employee name must be at least 5 characters"),
  ],
  [
    check("role")
      .toUpperCase()
      .isIn(["MANAGER", "EMPLOYEE"])
      .withMessage("Role must be either Manager or Employee"),
  ],
  [check("salary").isFloat({ min: 0 }).withMessage("Salary must be > 0 ")],
  (req, res) => {
    console.log(req.body);
    var id = req.params.eid;
    var name = req.body.ename;
    var role = req.body.role;
    var salary = req.body.salary;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("editemployee", {
        errors: errors.errors,
        employee: { eid: id, ename: name, role: role, salary: salary },
      });
    } else {
      sqlDAO
        .updateEmployee(id, name, role, salary)
        .then(() => {
          res.redirect("/employees");
        })
        .catch((error) => {
          res.send(error);
        });
    }
  }
);

// Departements page
app.get("/depts", (req, res) => {
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

// Delete department
app.get("/depts/delete/:did", (req, res) => {
  sqlDAO
    .deleteDept(req.params.did)
    .then((data) => {
      res.redirect("/depts");
    })
    .catch(() => {
      res.render("deleteError", { d: req.params.did });
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
