import { useEffect, useMemo, useState } from "react";
import "./App.css";
import socket from "./utills/socket/Socket";
import { RouterProvider } from "react-router-dom";
import router from "./router/Routing";
import { Toaster } from "react-hot-toast";
import "react-country-state-city/dist/react-country-state-city.css";
import { useContext } from "react";
import { SocketContext } from "./store/notification";
import MeetingNotification from "./components/Modal/MeetingNotification";
import { getLocalStorage } from "./utills/LocalStorageUtills";
import OfferNotification from "./components/Modal/OfferNotification";
import toast from "react-hot-toast";
import Images from "./constant/Images";
function App() {
  const { meetLink, meetingData, rid, offerdata } = useContext(SocketContext);

  const getroom = getLocalStorage("notificationData")?.roomId;

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log(`Connected to server`);
    });
  }, []);

  return (
    <>
      {meetLink && <MeetingNotification data={meetingData} />}
      {rid && <OfferNotification data={offerdata} />}

      {/* <Toaster
        reverseOrder={false}
        toastOptions={{
          duration: 20000,
        }}
      /> */}
      <Toaster
        reverseOrder={false}
        toastOptions={{
          success: {
            duration: 20000,
            style: {
              backgroundColor: "#f0fdf4", // for background color
              color: "#166534", // for text color
            },
            icon: (
              <img
                src={Images.close}
                alt=""
                onClick={() => toast.dismiss()}
                style={{ cursor: "pointer" }}
              />
            ),
          },
          error: {
            style: {
              backgroundColor: "#fef2f2", // for background color
              color: "#991b1b", // for text color
            },
            duration: 20000,
            icon: (
              <img
                src={Images.close}
                alt=""
                onClick={() => toast.dismiss()}
                style={{ cursor: "pointer" }}
              />
            ),
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;