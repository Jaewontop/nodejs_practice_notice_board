import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import React, { useState } from "react";

const URL = "localhost:3001";

function App() {
  const comments = ["너무 좋아요우ㅜㅜ", "행복해요!!"];
  const sendComment = async (content) => {
    axios
      .post(URL, {
        content: content,
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
  const [text, setText] = useState("");

  const onChange = (e) => {
    setText(e.target.value);
  };

  const onReset = () => {
    setText("");
  };

  return (
    <div className="App">
      <h1>위로의 말</h1>
      <div className="blank"></div>
      <div id="content">
        {comments.map((comment) => {
          return <p> {comment} </p>;
        })}
      </div>
      <div className="blank"></div>
      <div id="input_box">
        <input onChange={onChange} placeholder="따뜻한 말을 건네주세요" />
        <div
          onClick={() => {
            sendComment(text);
            onReset();
          }}
        >
          +
        </div>
      </div>
    </div>
  );
}

export default App;
