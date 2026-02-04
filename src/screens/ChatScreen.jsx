import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../compount/socket";
import Header from "../compount/Header";
import { BASEURL, config } from "../config/config";
import { AppContext } from "../context/context";
import { useIsOnline } from "../hooks/useIsOnline";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../compount/helper/utlity";
import useDebounce from "../hooks/useDebounce";
import intercepter from "../server/intercepter";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:9000", {
//   transports: ["websocket"],
// });

export default function ChatScreen() {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const nav = useNavigate();
  const { state } = useContext(AppContext);
  const isOnline1 = useIsOnline();

  const [text, setText] = useState("");
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const [value, setValue] = useState("");

  const debouncedSearchText = useDebounce(text, 500);

  let limit = 10;

  const handleSubmit = async () => {
    try {
      if (!isOnline1) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await intercepter.get(
        `${BASEURL}/user/searchUser?key=${debouncedSearchText}&&limit=${limit}`,
        config
      );
      const resData = await res.data.user;
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

  // --------------------------
  // Fetch chat list
  // --------------------------
  const fetchChats = async () => {
    const res = await intercepter.get(`${BASEURL}/chat`, config);

    setUsers(res.data);
  };

  useEffect(() => {
    if (!isOnline1) {
      alert("No internet connection. Please check your network.");
      return;
    }
    fetchChats();
  }, [isOnline1]);

  // --------------------------
  // SOCKET SETUP
  // --------------------------
  useEffect(() => {
    const onlineUsers = (list) => {
      setOnlineUsers(list);
    };
    const receiveMessage = () => {
      fetchChats(); // refresh last message
    };
    socket.emit("join", state.user.id);

    socket.on("onlineUsers", onlineUsers);

    socket.on("receiveMessage", receiveMessage);

    return () => {
      socket.off("onlineUsers", onlineUsers);
      socket.off("receiveMessage", receiveMessage);
    };
  }, [state.user]);

  const connectUser = async (friendId) => {
    try {
      const res = await intercepter.post(
        `${BASEURL}/chat/conversation/${friendId}`,
        {},
        config
      );
      console.log(res.data, "convertions");
      nav(`/chat/${res.data._id}/friend/${friendId}`);
    } catch (error) {
      console.log(error);
    }
  };

  // --------------------------
  // OPEN CHAT
  // --------------------------
  const openChat = (conversationId, friendId) => {
    nav(`/chat/${conversationId}/friend/${friendId}`);
  };

  return (
    <>
      <Header />

      <div className="container feed-container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mx-auto">
            <div className="h-screen bg-gray-100">
              {/* Header */}
              <div className="p-4 text-dark">Chats</div>

              <div className="container searchContainer">
                {/* <form onSubmit={handleSubmit}> */}
                <input
                  onChange={(e) => {
                    setText(e.target.value);
                    setValue(e.target.value);
                  }}
                  type="text"
                  className="form-control m-2"
                  placeholder="Search ..."
                />
                {/* </form> */}
                <div>
                  {value !== "" ? (
                    <>
                      {user.length || posts.length !== 0 ? (
                        <>
                          <div className="searchResult">
                            {user.map((item) => {
                              return (
                                <>
                                  <div
                                    key={item._id}
                                    className="d-flex gap-3 p-1"
                                    onClick={() => {
                                      connectUser(item._id);
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
                                </>
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

              {/* List */}
              <div>
                {state.user &&
                  state.user.id &&
                  users.map((c) => {
                    const friend = c.participants.find(
                      (p) => p._id !== state.user.id
                    );
                    const isOnline = onlineUsers.includes(friend._id);

                    const commentTime = timeAgo(c.updatedAt);

                    return (
                      <div
                        key={c._id}
                        onClick={() => openChat(c._id, friend._id)}
                        className="d-flex align-items-center p-3 border-bottom cursor-pointer hover-bg"
                      >
                        {/* Avatar */}
                        <div className="position-relative me-3">
                          <img
                            className="rounded-circle"
                            width={45}
                            height={45}
                            src={
                              friend.Photo
                                ? `${BASEURL}${friend.Photo}`
                                : "/images/personicon.jpg"
                            }
                            alt=""
                          />

                          {isOnline && (
                            <span
                              className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                              style={{ width: 10, height: 10 }}
                            />
                          )}
                        </div>

                        {/* Middle */}
                        <div className="flex-grow-1">
                          <div className="fw-bold">{friend.userName}</div>

                          <div className="text-muted small text-truncate">
                            {c.lastMessage?.text || "Start chatting"}
                          </div>
                        </div>

                        {/* Right */}
                        <div className="text-end">
                          <div className="small text-muted">{commentTime}</div>

                          {c.unreadCount > 0 && (
                            <span className="badge bg-success rounded-pill">
                              {c.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    );

                    // return (
                    //   <div
                    //     key={c._id}
                    //     onClick={() => openChat(c._id, friend._id)}
                    //     className="flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-200"
                    //   >
                    //     {/* Avatar */}
                    //     <div className="relative">
                    //       <div key={friend._id} className="d-flex gap-3 mb-2">
                    //         <div className="postImgTop">
                    //           <img
                    //             alt=""
                    //             className="userImg"
                    //             src={
                    //               friend.Photo
                    //                 ? `${BASEURL}${friend.Photo}`
                    //                 : "/images/personicon.jpg"
                    //             }
                    //           />
                    //           {isOnline && (
                    //             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full" />
                    //           )}
                    //         </div>
                    //         {/* <p>{friend.userName}</p> */}
                    //         <div className="flex-1">
                    //           <p>{friend.userName}</p>

                    //           <p className="text-sm text-gray-500 truncate">
                    //             {c.lastMessage?.text || "Start chatting"}
                    //           </p>
                    //         </div>
                    //         <div className="text-right">
                    //           <p className="text-xs text-gray-400">{commentTime}</p>

                    //           {c.unreadCount > 0 && (
                    //             <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    //               {c.unreadCount}
                    //             </span>
                    //           )}
                    //         </div>
                    //       </div>
                    //     </div>
                    //   </div>
                    // );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
