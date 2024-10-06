// socket.js
import { io } from "socket.io-client";
import { getLocalStorage } from "@/utills/LocalStorageUtills";



let userId = getLocalStorage("user")?._id;




const socket = io(`${import.meta.env.VITE_APP_MAINURL}/`, {
//const socket = io(`ws://localhost:3000/`, {
  query: {user:userId},
  reconnectionAttempts: 5, 
  transports: ['websocket'],
  secure: true, 
});
socket.on("connect", () => {
  console.log(`Connected to server `);
});


export default socket;






