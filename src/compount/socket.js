import { io } from "socket.io-client";

// // local
// export const socket = io("http://localhost:9000", {
//   transports: ["websocket"],
// });

// production
export const socket = io("https://api.shareurinterest.com", {
  transports: ["websocket"],
});
