const mongoose = require("mongoose");

// console.log(process.env.MONGO_DB);

const mongoConnection = mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

  module.exports = mongoConnection;