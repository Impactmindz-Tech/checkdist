import EditDateCalendar from "@/components/Calendar/EditDateCalendar";
import HeaderBack from "@/components/HeaderBack";
import toast from "react-hot-toast";
import { bookingExperinceApi } from "@/utills/service/userSideService/userService/UserHomeService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import dayjs from "dayjs";
import { DateTime } from "luxon";
import { getLocalStorage, setLocalStorage } from "@/utills/LocalStorageUtills";
import { getDateTimeForTimezone } from "@/constant/date-time-format/DateTimeFormat";
import Images from "@/constant/Images";
import AddMoreTime from "@/components/Modal/AddMoreTimeModal";

function Booking() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('null');
  const [duration, setDuration] = useState(null);
  const [type, setType] = useState(null);
  const [color, setColor] = useState(false);
  const [showAddMoreTimeModal, setShowAddMoreTimeModal] = useState(false);

  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    } else if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    } else {
      throw new Error("Invalid date format");
    }
  };

  const isTimeSelectable = (time) => {
    if (dayjs(date).isSame(dayjs(), "day")) {
      const selectedTime = dayjs(`${formatDate(date)}T${time}`);
      return selectedTime.isAfter(dayjs());
    }
    return true;
  };

  const onSubmit = async () => {
    setLoading(true);
    let body = {
      bookingDate: formatDate(date),
      bookingTime: selectedTime,
      Duration: duration,
      tourType: type,
    };
    try {
      const response = await bookingExperinceApi(params?.id, body);
      if (response?.isSuccess) {
        toast.success("Booking Created Successfully");
        setLocalStorage("currentBooking", params?.id);
        navigate("/user/confirm-and-pay/" + response?.data?._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = date && selectedTime && duration && type;
  // const currentTime = new Date().toLocaleTimeString();

  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const intervalId = setInterval(
      () => setCurrentTime(new Date().toLocaleTimeString()),
      1000
    );
    return () => clearInterval(intervalId);
  }, []);

  //   import moment from 'moment-timezone';

  // // Function to get the current local time
  // function getCurrentLocalTime() {
  //   // Get the user's time zone from the browser
  //   const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  //   // Get the current time in the user's time zone
  //   const localTime = moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');

  //   return localTime;
  // }

  // // Usage
  // const currentLocalTime = getCurrentLocalTime();
  // console.log(`Please select the experience time as the avatar time. The current avatar time is ${currentLocalTime}.`);
  // console.log(
  //   getDateTimeForTimezone(getLocalStorage("avatarTime")).split(" ")[1]
  // );

  // CONVERT TIME TO 12 HOUR FORMAT
  const convertTo12Hour = (timeString) => {
    const [hour, minute, second] = timeString.split(":");
    let hours = parseInt(hour);
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minute}:${second} ${suffix}`;
  };

  // GET CURRENT TIME IN 12 HOUR FORMAT
  const getCurrentTime12Hour = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes}:${seconds} ${suffix}`;
  };
  return (
    <>
      {loading ? <Loader /> : null}
      <div className="container">
        <HeaderBack link="/user/book-experience" text={"Set Date"} />

        <div className="my-4">
          <EditDateCalendar date={date} onDateChange={setDate} setSelectedTime={setSelectedTime}/>
          <div className="w-full mt-4 sm:max-w-full sm:w-full">
            <h2
              className="text-xl font-semibold mb-4"
              onClick={() => {
                console.log("Hello there!");
                setShowAddMoreTimeModal(true);
              }}
            >
              Please select the experience time as the Avatar time
            </h2>
            <div className="rounded-md border border-[#e2e2e2] BoxShadow py-[6px] sm:py-0 overflow-hidden sm:shadow-none">
              <table className="table-time sm:text-[14px] table-responsive-custom">
                <tr>
                  <th>
                    <img
                      src={Images.clock}
                      alt=""
                      className="inline-block mr-[10px] w-[22px] sm:w-[18px]"
                    />
                    The current avatar time is:
                  </th>
                  <td style={{ textAlign: "right" }}>
                    {/* {convertTo12Hour(
                              getDateTimeForTimezone(
                                experinceList?.data?.getAvailable.timeZone
                              ).split(" ")[1]
                            )} */}
                    {convertTo12Hour(
                      getDateTimeForTimezone(
                        getLocalStorage("avatarTime")
                      ).split(" ")[1]
                    )}
                  </td>
                </tr>
                <tr>
                  <th>
                    <img
                      src={Images.iconGlobeClock}
                      alt=""
                      className="inline-block mr-[10px] w-[24px] relative left-[-2px] sm:w-[20px]"
                    />
                    Their time zone:
                  </th>
                  <td style={{ textAlign: "right" }}>
                    {/* {experinceList?.data?.getAvailable.timeZone} */}
                    {getLocalStorage("avatarTime")}
                  </td>
                </tr>
                <tr>
                  <th>
                    <img
                      src={Images.clock}
                      alt=""
                      className="inline-block mr-[10px] w-[22px] sm:w-[18px]"
                    />
                    Your current time:
                  </th>
                  <td style={{ textAlign: "right" }}>
                    {getCurrentTime12Hour()}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          {/* <div className="bg-gray-200 p-4 rounded-lg mt-4">
            <h2 className="text-xl font-semibold mb-2">
              Please select the experience time as the avatar time:
            </h2>
            <p>
              The current avatar time is:
              <span className="ml-2 font-semibold">
                {getDateTimeForTimezone(getLocalStorage("avatarTime"))}
              </span>
            </p>
            <p>
              Your current time is:
              <span className="ml-2 font-semibold">{currentTime}</span>
            </p>
          </div> */}

          <div className="bg-white rounded-lg my-5">
            <h2 className="text-xl font-semibold mb-4">
              Eastern Standard Time
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selected Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formatDate(date)}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selected Time
                </label>
                <div className="relative flex items-center">
                  <input
                    type="time"
                    readOnly
                    value={selectedTime}
                    className={`w-full p-2 border border-gray-300 rounded-md`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Duration</h3>
            <div className="flex space-x-2">
              <button
                className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                  duration === 15 ? "bg-black text-white" : "bg-gray-200"
                } rounded-md`}
                onClick={() => setDuration(15)}
              >
                15 min
              </button>
              <button
                className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                  duration === 30 ? "bg-black text-white" : "bg-gray-200"
                } rounded-md`}
                onClick={() => setDuration(30)}
              >
                30 min
              </button>
              <button
                className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                  duration === 45 ? "bg-black text-white" : "bg-gray-200"
                } rounded-md`}
                onClick={() => setDuration(45)}
              >
                45 min
              </button>
              <button
                className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                  duration === 60 ? "bg-black text-white" : "bg-gray-200"
                } rounded-md`}
                onClick={() => setDuration(60)}
              >
                60 min
              </button>
            </div>
          </div>
          <div className="my-2">
            <h3 className="text-lg font-semibold mb-2">Tour Type</h3>
            <div className="flex space-x-2">
              <button
                className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                  type === "Public" ? "bg-black text-white" : "bg-gray-200"
                } rounded-md`}
                onClick={() => setType("Public")}
              >
                Public
              </button>
              <button
                className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                  type === "Private" ? "bg-black text-white" : "bg-gray-200"
                } rounded-md`}
                onClick={() => setType("Private")}
              >
                Private
              </button>
            </div>
          </div>

          {type === "Private" && (
            <div className="relative my-4 py-6 text-lg sm:text-base px-4 sm:py-4 sm:px-2 w-full text-center font-semibold bg-gray-200 rounded-md overflow-hidden">
              <img
                src={Images.patternDots}
                alt=""
                className="absolute left-0 top-[50%] object-cover w-full h-full -translate-y-1/2"
              />
              This tour is exclusively for you
            </div>
          )}

          {type === "Public" && (
            <div className="relative my-4 py-6 text-lg sm:text-base px-4 sm:py-4 sm:px-2 w-full text-center font-semibold bg-gray-200 rounded-md overflow-hidden">
              <img
                src={Images.patternDots}
                alt=""
                className="absolute left-0 top-[50%] object-cover w-full h-full -translate-y-1/2"
              />
              Anyone can pay to join this live with you
            </div>
          )}
          {/* <div className="my-2">
            <h3 className="text-lg font-semibold mb-2">
              You Can Live Your Tour for Others
            </h3>
            <button
              type="button"
              className="text-white inline-flex gap-2 py-3 px-4 sm:px-2 sm:py-1 sm:text-sm bg-gradient-to-r from-[#FF7070] to-[#FF4545] rounded-md first-letter-capital leading-none"
            >
              <img src={Images.instantLiveLight} alt="" />
              Live
            </button>
          </div> */}

          <div
            onClick={isFormComplete ? onSubmit : null}
            className={`w-full my-6 rounded-md bottom-1 m-auto left-0 right-0 p-2 cursor-pointer bg-backgroundFill-900 text-white text-center ${
              !isFormComplete ? "opacity-[0.5]" : "opacity-1"
            }`}
          >
            <button
              disabled={!isFormComplete}
              className="py-1 font-bold cursor-pointer"
            >
              {"Proceed"}
            </button>
          </div>
        </div>
      </div>
      <AddMoreTime
        show={showAddMoreTimeModal}
        onClose={() => setShowAddMoreTimeModal(false)}
      />
    </>
  );
}

export default Booking;
