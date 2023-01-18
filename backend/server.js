const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(3001, function () {
  console.log("listening on 3001");
});

// let id = 2;
// var commentsList = [{ id: 1, user: "jaewon", content: "재밌다 히히" }];

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

app.use(express.static(path.join(__dirname, "../front/build")));

app.use(cors(), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../front/build/index.html"));
});

app.get("/comments", async (req, res) => {
  const sqlQuery = "select * from user";
  connection.query(sqlQuery, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/comments", async (req, res) => {
  const content = req.body.content;
  // commentsList.push({ id: id++, content: content }); //왜 ID에 3이 아니라 2가 들어가지?(처음에)
  const sqlQuery = "insert into test.user(userid, username) values (?,?)";
  connection.query(sqlQuery, ["Jaewon", content], (err, result, fields) => {
    res.send("success!" + content);
  });
});
