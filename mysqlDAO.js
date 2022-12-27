var pmysql = require("promise-mysql");
var pool;

// Connect to the mySql database
pmysql
  .createPool({
    connectionLimit: 3,
    host: "localhost",
    user: "root",
    password: "",
    database: "proj2022",
  })
  .then((p) => {
    pool = p;
  })
  .catch((e) => {
    console.log("pool error:" + e);
  });

// Show the employees table
var getEmp = function () {
  return new Promise((resolve, reject) => {
    pool
      .query("SELECT * FROM employee")
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Show the details of a specified employee
var getUpdate = function (eid) {
  return new Promise((resolve, reject) => {
    pool
      .query(`select * from employee where eid like "${eid}";`)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Update details of specified employee
var updateEmployee = function (employee) {
  return new Promise((resolve, reject) => {
    var myQuery = {
      sql: `Update employee set ename =?, role =?, salary =? where eid like "${employee.eid}";`,
      values: [employee.ename, employee.role, employee.salary],
    };

    pool
      .query(myQuery)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Show department table with a join on the location table using locationID
var getDept = function () {
  return new Promise((resolve, reject) => {
    pool
      .query(
        "SELECT d.did, d.dname, l.county, d.budget FROM dept d JOIN location l ON l.lid = d.lid"
      )
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Delete a specified department
var deleteDept = function (did) {
  return new Promise((resolve, reject) => {
    pool
      .query(`DELETE FROM dept WHERE did LIKE "${did}";`)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = { getEmp, getDept, getUpdate, updateEmployee, deleteDept };
