import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Images from "@/constant/Images";
function SwiperSlider({ item, setheight, thumnail }) {
  const slides = [thumnail, ...item];
  return (
    <Swiper pagination={true} modules={[Pagination]} className="mySwiper z-10">
      {slides?.map((src, index) => {
        console.log(src);
        return (
          <SwiperSlide key={index}>
            <img
              className={`aspect-video object-cover m-auto w-full rounded-t-lg`}
              src={src || Images.imagePlaceholder}
              alt="slider_img"
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}

export default SwiperSlider;
