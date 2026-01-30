import { useContext, useEffect, useState } from "react";
import { socket } from "./socket";
import axios from "axios";
import { BASEURL, config } from "../config/config";
import { AppContext } from "../context/context";
import { useIsOnline } from "../hooks/useIsOnline";
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
  const isOnline = useIsOnline();
  const { conversationId, friendId } = useParams();

  // join socket
  useEffect(() => {
    if (state.user && state.user.id && isOnline)
      socket.emit("join", state.user.id);
  }, [state.user, isOnline]);

  // receive message realtime
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", () => setTyping(true));
    socket.on("stopTyping", () => setTyping(false));

    socket.on("messageSeen", () => {
      console.log("Seen ✓✓");
    });
  }, []);

  // send message
  const sendMessage = async () => {
    if (!isOnline) {
      alert("No internet connection. Please check your network.");
      return;
    }
    if (conversationId) {
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

      setMessages([...messages, res.data]);
      setText("");
    }
  };

  useEffect(() => {
    const connectUser = async () => {
      try {
       await axios.post(
          `${BASEURL}/chat/conversation/${friendId}`,
          {},
          config
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (!conversationId) connectUser();
  }, []);

  // typing
  const handleTyping = () => {
    socket.emit("typing", { to: friendId });

    setTimeout(() => {
      socket.emit("stopTyping", { to: friendId });
    }, 1000);
  };

  return (
    <div>
      <Header />

      <div className="messages">
        {messages.map((m, i) => (
          <div key={i}>
            {m.text}
            {m.isRead && " ✓✓"}
          </div>
        ))}

        {typing && <p>Typing...</p>}
      </div>

      <input
        onChange={(e) => {
          setText(e.target.value);
          handleTyping();
        }}
        type="text"
        className="form-control m-2"
        placeholder="Search"
        value={text}
      />
      <button onClick={sendMessage} className="btn btn-primary p-1">
        Send
      </button>
    </div>
  );
};

export default Chat;
