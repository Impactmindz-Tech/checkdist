import React, { useEffect, useState } from "react";
import SwiperSlider from "@/components/Swiper/UserDashboardCardSwiper/SwiperSlider";
import { Link } from "react-router-dom";
import Images from "@/constant/Images";
import socket from "@/utills/socket/Socket";
import { getLocalStorage } from "@/utills/LocalStorageUtills";
import { bookingSlotsApi } from "@/utills/service/userSideService/userService/UserHomeService";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { convertTo12HourFormats } from "@/constant/date-time-format/DateTimeFormat";

const MainExperienceList = ({ product }) => {
  const [meetlink, setmeetlink] = useState("");
  const [loader, setLoader] = useState(false);
  const userId = getLocalStorage("user")?._id;
  const username = getLocalStorage("user")?.userName;

  const golive = async (data) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; 
    const currentTime = currentDate.toTimeString().slice(0, 5); 

    const id = data._id;
    const requestBody = { bookingDate: formattedDate };
    setLoader(true);
    try {
      const res = await bookingSlotsApi(id, requestBody);

      if (res?.isSuccess) {
        const isWithinSlot = res.remainingSlots.some(
          (slot) => currentTime >= slot.from && currentTime <= slot.to
        );
        if (isWithinSlot) {
          toast.success("Request Successfully send to avatar for Public Live");

          const datas = {
            sendid: product?.avatarId,
            reqid: userId,

            product: product?._id,

            userName: username,
          };
          socket.emit("instantRequest", datas);
        } else {
          toast.error("Avatar is not available right now.");
        }
      }
    } catch (error) {
      toast.error("Error sending booking request:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    socket.connect();
    socket.emit("instantLive", userId);
    socket.on("getmeet", (data) => {
      setmeetlink(data.link);
    });

    return () => {
      socket.emit("userOffline", userId);
      socket.off("instantLive");
    };
  }, [userId]);

const from = product?.availability?.from;
const to= product?.availability?.to;
const timezone = product?.availability?.timeZone
 const fromto =  convertTo12HourFormats(from);
const too = convertTo12HourFormats(to);

const getUTCOffsetFromTimezone = (timezone) => {
  
  const now = new Date();

  const options = { timeZone: timezone, timeZoneName: 'short' };
  const formatter = new Intl.DateTimeFormat([], options);

  const parts = formatter.formatToParts(now);
  const offset = parts.find(part => part.type === 'timeZoneName').value;

  return offset; 
};



const utcOffset = getUTCOffsetFromTimezone(timezone);



  return (
    <>
      {loader && <Loader />}

      {/* <Link to={`/book-experience/${product._id}`}> */}
      <div className="max-w-sm overflow-hidden sm:max-w-full h-full relative sm:border-b-2">
        <Link
          to={`/book-experience/${product._id}`}
          className="pb-3 flex gap-4 items-center"
        >
          <img
            src={product.avatarImage || Images.user2}
            alt="user"
            className="w-[50px] h-[50px] sm:w-10 sm:h-10 rounded-full border object-cover border-white shadow-md"
          />
          <h2 className="font-bold">{product.avatarName}</h2>    {product?.bookinstaltly && (
              <button
                onClick={() => golive(product)}
                className="flex items-center px-4 py-1 ms-auto bg-gradient-to-r from-red-500 to-pink-500 text-[10px] text-white font-semibold rounded-md shadow-md"
              >
                <span className="mr-2 text-[10px] animate-pulse">
                  <img src={Images.hotsport} alt="hosport" />
                </span>
                Public Live
              </button>
            )}
        </Link>
        <Link to={`/book-experience/${product?._id}`}>
          <SwiperSlider
            setheight={true}
            item={product.images || Images.cardRoundedEqual}
            thumnail={product?.thumbnail}
            price={product.AmountsperMinute}
            avrrating={product.avgRating}
          />
        </Link>
        <div className="pb-4">
          <div className="font-bold text-xl relative first-letter:capitalize sm:text-base">
            <Link
              to={`/user/book-experience/${product._id}`}
              className="pt-4 pb-2 block"
            >
              {product.ExperienceName}
            </Link>
          </div>
          <p className="text-grey-800 text-base sm:text-xs font-medium">
            <Link to={`/user/book-experience/${product._id}`}>
              {product?.city && product?.city + " ,"} {product.country}
            </Link>
          </p>
          <div className="flex  items-center justify-between">
            <p className="text-gray-700 text-base w-[100%] lg:w-[100%] sm:text-[13px] font-medium">
              {`${fromto} to ${too} • ${utcOffset}`}
            </p>
        
          </div>
        </div>
      </div>
      {/* </Link> */}
    </>
  );
};

export default MainExperienceList;
