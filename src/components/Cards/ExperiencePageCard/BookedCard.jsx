import { useState, useEffect, useContext } from "react";
import Images from "@/constant/Images";
import { getLocalStorage, setLocalStorage } from "@/utills/LocalStorageUtills";
import { useNavigate, useLocation } from "react-router-dom";
import { payoutApi } from "@/utills/service/userSideService/PayConfiermService";
import toast from "react-hot-toast";
import { ChatMessageGetByConversationIdApi } from "@/utills/service/userSideService/ChatService";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import Loader from "@/components/Loader";
import socket from "@/utills/socket/Socket";
import moment from "moment-timezone";
import { claimRefundApi } from "@/utills/service/userSideService/userService/UserHomeService";
import { SocketContext } from "@/store/notification";
import { handleBookingRequestApi } from "@/utills/service/avtarService/AddExperienceService";

const BookedCard = ({ item }) => {
  
  const { meetLink, meetingData } = useContext(SocketContext);
  const users = getLocalStorage("user");
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const [disablePay, setDisablePay] = useState(false);
  const [disableStart, setDisableStart] = useState(true);
  const [roomId, setRoomId] = useState(getLocalStorage("meetRoomId"));
  const [disableCancel, setDisableCancel] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [isTimeOver, setIsTimeOver] = useState(false);
  const [fetchAvtarTimeIntrue, setFetchAvtarTimeIntrue] = useState(false);
  const [fetchAvtarTimeInTimezone, setFetchAvtarTimeInTimezone] = useState(false);
  const [fetchAvtarendTimeIntrue, setFetchAvtarendTimeIntrue] = useState(false);
  const [fetchAvtarendTimeInTimezone, setFetchAvtarendTimeInTimezone] = useState(false);
  const [userTimezone, setUserTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);


  const acceptBooking = () => {

    navigate("/room_join/" + roomId);
  };

  const cancelBooking = async (status,item) => {
    setLocalStorage("cancelOrder", item);
    let payload = { bookingId: item.bookingId };
    try {
      setLoader(true);
     // let res = await claimRefundApi(payload);
      // if (res?.isSuccess) {
      //   toast.success(res?.message);
      // }
      const body = { action: status };
      const response = await handleBookingRequestApi(item?.reqId, body);
      if (response?.isSuccess) {
        const targetTab = status === "accept" ? "Booked" : "cancelled";
        navigate(`/user/experience?tab=${targetTab}`);
   
        // getRequests("Cancelled");

      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handlePayConfirm = async () => {
    const body = {
      to: item?.avatarId,
      price: item?.totalPrice,
      reqid: item?.reqId,
    };
    try {
      setLoader(true);
      const response = await payoutApi(body);
      if (response?.isSuccess) {
        setDisablePay(true);
        toast(response?.message);
        navigate("/user/experience?tab=completed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const ChatMessageGetByConversationId = async (item) => {
    let senderId = getLocalStorage("user")?._id || "";
    const conversationId = item?.conversationId || "new";
    let body = {
      senderId: senderId,
      receiverId: item?.avatarId,
    };

    try {
      const response = await ChatMessageGetByConversationIdApi(conversationId, body.senderId, body.receiverId);
      if (response?.isSuccess) {
        navigate(`/user/ChatUser/${item?.avatarId}`, {
          state: { item: { name: item?.avatarName, id: item?.avatarId } },
        });
      }
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    socket.connect();
    if (fetchAvtarTimeIntrue && fetchAvtarTimeInTimezone && fetchAvtarendTimeInTimezone) {
      const timeZone = userTimezone;
      const bookingTime = moment.tz(fetchAvtarTimeInTimezone, "M/D/YYYY, HH:mm:ss", timeZone);
      const endTime = moment.tz(fetchAvtarendTimeInTimezone, "M/D/YYYY, HH:mm:ss", timeZone);

      const updateTimer = () => {
        const now = moment.tz(timeZone);
        const diff = bookingTime.diff(now);
        const timeToEnd = endTime.diff(now);
        if (diff <= 0) {
          setCountdown("00:00:00");
          setDisableStart(false);
          setDisableCancel(true);
          clearInterval(timerInterval);
        } else {
          const duration = moment.duration(diff);
          const hours = Math.floor(duration.asHours());
          const minutes = duration.minutes();
          const seconds = duration.seconds();
          setCountdown(`${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`);
        }

        if (timeToEnd <= 0) {
          setIsTimeOver(true);
          setDisableStart(true);
          setDisableCancel(true);
          clearInterval(timerInterval);
        }
      };

      const timerInterval = setInterval(updateTimer, 1000);
      return () => clearInterval(timerInterval);
    }

  }, [fetchAvtarTimeIntrue, fetchAvtarTimeInTimezone, fetchAvtarendTimeInTimezone, userTimezone]);

  useEffect(()=>{
    if(isTimeOver){
      localStorage.removeItem('meetRoomId')
    }
  },[])

  useEffect(() => {
    if (item?.bookingDate && item?.endTime) {
      getTimezoneFromGeoJS(item?.bookingTime, item?.endTime, "Asia/Kolkata");
    }
  }, [item?.bookingDate, item?.endTime]);

  async function getTimezoneFromGeoJS(bookingdatestarttime, bookingdateendtime, inputTimeZone) {
    try {
      // Get the user's local system timezone
      const userTimezone = item?.timezone?.timeZone;

      // Helper function to convert time from the specified input timezone to New York timezone
      function convertToNewYorkTime(dateStr, inputTimeZone) {
        // Parse the time string as Date
        const localDate = new Date(dateStr);

        // Convert to the New York timezone
        const newYorkTime = localDate.toLocaleString("en-US", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          hour12: false, // 24-hour format
        });

        return newYorkTime;
      }

      // Convert start time to New York timezone
      const startTimeStr = bookingdatestarttime.slice(0, -1); // Remove the last character if it's 'Z'
      const newYorkStartTime = convertToNewYorkTime(startTimeStr, inputTimeZone);
      setFetchAvtarTimeInTimezone(newYorkStartTime);
      setFetchAvtarTimeIntrue(true);

      // Convert end time to New York timezone
      const endTimeStr = bookingdateendtime.slice(0, -1); // Remove the last character if it's 'Z'
      const newYorkEndTime = convertToNewYorkTime(endTimeStr, inputTimeZone);
      setFetchAvtarendTimeInTimezone(newYorkEndTime);
      setFetchAvtarendTimeIntrue(true);

      // Store the user's system timezone
      setUserTimezone(userTimezone);
    } catch (error) {
      console.error("Error converting to New York timezone:", error);
    }
  }

  const isBookingOngoing = () => {
    const now = moment.tz(userTimezone);
    return now.isBetween(moment.tz(fetchAvtarTimeInTimezone, "M/D/YYYY, HH:mm:ss", userTimezone), moment.tz(fetchAvtarendTimeInTimezone, "M/D/YYYY, HH:mm:ss", userTimezone));
  };

  useEffect(() => {
    const bookingIdFilter = meetingData?.item?.bookingId == item?.bookingId;
    if (bookingIdFilter) {
      setRoomId(meetLink);
      setLocalStorage("meetRoomId", meetLink);
    }
  }, [meetLink]);

  return (
    <>
      {loader && <Loader />}

      <div className="p-4 sm:p-0 sm:mt-2">
        <div className="BoxShadowLessRounded">
          <div className="flex items-start gap-4 p-4 sm:flex-wrap">
            <div className="sm:w-[100%]">
              <img src={item?.experienceImage} alt="cardImageRounded" className="w-30 h-[100px] sm:w-full object-cover sm:h-[200px] rounded-lg" />
            </div>
            <div className="w-[80%] sm:w-[100%]">
              <div className="text-[#2AA174] bg-[#fff9e6] pt-[4px] pb-[5px] px-[10px] rounded-full text-xs font-medium mb-[5px] inline-block bg-[#2AA1741A]/10">{item?.status}</div>
              <h2 className="text-lg font-bold pt-1 sm:text-sm">
                {item?.experienceName}, {item?.country}
              </h2>
              <div className="description flex gap-2 items-center sm:flex-wrap">
                <p className="text-xs text-black">{moment(item?.bookingDate).format("YYYY-MM-DD")}</p>
                <li className="text-grey-800 leading-none">
                  <span className="text-black text-xs">
                    {moment.tz(item?.bookingTime, "UTC").format("hh:mm A")} - {moment.tz(item?.endTime, "UTC").format("hh:mm A")}
                  </span>
                </li>
              </div>
            </div>
          </div>
          <div className="borderTopBottom flex justify-between m-auto w-[94%] py-2 text-grey-800 sm">
            {" "}
            <div className="author">
              {" "}
              <b>Avatar</b>: {item?.avatarName}{" "}
            </div>{" "}
            <div className="font-bold">
              {" "}
              {getCurrencySymbol()} {item?.totalPrice}{" "}
            </div>{" "}
          </div>
          <div className="my-3 w-[94%] m-auto">
            <button className="border border-primaryColor-900 text-black font-semibold py-2 rounded w-full sm:text-xs" onClick={() => ChatMessageGetByConversationId(item)}>
              {location.pathname === "/user/experience" ? "Chat with Avatar" : "Chat with User"}
            </button>

            {users?.Activeprofile === "user" && (
              <button className="bg-backgroundFill-900 text-white flex justify-center items-center py-3 gap-2 rounded w-full mt-2 sm:text-xs">
                <div className="img">
                  <img src={Images.timer} alt="timer" className="sm:w-4" />
                </div>
                <div className="text">{countdown ? countdown : "00.00.00"}</div>
              </button>
            )}

            <div className="flex justify-center items-center py-3 gap-2 rounded w-full">
              {isTimeOver ? (
                <button disabled={true} className="bg-gray-400 text-gray-600 flex justify-center items-center py-3 gap-2 rounded w-full sm:text-xs">
                  Expired
                </button>
              ) : (
                <>
                  <button className={`bg-backgroundFill-900 text-white flex justify-center ${!roomId ? "w-[100%]" : "w-[50%]"} items-center py-3 gap-2 rounded ${disableCancel ? "bg-gray-400 text-gray-600" : ""}`} onClick={() => cancelBooking("reject",item)} disabled={disableCancel}>
                    Cancel
                  </button>
                  {roomId && (
                    <button className={`bg-backgroundFill-900 sm:text-xs text-white flex justify-center items-center py-3 gap-2 rounded w-[50%] ${disableStart ? "bg-gray-400 text-gray-600" : ""}`} onClick={() => acceptBooking(item)} disabled={disableStart}>
                      Start
                    </button>
                  )}
                </>
              )}

              {/* {isTimeOver && (
                <button disabled={disablePay} className={`flex justify-center sm:text-xs ${roomId ? "w-[100%]" : "w-[50%]"} items-center py-3 gap-2 rounded w-full ${disablePay ? "bg-gray-400 text-gray-600" : "bg-backgroundFill-900 text-white"}`} onClick={handlePayConfirm}>
                  Complete
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookedCard;
