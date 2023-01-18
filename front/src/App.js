import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";

const URL = "http://localhost:3001/comments";

function App() {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(URL);
        setComments(response.data);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

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
        {!loading &&
          comments.map((comment) => {
            return commentBox(comment);
          })}
      </div>
      <div className="blank"></div>
      <div id="input_box">
        <input onChange={onChange} placeholder="따뜻한 말을 건네주세요" />
        <div
          className="button"
          onClick={() => {
            sendComment(text);
            window.location.reload();
          }}
        >
          +
        </div>
      </div>
    </div>
  );
}
function commentBox(comment) {
  const deleteUrl = URL + "/delete";
  const deleteComment = async (id) => {
    console.log("[DEBUG]:" + id);
    axios
      .post(deleteUrl, {
        id: id,
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
    <div id="commentBox">
      <p>{comment.username}</p>
      <div
        className="button"
        onClick={() => {
          deleteComment(comment.id);
          window.location.reload();
        }}
      >
        X
      </div>
    </div>
  );
}

export default App;
