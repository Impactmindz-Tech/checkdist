import React, { useEffect, useState } from "react";
import SwiperSlider from "@/components/Swiper/UserDashboardCardSwiper/SwiperSlider";
import { Link, useNavigate } from "react-router-dom";
import Images from "@/constant/Images";
import socket from "@/utills/socket/Socket";
import { getLocalStorage } from "@/utills/LocalStorageUtills";
import { bookingSlotsApi } from "@/utills/service/userSideService/userService/UserHomeService";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { convertTo12HourFormats } from "@/constant/date-time-format/DateTimeFormat";

const ExperienceList = ({ product }) => {
  const [meetlink, setmeetlink] = useState("");
  const [loader, setLoader] = useState(false);
  const userId = getLocalStorage("user")?._id;
  const username = getLocalStorage("user")?.userName;
  const navigate = useNavigate();

  const golive = async (data) => {
    navigate("/user/explore-map");

  };


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

  return (
    <>
      {loader && <Loader />}

   
      <div className="max-w-sm overflow-hidden sm:max-w-full h-full relative sm:border-b-2">
        <Link
          to={`/user/book-experience/${product._id}`}
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
        <Link to={`/user/book-experience/${product?._id}`}>
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
              {`Mon-Fri ${fromto} to ${too} • ${utcOffset}`}
            </p>
        
          </div>
        </div>
      </div>
     
    </>
  );
};

export default ExperienceList;
