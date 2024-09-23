// socket.js
import { io } from "socket.io-client";
import { getLocalStorage } from "@/utills/LocalStorageUtills";








const socket = io(`${import.meta.env.VITE_APP_MAINURL}/`, {
//const socket = io(`http://localhost:3000/`, {
  reconnectionAttempts: 5, 
  transports: ['websocket'],
  secure: true, 
});



export default socket;






