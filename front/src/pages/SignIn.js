import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const URL = "http://localhost:3001/signin";
const successCode = "success";

export default function SignIn() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onChangeId = (e) => {
    setId(e.target.value);
  };
  const onChangePw = (e) => {
    setPw(e.target.value);
  };

  const signIn = async (id, pw) => {
    console.log("[DEBUG]: signin nnn");
    axios
      .post(URL, {
        id: id,
        pw: pw,
      })
      .then(function (response) {
        setErrorMessage(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log("[DEBUG] error:" + error);
      });
  };

  return (
    <div id="accounts">
      <h1> 로그인 해주세요</h1>
      <h3>Id</h3>
      <input onChange={onChangeId}></input>
      <h3>Pw</h3>
      <input onChange={onChangePw}></input>
      <div
        className="button"
        onClick={() => {
          signIn(id, pw);
        }}
      >
        로그인
      </div>
      {errorMessage == successCode ? (
        <p>
          로그인에 성공했습니다. <Link to="/">홈으로 가기</Link>
        </p>
      ) : (
        <p>{errorMessage}</p>
      )}
    </div>
  );
}
