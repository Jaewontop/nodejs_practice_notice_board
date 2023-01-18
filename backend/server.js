const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
// const session = require("express-session");
// const fileStore = require("session-file-store")(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(
//   session({
//     secret: "0912078@@",
//     resave: false,
//     saveUninitialized: true,
//     store: new fileStore(),
//   })
// );

app.listen(3001, function () {
  console.log("listening on 3001");
});

var connection = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "test",
  database: "test",
});
connection.connect();

// app.use(express.static(path.join(__dirname, "../front/build")));

app.use(cors(), function (req, res, next) {
  // cors 문제 해결
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", function (req, res, next) {
  // console.log(req.session);
  res.sendFile(path.join(__dirname, "../front/build/index.html"));
  // if (req.session.num === undefined) {
  //   req.session.num = 1;
  // } else {
  //   req.session.num = req.session.num + 1;
  // }
  // res.send(`Views:${req.session.num}`);
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
  const sqlQuery = "insert into test.user(userid, username) values (?,?)";
  connection.query(sqlQuery, ["Jaewon", content], (err, result, fields) => {
    res.send("success!" + content);
  });
});

app.post("/comments/delete", async (req, res) => {
  const id = req.body.id;
  const sqlQuery = "delete from user where id = ?";
  connection.query(sqlQuery, [id], (err, result, fields) => {
    res.send("Deleted!" + id);
  });
});
