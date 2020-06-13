const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "us-cdbr-east-05.cleardb.net",
  user: "b5fdeb42125ff6",
  password: "3918fa1d",
  database: "heroku_aecddbeba0b9f57",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

module.exports = connection;
