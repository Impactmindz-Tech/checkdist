import Images from "@/constant/Images";
import IconText from "../Heading/IconText";
import { Link, useNavigate } from "react-router-dom";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import socket from "@/utills/socket/Socket";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { convertTo12HourFormats, formatDate } from "@/constant/date-time-format/DateTimeFormat";
import { completeoffer } from "@/utills/service/userSideService/userService/UserHomeService";

export default function OffersCard({ state, item }) {
  const [rid, setid] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isCountdownOver, setIsCountdownOver] = useState(false);
  const [loader, setLoader] = useState(false);
  const [, forceUpdate] = useState(0);
  const navigate = useNavigate();

  const handleclick = (item) => {
    navigate(`/user/offer_confirm/${item?._id}`);
  };

  const handlejoin = () => {
    socket.connect();
    window.location.href = `/room_join/${rid}`;
  };

  const handlecomplete = async (item) => {
    const id = item?._id;
    setLoader(true);  // Show the loader

    try {
      let response = await completeoffer(id);
      
      // After the action is completed, navigate to the offers tab
      navigate("/user/experience?tab=offers");

      setLoader(false);  // Hide the loader
      forceUpdate((n) => n + 1);  // Force a re-render if necessary
    } catch (err) {
      console.log(err);
      setLoader(false);  // Hide the loader in case of an error
    }
  };

  useEffect(() => {
    socket.connect();
    socket.on("roomIds", (data) => {
      setid(data.generatedRoomId);
    });
  }, []);

  useEffect(() => {
    socket.connect();
    socket.emit("userOnline", item?.userId);
  }, []);

  const calculateRemainingTime = () => {
    const now = new Date();
    const bookingDateTime = new Date(item?.Time); // Assuming bookingTime is stored as UTC
    const localBookingTime = new Date(bookingDateTime.getTime() + (bookingDateTime.getTimezoneOffset() * 60000));

    const timeDiff = localBookingTime - now; // Difference in milliseconds

    if (timeDiff <= 0) {
      setRemainingTime("00::00::0");
      setIsCountdownOver(true); // Countdown is over
      return;
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    setRemainingTime(`${hours}::${minutes}::${seconds}`);
  };

  useEffect(() => {
    if (item?.Time) {
      calculateRemainingTime();
      const interval = setInterval(calculateRemainingTime, 1000);
      return () => clearInterval(interval);
    }
  }, [item?.Time]);

  return (
    <>
      {loader && <Loader />}  {/* Show loader when loader state is true */}
      
      <div className="squareShadow p-5 text-grey-900 mt-5">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">
            {getCurrencySymbol()}
            {item?.Price}
          </h1>
          <div className="text-[#2AA174] bg-[#fff9e6] pt-[4px] pb-[5px] px-[10px] rounded-full text-xs font-medium mb-[5px] inline-block bg-[#2AA1741A]/10">
            {item?.status}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <IconText icon={Images.multiUser} text={item?.UserName} />
            <IconText icon={Images.clock} text={`${item?.Minutes} Minutes`} />
            <IconText icon={Images.location} text={`${item?.City}, ${item?.Country}, ${item?.ZipCode}`} />
          </div>
          <div>
            <h5 className="font-medium my-1">{formatDate(item?.Date) || "N/A"}</h5>
            <h5 className="text-end">{convertTo12HourFormats(item?.Time)} - {convertTo12HourFormats(item?.endTime)}</h5>
            <h4 className="ms-12"><IconText icon={Images.clock} text={remainingTime} /></h4>
          </div>
        </div>

        {item?.status === "Completed" ? (
          <button
            className="bg-backgroundFill-900 text-white flex justify-center items-center py-3 gap-2 rounded w-[100%] mt-4 opacity-50 cursor-not-allowed"
            disabled
          >
            Completed
          </button>
        ) : (
          <>
            <button className="bg-backgroundFill-800 text-white flex justify-center w-[50%] items-center py-3 gap-2 rounded">
              Cancel
            </button>

            <div className="flex justify-between">
              {item?.paystatus === "Succeeded" ? (
                <>
                  <button
                    onClick={handlejoin}
                    className={`bg-backgroundFill-900 text-white flex justify-center items-center py-3 gap-2 rounded w-[45%] ${!rid ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!rid}
                  >
                    Let's Start
                  </button>
                  <button
                    onClick={() => handlecomplete(item)}
                    className="bg-backgroundFill-900 text-white flex justify-center items-center py-3 gap-2 rounded w-[45%]"
                  >
                    Completed
                  </button>
                </>
              ) : (
                item?.status === "Accepted" && (
                  <button
                    onClick={() => handleclick(item)}
                    className="bg-backgroundFill-900 sm:text-xs text-white flex justify-center items-center py-3 gap-2 rounded w-[50%]"
                  >
                    Pay now
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
