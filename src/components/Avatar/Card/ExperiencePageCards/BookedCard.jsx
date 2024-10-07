import Images from "@/constant/Images";
import moment from "moment";
import "moment-timezone"; // Import moment-timezone
import { formatTime, formatTimestamp } from "@/constant/date-time-format/DateTimeFormat";
import { createmeeting } from "@/utills/service/avtarService/AddExperienceService";
import socket from "@/utills/socket/Socket";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "@/utills/LocalStorageUtills";
import { getAvailableApi } from "@/utills/service/avtarService/AddExperienceService";

const BookedCard = ({ item, role }) => {
  const [duration, setDuration] = useState(30);
  const [countdown, setCountdown] = useState("");
  const [disableStart, setDisableStart] = useState(true);
  const [disableCancel, setDisableCancel] = useState(false);
  const [roomId, setRoomId] = useState(getLocalStorage("roomId"));
  const [currentTime, setCurrentTime] = useState(moment().format("YYYY-MM-DDTHH:mm:ss"));
  const [avtTimezone, setTimezone] = useState(null);
  const navigate = useNavigate();

  const handleGoLive = async () => {
    const reqdata = {
      userId: item?.userId,
      startTime: item?.bookingTime,
      ReqId: item?.reqId,
      endTime: item?.endTime,
      duration: duration,
      bookingId: item?.bookingId,
    };
    const response = await createmeeting(reqdata);
    socket.emit("details", { reqdata, item });
    localStorage.setItem("meetdata", JSON.stringify(response.data));
    if (response?.isSuccess) {
      const generatedRoomId = roomId || Math.random().toString(36).substr(2, 2);
      setRoomId(generatedRoomId);
      setLocalStorage("roomId", generatedRoomId);
      navigate(`/room_create/${generatedRoomId}`);
    }
  };

  const getTimezone = async () => {
    try {
      let res = await getAvailableApi();
      if (res.isSuccess) {
        setTimezone(res.data.timeZone);
      }
    } catch (err) {
      console.error("Failed to fetch timezone", err);
    }
  };

  useEffect(() => {
    getTimezone();
  }, []);

  useEffect(() => {
    if (!item?.bookingTime || !item?.endTime || !avtTimezone) return;

    socket.connect();

    // Adjust targetTime and endTime based on the avatar's timezone
    const targetTime = moment.tz(item?.bookingTime.slice(0, -1), "YYYY-MM-DDTHH:mm:ss", avtTimezone);
    const endTime = moment.tz(item?.endTime.slice(0, -1), "YYYY-MM-DDTHH:mm:ss", avtTimezone);

    const updateTimer = () => {
      const now = moment.tz(avtTimezone); // Get the current time in avatar's timezone
      const diff = targetTime.diff(now);
      const diffToEnd = endTime.diff(now);

      if (diff <= 0) {
        if (diffToEnd <= 0) {
          // Booking expired
          setCountdown("00:00:00");
          setDisableStart(true);
          setDisableCancel(true);
          localStorage.removeItem("roomId");
        } else {
          // Booking started but not ended
          setCountdown("00:00:00");
          setDisableStart(false);
          setDisableCancel(true);
        }
        clearInterval(timerInterval);
      } else {
        // Booking upcoming
        const duration = moment.duration(diff);
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();
        const seconds = duration.seconds();
        setCountdown(`${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`);
        setDisableStart(true);
        setDisableCancel(false);
      }
    };

    const timerInterval = setInterval(updateTimer, 1000);

    // Initial update
    updateTimer();

    // Clean up interval on component unmount
    return () => clearInterval(timerInterval);
  }, [item?.bookingTime, item?.endTime, avtTimezone]);

  return (
    <div className="p-4 sm:p-0 sm:mt-2">
      <div className="BoxShadowLessRounded pb-4 sm:pb-2">
        <div className="flex p-4 flex-wrap sm:p-2">
          <div className="w-[30%] relative">
            <img src={item?.experienceImage || Images.cardImageRounded} alt="cardImageRounded" className="w-full object-cover h-full rounded-lg aspect-square" />
            {role === "avatar" && <div className="absolute bottom-2 right-1 px-2 rounded-full font-bold bg-white text-sm">${item?.totalPrice}</div>}
          </div>
          <div className="w-[70%] pl-3">
            <h2 className="text-lg font-bold sm:text-sm leading-5 line-clamp-2">
              {item?.experienceName}, {item?.country}
            </h2>

            <div className="flex justify-between items-center gap-2 py-1 sm:py-[2px] text-xs">
              <div className="icon">
                <img src={Images.location} alt="location" className="w-3 h-3" />
              </div>
              <div className="flex-1">
                {item?.city && item?.city + ","} {item?.country}
              </div>
            </div>

            <div className="flex items-center gap-2 py-1 sm:py-[2px] text-xs">
              <div className="icon">
                <img src={Images.clock} alt="clock" className="w-3 h-3" />
              </div>
              <div className="flex-1">
                {formatTimestamp(item?.bookingTime.slice(0, -1))} - {formatTimestamp(item?.endTime.slice(0, -1))}
              </div>
            </div>
          </div>
        </div>
        {role === "avatar" && (
          <>
            <div className="flex justify-between px-4 py-2 sm:p-2 text-grey-800">
              <button className="bg-[#eaf6f2] text-[#37a77d] font-semibold py-2 rounded w-[100%] sm:text-xs" disabled>
                Booked
              </button>
            </div>
            <div className="flex justify-between px-4 py-2 sm:p-2 text-grey-800">
              {countdown === "00:00:00" ? (
                <>
                  {moment.tz(avtTimezone).isAfter(moment.tz(item?.endTime.slice(0, -1), "YYYY-MM-DDTHH:mm:ss", avtTimezone)) ? (
  <button disabled className="bg-[#ff000041] text-[#000] font-semibold py-2 rounded w-[100%] sm:text-xs">
    Expired
  </button>
) : (
  <button className="bg-[#eaf6f2] text-[#37a77d] font-semibold py-2 rounded w-[100%] sm:text-xs" onClick={handleGoLive}>
    Start
  </button>
)}
                </>
              ) : (
                <button className="bg-backgroundFill-900 w-[calc(100%-0rem)] sm:w-[calc(100%-1rem)] m-auto text-white flex justify-center items-center py-2 gap-2 rounded sm:text-xs">
                  <div className="img">
                    <img src={Images.timer} alt="timer" className="sm:w-4" />
                  </div>
                  <div className="text">{countdown}</div>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookedCard;
