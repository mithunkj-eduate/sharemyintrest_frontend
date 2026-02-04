import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { socket } from "./socket";
import axios from "axios";
import { BASEURL, config, config1 } from "../config/config";
import { AppContext } from "../context/context";
import { useNavigate, useParams } from "react-router-dom";
// import { io } from "socket.io-client";
// import Header from "./Header";
import { FaArrowLeft } from "react-icons/fa6";
import { GrGallery } from "react-icons/gr";
import { MdDelete, MdOutlineFileDownload } from "react-icons/md";
import intercepter from "../server/intercepter";

// const socket = io("http://localhost:9000", {
//   transports: ["websocket"],
// });

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const { state } = useContext(AppContext);
  const { conversationId, friendId } = useParams();
  const [isOnline, setIsOnline] = useState(false);
  const [user, setUser] = useState();
  const nav = useNavigate();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState();

  const [file, setFile] = useState();
  const [url, setUrl] = useState();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  let limit = 20;

  const bottomRef = useRef(null);
  const hiddenFileInput = useRef(null);
  const scrollRef = useRef(null);
  const previousHeight = useRef(0);

  const handalClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth", // or "auto"
    });
  }, [messages.length]);

  // join socket
  useEffect(() => {
    if (state.user && state.user.id) socket.emit("join", state.user.id);
  }, [state.user]);

  // receive message realimport axios from "axios"time
  useEffect(() => {
    const onlineUsers = (list) => {
      const online = list.includes(friendId);
      if (online) setIsOnline(true);
    };
    const receive = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", receive);

    socket.on("onlineUsers", onlineUsers);

    // socket.on("receiveMessage", (msg) => {
    //   setMessages((prev) => [...prev, msg]);
    // });

    socket.on("typing", () => setTyping(true));
    socket.on("stopTyping", () => setTyping(false));

    socket.on("messageSeen", () => {
      setMessages((prev) =>
        prev.map((m) => ({
          ...m,
          isRead: true,
        }))
      );
    });

    return () => {
      socket.off("onlineUsers", onlineUsers);
      socket.off("receiveMessage", receive);
    };
  }, []);

  // send message
  const sendMessage = async (mediaUrl, messageType) => {
    try {
      let body = {
        conversationId: conversationId,
        receiver: friendId,
        text,
      };
      if (mediaUrl) {
        body.media = mediaUrl;
      }
      if (messageType) {
        body.messageType = messageType;
      }
      const res = await intercepter.post(`${BASEURL}/chat/message`, body, config);

      socket.emit("sendMessage", res.data);
      console.log(res.data, "sfsf");
      setMessages((prev) => [...prev, res.data]);
      handleClear();
    } catch (error) {
      console.log(error);
    }
  };
  console.log(messages);
  const handleClear = () => {
    setText("");
    setFile();
    setUrl("");
    setProgress(0);
  };
  // useEffect(() => {
  //   if (!messages.length) return;

  //   const unread = messages.filter(
  //     (m) => m.sender !== state.user.id && !m.isRead
  //   );
  //   if (unread.length > 0) {
  //     socket.emit("seen", {
  //       conversationId,
  //       to: friendId,
  //     });
  //   }
  // }, [messages, conversationId, friendId, state.user.id]);

  useEffect(() => {
    if (!messages.length) return;

    const hasUnread = messages.some(
      (m) => m.sender !== state.user.id && !m.isRead
    );

    if (hasUnread) {
      socket.emit("seen", {
        conversationId,
        to: friendId,
      });
    }
  }, [messages]);

  useEffect(() => {
    const getUserById = async () => {
      try {
        const res = await intercepter.get(`${BASEURL}/user/${friendId}`, config);

        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    // GET /api/chat/messages/:conversationId
    // const getMessages = async () => {
    //   try {
    //     const res = await intercepter.get(
    //       `${BASEURL}/chat/messages/${conversationId}`,
    //       config
    //     );

    //     setMessages(res.data);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // getMessages();
    getUserById();
  }, []);

  // typing
  const handleTyping = () => {
    socket.emit("typing", { to: friendId });

    setTimeout(() => {
      socket.emit("stopTyping", { to: friendId });
    }, 1000);
  };

  useEffect(() => {
    document.body.classList.add("chat-page");
    return () => document.body.classList.remove("chat-page");
  }, []);

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await intercepter.post(`${BASEURL}/chat/uploads`, formData, {
        ...config1,
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      const messageType = file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("audio")
        ? "audio"
        : "file";

      sendMessage(res.data.mediaUrl, messageType);
    } catch (error) {
      console.log(error);
    }
  };

  //download image get method
  const downloadFile = async (id) => {
    try {
      await fetch(`${BASEURL}/chat/downloadFile/${id}`, config)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch image");
          }
          // Read the response as blob data
          return response.blob();
        })
        .then((blob) => {
          // Create a blob URL for the image blob data
          const imageUrl = URL.createObjectURL(blob);
          // Set the src attribute of the image element to the blob URL
          // document.getElementById('image').src = imageUrl;

          // Create a link element
          const link = document.createElement("a");
          link.href = imageUrl;
          link.download = "sharemyinstrest.jpg"; // Set the filename here

          // Append the link to the document body
          document.body.appendChild(link);

          // Trigger the download
          link.click();

          // Remove the link from the document body
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // -------------------------
  // fetch messages (pagination)
  // -------------------------
  const getMessages = async (pageNo = 1) => {
    if (loading) return;

    setLoading(true);

    const el = scrollRef.current;

    if (pageNo !== 1) {
      previousHeight.current = el.scrollHeight; // 🔥 store BEFORE fetch
    }

    const res = await intercepter.get(
      `${BASEURL}/chat/messages/${conversationId}?page=${pageNo}&limit=${limit}`,
      config
    );

    const newMsgs = res.data;

    if (newMsgs.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    setMessages((prev) => (pageNo === 1 ? newMsgs : [...newMsgs, ...prev]));

    setLoading(false);
  };

  useEffect(() => {
    getMessages(1);
  }, [conversationId]);

  // -------------------------
  // infinite scroll top
  // -------------------------
  let scrollTimer = null;

  const handleScroll = () => {
    if (scrollTimer) return;

    scrollTimer = setTimeout(() => {
      scrollTimer = null;

      const el = scrollRef.current;

      if (loading || !hasMore) return;

      if (el.scrollTop <= 20) {
        setPage((p) => {
          const next = p + 1;
          getMessages(next);
          return next;
        });
      }
    }, 200);
  };

  useLayoutEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    // first load → go bottom
    if (page === 1) {
      bottomRef.current?.scrollIntoView();
    }
    // pagination → keep same position
    else {
      const newHeight = el.scrollHeight;
      el.scrollTop = newHeight - previousHeight.current;
    }
  }, [page]);

  return (
    <div className="">
      <div className="d-flex flex-column vh-100 bg-light">
        {/* <Header /> */}

        <div className="d-flex align-items-center p-3 border-bottom cursor-pointer hover-bg">
          <div onClick={() => nav(-1)}>
            <FaArrowLeft className="fs-3 me-2" />
          </div>
          <div className="position-relative me-3">
            <img
              className="rounded-circle"
              width={45}
              height={45}
              src={
                user?.Photo
                  ? `${BASEURL}${user?.Photo}`
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

          <div className="flex-grow-1">
            <div className="fw-bold">{user?.userName}</div>
          </div>
        </div>
        {progress > 0 && (
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}
        {/* Messages */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-grow-1 overflow-auto p-3"
          style={{ background: "#e5ddd5" }}
        >
          {messages.map((m, i) => {
            const isMe = m.sender === state.user.id;
            return (
              <div
                key={i}
                className={`d-flex mb-2 ${
                  isMe ? "justify-content-end" : "justify-content-start"
                }`}
              >
                <div
                  className={`p-2 px-3 rounded shadow-sm ${
                    isMe ? "bg-primary text-white" : "bg-white"
                  }`}
                  style={{ maxWidth: "65%", overflow: "hidden" }}
                >
                  {m.messageType === "text" && <p>{m.text}</p>}

                  {m.messageType === "image" && (
                    <>
                      <div className="position-relative">
                        <img
                          src={`${BASEURL}${m.media}`}
                          width={200}
                          alt={m.media}
                        />
                        <MdOutlineFileDownload
                          className={
                            m.media
                              ? "position-absolute start-0 bottom-0  fs-2 text-dark bg-light rounded-circle"
                              : "d-none"
                          }
                          onClick={() => downloadFile(m._id)}
                        />
                      </div>
                    </>
                  )}

                  {m.messageType === "audio" && (
                    <audio controls src={`${BASEURL}${m.media}`} />
                  )}

                  {m.messageType === "file" && (
                    <a
                      href={`${BASEURL}${m.media}`}
                      style={{ color: "#fff" }}
                      download
                    >
                      📎 Download File
                    </a>
                  )}

                  {m.messageType === "link" && (
                    <a href={m.text} style={{ color: "#fff" }}>
                      {m.text}
                    </a>
                  )}

                  {isMe && (
                    <div className="small text-end mt-1">
                      {m.isRead ? "✓✓" : "✓"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {typing && <div className="text-muted small">Typing...</div>}

        {/* Input */}

        {url ? (
          <div className="col-md-4 p-2">
            <div className="w-25 position-relative">
              <img alt="" src={url} className="w-100" />

              <MdDelete
                className="position-absolute top-0 end-0 fs-3 bg-light"
                onClick={() => {
                  setUrl(null);
                  setFile();
                }}
              />
            </div>
          </div>
        ) : null}

        <div className="p-2 border-top bg-white d-flex gap-2">
          {/* <input
            className="form-control"
            placeholder="Type message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
          /> */}

          <textarea
            id="message"
            value={text}
            placeholder="Type message..."
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
            className="form-control"
            name="textarea"
            rows="1"
            cols="40"
            style={{ maxHeight: "120px" }}
          ></textarea>

          {/* <input type="file" onChange={handleFileUpload} /> */}
          <GrGallery className="fs-2 text-light" onClick={handalClick} />

          <button
            className="btn btn-primary"
            onClick={async () => {
              if (!file && !text) return;
              if (file && text) {
                await handleFileUpload();
                await sendMessage();
              } else if (file) {
                handleFileUpload();
              } else {
                sendMessage();
              }
            }}
          >
            Send
          </button>

          <input
            type="file"
            ref={hiddenFileInput}
            onChange={(e) => {
              setFile(e.target.files[0]);
              setUrl(URL.createObjectURL(e.target.files[0]));
            }}
            accept="image/*"
            className="form-control"
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );

  // return (
  //   <div>
  //     <Header />

  //     <div className="messages">
  //       {messages.map((m, i) => (
  //         <div key={i}>
  //           {m.text}
  //           {m.sender === state.user.id && <>{m.isRead ? " ✓✓" : " ✓"}</>}
  //         </div>
  //       ))}

  //       {typing && <p>Typing...</p>}
  //     </div>

  //     <input
  //       onChange={(e) => {
  //         setText(e.target.value);
  //         handleTyping();
  //       }}
  //       type="text"
  //       className="form-control m-2"
  //       placeholder="Search"
  //       value={text}
  //     />
  //     <button onClick={sendMessage} className="btn btn-primary p-1">
  //       Send
  //     </button>
  //   </div>
  // );
};

export default Chat;
