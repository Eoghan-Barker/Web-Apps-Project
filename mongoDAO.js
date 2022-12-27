const MongoClient = require("mongodb").MongoClient;
var db;
var coll;

MongoClient.connect("mongodb://localhost:27017")
  .then((client) => {
    db = client.db("employeesDB");
    coll = db.collection("employees");
  })
  .catch((error) => {
    console.log(error.message);
  });

var findAll = function () {
  return new Promise((resolve, reject) => {
    var cursor = coll.find();
    cursor
      .toArray()
      .then((documents) => {
        resolve(documents);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

var addEmployee = function (employee) {
  return new Promise((resolve, reject) => {
    var cursor = coll.find()
    cursor.toArray()
      .then((documents) => {
        resolve(documents);
      })
      .catch((error) => {
        reject(error);
      })
  })
}

module.exports = { findAll, addEmployee };