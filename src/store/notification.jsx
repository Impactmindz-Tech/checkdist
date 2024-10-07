import React, { createContext, useContext, useEffect, useState } from "react";
import socket from "@/utills/socket/Socket";
import toast from "react-hot-toast";
import MeetingNotification from "@/components/Modal/MeetingNotification";
import { setLocalStorage } from "@/utills/LocalStorageUtills";
import { googlesignupandsigninApi } from "@/utills/service/authService";
import { googlesignupandsigninApis } from "@/utills/service/getRole";
import { useDispatch } from "react-redux";
import { setRoomData } from "./slice/videoSlice";

export const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = (props) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || {});
  const [meetLink, setMeetLink] = useState(null);
  const[rid,setid] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [meetingData, setMeetingData] = useState([]);
  const[offerdata,setofferData] = useState([]);
  const dispatch = useDispatch()

  useEffect(() => {
    socket.connect();
    if (socket && user?._id) {
      socket.connect();
      // socket.emit("addUser", user._id);
      socket.emit("userOnline", user._id);

      const handleIncomingMessage = (data) => {
        if (data.receiverId === user._id) {
          toast(`New message from ${data.user.fullname}: ${data.message}`, {
            duration: 6000,
          });
        }
      };
    

      socket.on("getMessage", handleIncomingMessage);

      socket.on("meetLink", (data) => {
        console.log(data, 'hello meet link');
        setMeetLink(data.link);
        setMeetingData(data);
        dispatch(setRoomData(data))
        setLocalStorage("notificationData", data);
      });

      socket.on("roomIds",(data)=>{
        console.log(data,'sanju');
   
        setid(data?.generatedRoomId);
        setofferData(data);
      })
      socket.on("roomId", (data) => {

        dispatch(setRoomData(data?.item))
        setMeetLink(data?.roomId);
        setMeetingData(data);
        console.log(data);
       
      })

      socket.on('created',(data)=>{
        console.log(data,'created')
      })
      return () => {
        socket.off("getMessage", handleIncomingMessage);
        socket.off("meetLink");
        socket.off("roomIds")
      };
    }
  }, [user._id]);




  const baba = "sanju";
  const contextvalue = { baba, meetLink, showNotification, meetingData,rid,offerdata };

  return <SocketContext.Provider value={contextvalue}>{props.children}</SocketContext.Provider>;
};
