const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql");
// const cors = require("cors");
const session = require("express-session");
let MySQLStore = require("express-mysql-session")(session);
let cookieParser = require("cookie-parser");

var options = {
  host: "localhost",
  user: "test",
  password: "test",
  database: "test",
};

let sessionStore = new MySQLStore(options);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "0912078@@",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

app.listen(3001, function () {
  console.log("listening on 3001");
});

var connection = mysql.createConnection(options);
connection.connect();

app.use(express.static(path.join(__dirname, "../front/build")));

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//     methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
//   }),
//   function (req, res, next) {
//     // cors 문제 해결
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
//   }
// );

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../front/build/index.html"));
});

app.post("/", function (req, res) {
  console.log("session:" + req.session.user_nickname);
  res.send({
    // is_logined: req.session.is_logined,
    user_nickname: req.session.user_nickname,
  });
});

app.post("/logout", function (req, res) {
  // delete req.session.is_logined;
  req.session.destroy(() => {
    console.log("im logout");
  });
  // res.clearCookie("is_logined");
  // res.clearCookie("user_nickname").redirect("/");
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
  const sqlQuery = "delete from board where id = ?";
  connection.query(sqlQuery, [id], (err, result, fields) => {
    if (err) res.send("err:" + err);
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
              //모두 확인되었으니 db에 id,pw, nickname 입력
              insert_user_info_sqlUery,
              [user_id, user_pw, user_nickname],
              (err, result, fields) => {
                if (err) throw err;
                // res.cookie("is_logined", "true", {
                //   maxAge: Date.now() + 60 * 60 * 24 * 30,
                // });
                // res.cookie("user_nickname", user_nickname, {
                //   maxAge: Date.now() + 60 * 60 * 24 * 30,
                // });
                // req.session.is_logined = true;
                req.session.user_nickname = user_nickname;
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

  const login_check_get_nickname_sqlQuery =
    "select user_nickname from user_info where user_id = ? and user_pw = ?";
  const session_check_get_session_id_sqlQuery =
    "select json_extract(data, '$.user_nickname') as data_user_nickname from sessions where json_extract(data, '$.user_nickname') = ?";

  connection.query(
    login_check_get_nickname_sqlQuery,
    [user_id, user_pw],
    (err, result, field) => {
      if (err) throw err;
      if (result.length == 0) {
        res.end("아이디나 비밀번호가 틀렸습니다");
      } else {
        let user_nickname = result[0].user_nickname;
        // res.cookie("is_logined", "true", {
        //   maxAge: Date.now() + 60 * 60 * 24 * 30,
        // });
        // res.cookie("user_nickname", user_nickname, {
        //   maxAge: Date.now() + 60 * 60 * 24 * 30,
        // });
        //
        //이미 session db에 로그인 되어 있는 게 있는 지 확인후 없으면 아래꺼 실행, 있으면 error
        // req.session.is_logined = true;
        connection.query(
          session_check_get_session_id_sqlQuery,
          [user_nickname],
          (err, result, field) => {
            if (err) throw err;
            if (result.length == 0) {
              req.session.user_nickname = user_nickname;
              res.end("success");
            } else {
              let user_nickname = result[0].data_user_nickname;
              console.log(user_nickname);
              res.end("이미 로그인 중입니다.");
            }
          }
        );
      }
    }
  );
});
