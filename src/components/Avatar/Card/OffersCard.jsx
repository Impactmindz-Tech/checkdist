import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import IconText from "../Heading/IconText";
import Images from "@/constant/Images";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import socket from "@/utills/socket/Socket";
import { convertTo12HourFormats, formatDate } from "@/constant/date-time-format/DateTimeFormat";
import { formatTimeAMPM } from "@/components/Cards/ExperienceCard";
import moment from "moment";

export default function OffersCard({ state, item }) {
  const [remainingTime, setRemainingTime] = useState(null); // State to store remaining time
  const [isCountdownOver, setIsCountdownOver] = useState(false); // State to track if countdown is over
  const [isExpired, setIsExpired] = useState(false); // State to track if the end time is crossed
  const navigate = useNavigate();

  // Function to calculate the remaining time until bookingTime
  const calculateRemainingTime = () => {
    const now = new Date();
    
    // Convert bookingTime and endTime to local time if stored in UTC
    const bookingDateTime = new Date(item?.bookingTime);
    const endDateTime = new Date(item?.endTime);
    
    const localBookingTime = new Date(bookingDateTime.getTime() + (bookingDateTime.getTimezoneOffset() * 60000));
    const localEndTime = new Date(endDateTime.getTime() + (endDateTime.getTimezoneOffset() * 60000));
  
    const timeDiff = localBookingTime - now; // Difference in milliseconds for bookingTime
    const endDiff = localEndTime - now; // Difference in milliseconds for endTime
  
    if (timeDiff <= 0) {
      setRemainingTime("00::00:00");
      setIsCountdownOver(true); // Countdown is over
    } else {
      // Calculate hours, minutes, and seconds from the time difference
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
    }

    // Check if current time has passed endTime
    if (endDiff <= 0) {
      setIsExpired(true); // End time has crossed, mark as expired
    }
  };
  
  // Set up the countdown effect
  useEffect(() => {
    if (item?.bookingTime) {
      calculateRemainingTime(); // Calculate initially
  
      const interval = setInterval(calculateRemainingTime, 1000); // Update every second
  
      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [item?.bookingTime, item?.endTime]);
  
  const handleRouting = (item) => {
    if (!state) {
      navigate(`/avatar/offers/` + item?.id);
    }
  };

  const handleStart = () => {
    socket.connect();
    const generatedRoomId = Math.random().toString(36).substr(2, 2);
    socket.emit("offerId", { generatedRoomId, item });
    navigate(`/room_create/${generatedRoomId}`);
  };

  return (
    <>
      {item?.status === "Accepted" || item?.status==="Completed" ? (
        <div className=" squareShadow p-5 text-grey-900 mt-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl">
              {getCurrencySymbol()}
              {item?.totalPrice.toFixed(2)}
            </h1>
            <div className="text-[#2AA174] bg-[#fff9e6] pt-[4px] pb-[5px] px-[10px] rounded-full text-xs font-medium mb-[5px] inline-block bg-[#2AA1741A]/10">
              {item?.status}
            </div>
          </div>

          <h2 className="font-bold">
            {item?.ExperienceName}, {item?.Country}
          </h2>
          <div className="flex justify-between items-center">
            <div>
              <IconText icon={Images.multiUser} text={item?.UserName} />
              <IconText icon={Images.clock} text={`${item?.Duration} Minutes`} />
              <IconText icon={Images.location} text={`${item?.City}, ${item?.Country}, ${item?.ZipCode}`} />
            </div>
            <div>
              <h5 className="font-medium my-1 text-end">{formatDate(item?.Date) || "N/A"}</h5>
              <h5 className="text-end">{convertTo12HourFormats(item?.bookingTime)} - {convertTo12HourFormats(item?.endTime)}</h5>
              <h4 className="ms-12"><IconText icon={Images.clock} text={remainingTime} /></h4>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            {item?.paystatus === "Succeeded" && (
              <>
                {isExpired ? (
                  // Show expired button if end time is crossed
                  <button className="bg-red-500 text-white flex justify-center items-center py-3 gap-2 rounded w-full opacity-50 cursor-not-allowed">
                   {item?.status==="Completed"?'Completed':'Expired'}
                  </button>
                ) : (
                  <>
                    <button
                      className={`bg-backgroundFill-900 text-white flex justify-center items-center py-3 gap-2 rounded w-full ${!isCountdownOver ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={handleStart}
                      disabled={!isCountdownOver} // Disable button if countdown is not over
                    >
                      Start
                    </button>
                 
                  </>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="squareShadow cursor-pointer p-5 text-grey-900 mt-5" onClick={() => handleRouting(item)}>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl">
              {getCurrencySymbol()}
              {item?.totalPrice}
            </h1>
            <div className="text-[#2AA174] bg-[#fff9e6] pt-[4px] pb-[5px] px-[10px] rounded-full text-xs font-medium mb-[5px] inline-block bg-[#2AA1741A]/10">
              {item?.status}
            </div>
          </div>

          <h2 className="font-bold">
            {item?.ExperienceName}, {item?.Country}
          </h2>
          {state ? "" : <IconText icon={Images.multiUser} text={item?.UserName} />}
          <IconText icon={Images.clock} text={`${item?.Duration} Minutes`} />
          <IconText icon={Images.location} text={`${item?.City}, ${item?.Country}, ${item?.ZipCode}`} />
        </div>
      )}
    </>
  );
}
