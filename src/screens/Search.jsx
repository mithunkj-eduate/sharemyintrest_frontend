import axios from "axios";
import React, { useEffect, useState } from "react";
import { config } from "../config/config";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../config/config";
import { AppContext, useAppContext } from "../context/context";
import { useIsOnline } from "../hooks/useIsOnline";
import useDebounce from "../hooks/useDebounce";
import intercepter from "../server/intercepter";

function Search() {
  const [text, setText] = useState("");
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [value, setValue] = useState("");
  const { state } = useAppContext(AppContext);

  const nav = useNavigate();
  let limit = 10;

  const isOnline = useIsOnline();

  const debouncedSearchText = useDebounce(text, 500);

  const handleSubmit = async () => {
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await intercepter.get(
        `${BASEURL}/user/searchUser?key=${debouncedSearchText}&&limit=${limit}`,
        config
      );
      const resData = await res.data.user;
      console.log(res);
      setUser(resData);
      const resPost = await res.data.post;
      setPosts(resPost);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    if (debouncedSearchText) {
      handleSubmit();
    }
  }, [debouncedSearchText]);

  return (
    <>
      <div className="container searchContainer">
        {/* <form onSubmit={handleSubmit}> */}
        <input
          onChange={(e) => {
            setText(e.target.value);
            setValue(e.target.value);
          }}
          type="text"
          className="form-control m-2"
          placeholder="Search"
        />
        {/* </form> */}
        <div>
          {value !== "" ? (
            <>
              {user.length || posts.length !== 0 ? (
                <>
                  <div className="searchResult">
                    {user.map((item, i) => {
                      return (
                        <div
                          key={i}
                          className="d-flex gap-3 p-1"
                          onClick={() => {
                            nav(
                              state.user.id === item._id
                                ? "/profile"
                                : `/profile/${item._id}`
                            );
                          }}
                        >
                          <div className="postImgTop">
                            <img
                              alt=""
                              className="userImg"
                              src={
                                item.Photo
                                  ? `${BASEURL}${item.Photo}`
                                  : "/images/personicon.jpg"
                              }
                            />
                          </div>
                          <p>{item.userName}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="rowCard">
                    {posts.map((item, index) => {
                      return (
                        <div className="column" key={index}>
                          <img
                            alt=""
                            key={item._id}
                            src={
                              item.photo
                                ? `${BASEURL}${item.photo}`
                                : "/images/personicon.jpg"
                            }
                            className="innerImg"
                            target="_blank"
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <img
                  alt=""
                  src="/images/search.jpg"
                  style={{ width: "50%", margin: "0 25%" }}
                />
              )}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
