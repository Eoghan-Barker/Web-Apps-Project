const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
var sqlDAO = require("./mysqlDAO");
var mongoDAO = require("./mongoDAO");

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// Home page
app.get("/", (req, res) => {
  console.log("GET on /");
  res.render("home");
});

// Employees page
app.get("/employees", (req, res) => {
  console.log("GET on /employees");

  // Show sql employee table
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
  console.log("GET on /employees/edit");

  // Show sql data for selected employee
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

// Handle post request for editing employee details in sql table
// Uses express validation middleware to ensure fields contain correct information
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
    var id = req.params.eid;
    var name = req.body.ename;
    var role = req.body.role;
    var salary = req.body.salary;

    const errors = validationResult(req);

    // If no errors, send the sql query to update employee, else stay on page and
    // display the error messages
    if (!errors.isEmpty()) {
      res.render("editemployee", {
        errors: errors.errors,
        employee: { eid: id, ename: name, role: role, salary: salary },
      });
    } else {
      sqlDAO
        .updateEmployee(req.body)
        .then((data) => {
          console.log("Update Success");
        })
        .catch((error) => {
          console.log("Update Failure");
          res.send(error);
        });

      res.redirect("/employees");
    }
  }
);

// Departements page
app.get("/depts", (req, res) => {
  console.log("GET on /depts");

  // Show department table from sql DB
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
  console.log("GET on /depts/delete");

  // Show delete department view and the details for that department from the database
  // If the department can't be deleted show the correct error view
  sqlDAO
    .deleteDept(req.params.did)
    .then((data) => {
      res.redirect("/depts");
    })
    .catch(() => {
      res.render("deleteError", { d: req.params.did });
    });
});

// MongoDB employees page
app.get("/employeesMongoDB", (req, res) => {
  console.log("GET on /employeesMongoDB");

  // Show the employees from mongoDB
  mongoDAO
    .findAll()
    .then((data) => {
      res.render("employeesMongoDB", { employees: data });
    })
    .catch((error) => {
      res.send(error);
    });
});

// MongoDB add employee page
app.get("/employeesMongoDB/add", (req, res) => {
  res.render("addEmployeeMongoDB", { errors: undefined });
});

// Handle post request for adding an employee to the mongo database
// Uses express validation middleware
app.post(
  "/employeesMongoDB/add",
  [
    check("_id")
      .isLength({ min: 4, max: 4 })
      .withMessage("EID must be 4 characters"),
  ],
  [
    check("phone")
      .isLength({ min: 6 })
      .withMessage("Phone must be > 5 characters"),
  ],
  [check("email").isEmail().withMessage("Must be a valid email address")],
  (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      console.log("errors not empty" + errors.errors);
      res.render("addemployeeMongoDB", { errors: errors.errors });
    } else {
    // Check if the ID exists in SQL DB, if not display the error screen and dont add to mongoDB
    // otherwise check if the ID exists in the mongo database, if yes then display the error screen
    // otherwise add to the mongo database
      sqlDAO
        .getUpdate(req.body._id)
        .then((data) => {
          if (data.length != 0) {
            mongoDAO
              .addEmployee(req.body)
              .then((data) => {
                console.log("posted successfully");
                res.redirect("/employeesMongoDB");
              })
              .catch((err) => {
                console.log("error posting");
                res.render("mongoError", { d: req.body._id });
              });
          } else {
            res.render("notInSqlError", { d: req.body._id });
          }
        })
        .catch((err) => {
          res.send(err);
        });
    }
  }
);

app.listen(3004, () => {
  console.log("listening on port 3004");
});
