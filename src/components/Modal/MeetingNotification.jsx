import socket from "@/utills/socket/Socket";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const MeetingNotification = ({ data }) => {
  const [notificationData, setNotificationData] = useState(() => {
    // Retrieve notification data from localStorage
    const savedData = localStorage.getItem("notificationData");
    return savedData ? JSON.parse(savedData) : data;
  });

  useEffect(() => {
    // Save notification data to localStorage whenever it changes
    if (notificationData) {
      localStorage.setItem(
        "notificationData",
        JSON.stringify(notificationData)
      
      );
      localStorage.setItem("meet",notificationData?.meetid);
    }
   
    
  }, [notificationData]);
     
  const onJoin = () => {
    const roomId = notificationData.roomId;
    window.location.href = `/room_join/${roomId}`;
    setNotificationData(null);
    localStorage.removeItem("notificationData");
  };

  const onCancel = () => {
    // Clear notification data from state and localStorage
    setNotificationData(null);
    localStorage.removeItem("notificationData");
  };

  // If no notification data, return null (component won't render)
  if (!notificationData) return null;

  return (
    <div
      className="fixed notification top-40 right-4 bg-white rounded-lg p-[10px] flex items-center justify-between flex-col"
      style={{
        width: "400px",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        maxWidth: "calc(100% - 30px)",
        border: "1px solid #ddd",
      }}
    >
      <div className="flex items-center w-full">
        <img
          src={notificationData?.item?.experienceImage}
          alt="Experience"
          className="w-16 h-16 rounded-md mr-4"
        />
        <div>
          <h3 className="text-lg font-bold leading-none line-clamp-1 first-letter-capital">
            {notificationData?.item?.experienceName}
          </h3>
          <p className="text-gray-500 leading-none mt-[8px]">
            {notificationData?.item?.state}
          </p>
          <p className="text-gray-800 leading-none mt-[8px] font-semibold">
            ${notificationData?.item?.totalPrice}
          </p>
        </div>
      </div>
      <div className="flex space-x-2 pl-20 w-full mt-[10px]">
        <button
          onClick={onCancel}
          className="bg-gray-300 text-black px-[14px] py-[10px] rounded-md leading-none text-sm flex-1"
        >
          Cancel
        </button>
        <button
          onClick={onJoin}
          className="bg-black text-white px-[10px] py-[6px] rounded-md leading-none text-sm flex-1"
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default MeetingNotification;
