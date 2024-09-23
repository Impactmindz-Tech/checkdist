import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/Routing";
import { Toaster } from "react-hot-toast";
import "react-country-state-city/dist/react-country-state-city.css";
import { useContext } from "react";
import { SocketContext } from "./store/notification";
import MeetingNotification from "./components/Modal/MeetingNotification";
import { getLocalStorage } from "./utills/LocalStorageUtills";
import OfferNotification from "./components/Modal/OfferNotification";
function App() {
  const {meetLink,meetingData,rid,offerdata } = useContext(SocketContext);
  
const getroom = getLocalStorage('notificationData')?.roomId;
console.log(offerdata,'nbana');


  return (
    <>
      {meetLink && <MeetingNotification data={meetingData} />}
      {rid && <OfferNotification data={offerdata}/>}

      <Toaster reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
