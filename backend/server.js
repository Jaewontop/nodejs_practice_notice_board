const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql");

app.listen(3001, function () {
  console.log("listening on 3001");
});

app.use(express.static(path.join(__dirname, "../front/build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../front/build/index.html"));
});

app.get("/comments", async (req, res) => {
  res.send(req);
});

app.post("/comments", async (req, res) => {
  const sqlQuery = `insert into test.user(userid, content) values (${req}, '코드기어');`;
});

var connection = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "test",
  database: "test",
});
connection.connect();

connection.query("SELECT * from USER", function (error, results, fields) {
  if (error) throw error;
  console.log("users: ", results);
});

connection.end();
