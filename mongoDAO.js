const MongoClient = require("mongodb").MongoClient;
var db;
var coll;

// Connect to MongoDB and select the database and collection to use
MongoClient.connect("mongodb://localhost:27017")
  .then((client) => {
    db = client.db("employeesDB");
    coll = db.collection("employees");
  })
  .catch((error) => {
    console.log(error.message);
  });

// Show all employees in the collection
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

// Add an employee to the collection
var addEmployee = function (employee) {
  return new Promise((resolve, reject) => {
    coll
      .insertOne(employee)
      .then((documents) => {
        resolve(documents);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = { findAll, addEmployee };
