import React, { useState, useEffect } from "react";
import axios from "axios";

const URL = "http://localhost:3001/signin";

export default function SignIn() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const onChangeId = (e) => {
    setId(e.target.value);
  };
  const onChangePw = (e) => {
    setPw(e.target.value);
  };

  const signIn = async (id, pw) => {
    axios
      .post(URL, {
        id: id,
        pw: pw,
      })
      .then(function (response) {
        console.log("[DEBUG] response:" + response);
      })
      .catch(function (error) {
        console.log("[DEBUG] error:" + error);
      })
      .then(function () {
        // 항상 실행
      });
  };

  return (
    <div id="accounts">
      <h1> 로그인 해주세요</h1>
      <h3>Id</h3>
      <input onChange={onChangeId}></input>
      <h3>Pw</h3>
      <input onChange={onChangePw}></input>
      <div className="button" onClick={signIn(id, pw)}>
        로그인
      </div>
    </div>
  );
}
