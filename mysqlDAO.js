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
        pool.query("SELECT * FROM employee")
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })

    })

}

var getDept = function () {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM dept")
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })

    })

}

var getUpdate = function (eid) {
    return new Promise((resolve, reject) => {
        pool.query(`select * from employee where eid like "${eid}";`)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })

    })

}

module.exports = { getEmp, getDept, getUpdate }