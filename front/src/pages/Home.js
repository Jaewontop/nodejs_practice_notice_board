import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const COMMENT_URL = "http://localhost:3001/comments";
const HOME_URL = "http://localhost:3001/";

function Home() {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(1);
  const [userNickname, setUserNickname] = useState("");
  axios.defaults.withCredentials = true; //?
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const comment_response = await axios.get(COMMENT_URL);
        setComments(comment_response.data);
        const home_response = await axios.post(HOME_URL);
        if (home_response.data.is_logined) {
          setUserNickname(home_response.data.user_nickname);
        }
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [loadData]);

  function commentBox(comment) {
    const deleteUrl = COMMENT_URL + "/delete";
    const deleteComment = async (id) => {
      axios
        .post(deleteUrl, {
          id: id,
        })
        .then(function (response) {
          console.log("[DEBUG] response:" + response);
        })
        .catch(function (error) {
          console.log("[DEBUG] error:" + error);
        });
    };

    return (
      <div id="commentBox">
        <p>{comment.content}</p>
        <div
          className="button"
          onClick={() => {
            deleteComment(comment.id);
            let data = loadData + 1;
            setLoadData(data);
          }}
        >
          X
        </div>
      </div>
    );
  }

  const sendComment = async (content) => {
    axios
      .post(COMMENT_URL, {
        content: content,
      })
      .then(function (response) {
        console.log("[DEBUG] response:" + response);
      })
      .catch(function (error) {
        console.log("[DEBUG] error:" + error);
      });
  };

  const onChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="App">
      {userNickname === "" ? (
        <header>
          <Link to="/signin">
            <h3>로그인</h3>
          </Link>
          <Link to="/signup">
            <h3>회원가입</h3>
          </Link>
        </header>
      ) : (
        <header>
          <Link to="/signin">
            <h3>{userNickname}</h3>
          </Link>
          <Link to="/signup">
            <h3>로그아웃</h3>
          </Link>
        </header>
      )}
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
            let data = loadData + 1;
            setLoadData(data);
          }}
        >
          +
        </div>
      </div>
    </div>
  );
}

export default Home;
