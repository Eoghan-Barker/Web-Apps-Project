var pmysql = require("promise-mysql");
var pool;

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

var getUpdate = function (eid) {
  return new Promise((resolve, reject) => {
    pool
      .query(`select * from employee where eid like "${eid}";`)
      .then((data) => {
        console.log("success");
        console.log(data);
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};

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
