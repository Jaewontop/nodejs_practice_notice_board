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
  const sqlQuery = "select * from board";
  connection.query(sqlQuery, (err, result, fields) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/comments", async (req, res) => {
  const content = req.body.content;
  const sqlQuery = "insert into test.board(userid, content) values (?,?)";
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

app.post("/signup", async (req, res) => {
  const user_id = req.body.id;
  const user_pw = req.body.pw;
  const user_nickname = req.body.nickname;

  if (!user_id) {
    res.end("아이디를 입력해주세요");
  } else if (!user_pw) {
    res.end("비밀번호를 입력해주세요");
  }

  const id_check_sqlQuery = "select user_id from user_info where user_id = ?";
  const nickname_check_sqlQuery =
    "select user_nickname from user_info where user_nickname = ?";
  const insert_user_info_sqlUery =
    "insert into test.user_info(user_id, user_pw, user_nickname) values (?,?,?)";
  connection.query(id_check_sqlQuery, [user_id], (err, result, fields) => {
    if (err) throw err;
    if (result.length == 0) {
      //DB에 중복되는 id값이 없음
      connection.query(
        nickname_check_sqlQuery,
        [user_nickname],
        (err, result, field) => {
          if (err) throw err;
          if (result.length == 0) {
            //DB에 중복되는 nickname값이 없음
            connection.query(
              //모두 확인되었으니 db에 id,pw, signupdttm 입력
              insert_user_info_sqlUery,
              [user_id, user_pw, user_nickname],
              (err, result, fields) => {
                if (err) throw err;
                console.log("[DEBUG]:" + result);
                res.end("success");
              }
            );
          } else {
            res.end("중복되는 닉네임이 있습니다. 다른 닉네임을 입력해주세요");
          }
        }
      );
    } else {
      res.end("중복 아이디가 존재합니다. 다른 아이디를 입력해주세요");
    }
  });
});

app.post("/signin", async (req, res) => {
  const user_id = req.body.id;
  const user_pw = req.body.pw;

  if (!user_id) {
    res.end("아이디를 입력해주세요");
  } else if (!user_pw) {
    res.end("비밀번호를 입력해주세요");
  }

  const login_check_sqlQuery =
    "select user_id, user_pw from user_info where user_id = ? and user_pw = ?";
  connection.query(
    login_check_sqlQuery,
    [user_id, user_pw],
    (err, result, field) => {
      if (err) throw err;
      if (result.length == 0) {
        res.end("아이디나 비밀번호가 틀렸습니다");
      } else {
        res.end("success");
      }
    }
  );
});
