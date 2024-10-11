
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Images from "@/constant/Images";
import { getCurrencySymbol } from "@/constant/CurrencySign";

function SwiperSlider({
  item,
  setheight,
  thumnail,
  price,
  
  avrrating
,
  hideExtraDetails,
}) {
  const slides = [thumnail, ...item];


const averageRating =  avrrating;


  return (
    <Swiper pagination={true} modules={[Pagination]} className="mySwiper z-10 ">
      {slides?.map((src, index) => {
        return (
          <SwiperSlide key={index}>
            <img
              className={`aspect-video object-cover m-auto w-full rounded-lg`}
              src={src || Images.imagePlaceholder}
              alt="slider_img"
            />
          </SwiperSlide>
        );
      })}
      {!hideExtraDetails && (
        <div className="absolute top-auto bottom-3 left-auto right-3 z-[1] flex gap-2">
          <span className="bg-[white] px-2 pt-[4px] pb-[6px] rounded-full leading-none text-sm text-slate-500 sm:text-[12px]">
            <b className="text-[black]">
              {getCurrencySymbol()}
              {price}
            </b>
            /per min
          </span>
          <span className="bg-[white] px-2 pt-[4px] pb-[6px] rounded-full leading-none text-sm font-bold inline-flex items-center gap-2 sm:text-[12px]">
            <img
              src={Images.star2}
              alt="star"
              className="w-[16px] sm:w-[12px]"
            />
            {averageRating !== "NaN" && averageRating !== 0
              ? Number(averageRating).toFixed(1)
              : "No Ratings"}
          </span>
        </div>
      )}
    </Swiper>
  );
}

export default SwiperSlider;
