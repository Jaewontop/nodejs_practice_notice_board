import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const URL = "http://localhost:3001/signup";
const successCode = "success";

export default function SignUp() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const onChangeId = (e) => {
    setId(e.target.value);
  };
  const onChangePw = (e) => {
    setPw(e.target.value);
  };
  const onChangeNickname = (e) => {
    setNickname(e.target.value);
  };
  const signUp = async (id, pw, nickname) => {
    axios
      .post(URL, {
        id: id,
        pw: pw,
        nickname: nickname,
      })
      .then(function (response) {
        setErrorMessage(response.data);
        console.log(response.data);
        if (response.data == "success") {
          window.location.href = "/";
        }
      })
      .catch(function (error) {
        console.log("[DEBUG] error:" + error);
      });
  };

  return (
    <div id="accounts">
      <h1> 회원가입 해주세요</h1>
      <h3>Id</h3>
      <input onChange={onChangeId}></input>
      <h3>Pw</h3>
      <input onChange={onChangePw}></input>
      <h3>닉네임</h3>
      <input onChange={onChangeNickname}></input>
      <div
        className="button"
        onClick={() => {
          signUp(id, pw, nickname);
        }}
      >
        회원가입
      </div>
      <p>{errorMessage}</p>
    </div>
  );
}
