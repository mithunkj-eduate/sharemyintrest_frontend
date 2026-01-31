import { useContext, useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import axios from "axios";
import { BASEURL, config } from "../config/config";
import { AppContext } from "../context/context";
import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";
import Header from "./Header";

// const socket = io("http://localhost:9000", {
//   transports: ["websocket"],
// });

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const { state } = useContext(AppContext);
  const { conversationId, friendId } = useParams();

  const messagesEndRef = useRef(null);
  const bottomRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth", // or "auto"
    });
  }, [messages.length]);
  

  // join socket
  useEffect(() => {
    if (state.user && state.user.id) socket.emit("join", state.user.id);
  }, [state.user]);

  // receive message realtime
  useEffect(() => {
    const receive = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", receive);

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
      socket.off("receiveMessage", receive);
    };
  }, []);

  // send message
  const sendMessage = async () => {
    try {
      const res = await axios.post(
        `${BASEURL}/chat/message`,
        {
          conversationId: conversationId,
          receiver: friendId,
          text,
        },
        config
      );

      socket.emit("sendMessage", res.data);

      // setMessages([...messages, res.data]);
      setText("");
    } catch (error) {
      console.log(error);
    }
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
    // GET /api/chat/messages/:conversationId
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `${BASEURL}/chat/messages/${conversationId}`,
          config
        );

        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, []);

  // typing
  const handleTyping = () => {
    socket.emit("typing", { to: friendId });

    setTimeout(() => {
      socket.emit("stopTyping", { to: friendId });
    }, 1000);
  };

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* <Header /> */}

      {/* Messages */}
      <div
        className="flex-grow-1 overflow-auto p-3"
        style={{ background: "#e5ddd5" }}
        // ref={messagesEndRef}
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
                style={{ maxWidth: "65%" }}
              >
                {m.text}

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
      <div className="p-2 border-top bg-white d-flex gap-2">
        <input
          className="form-control"
          placeholder="Type message..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
        />

        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
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
