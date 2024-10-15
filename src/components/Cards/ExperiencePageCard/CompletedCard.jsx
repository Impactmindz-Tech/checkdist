import {
  formatDate,
  formatTime,
} from "@/constant/date-time-format/DateTimeFormat";
import Images from "@/constant/Images";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import { getrating } from "@/utills/service/experienceService/ExperienceService";
import { useEffect, useState } from "react";

const CompletedCard = ({ item }) => {
  let navigate = useNavigate();

  const location = useLocation();
  const[ratings,Ratingdone] = useState(false);
const getratings = async()=>{
   try{
   let response = await getrating(item?.expId);
   console.log(response);
   if(response.data){
    Ratingdone(true);
   }
   else{
    Ratingdone(false);
   }
   }catch(err){}
}

const handleone = ()=>{
  navigate(`/user/rate-tour/${item?.expId}`,{ state: {res: item }});
}
useEffect(()=>{
  getratings();
},[])




  return (
    <div className="p-4 sm:p-0 sm:mt-2">
      <div className="BoxShadowLessRounded pb-2">
        <div className="flex gap-4 p-4 sm:gap-0 sm:flex-wrap sm:p-2">
          <div className="w-[30%] ">
            <img
              src={item?.experienceImage}
              alt="cardImageRounded"
              className="w-full object-cover h-full rounded-lg aspect-square"
            />
          </div>
          <div className="w-[70%] sm:pl-3">
            <div className="flex justify-between">
              <div className="text-[#2AA174] bg-[#eaf6f2] pt-[4px] pb-[5px] px-[10px] rounded-full text-xs font-medium">
                {item?.status}
              </div>
            </div>
            <h2 className="text-lg font-bold pt-3 sm:text-sm sm:pt-1 line-clamp-2">
              {item?.experienceName}, {item?.country}
            </h2>
            <div className="description flex gap-2 items-center sm:flex-wrap sm:gap-1">
              <p className="text-xs text-black sm:mt-1 leading-none">
                {formatDate(item?.bookingDate)}
              </p>
              <li className="text-grey-800 leading-none">
                <span className="text-black text-xs leading-none">
                  {formatTime(item?.bookingTime)} - {formatTime(item?.endTime)}
                </span>
              </li>
            </div>
          </div>
        </div>
        <div className="borderTopBottom flex justify-between m-auto w-[94%] py-2 text-grey-800 sm:w-full sm:px-2">
          <div className="author  ">
            <b>Avatar</b>: {item?.avatarName}
          </div>
          <div className="font-bold">
            {getCurrencySymbol()}
            {item?.totalPrice.toFixed(2)}
          </div>
        </div>

        {/* two button */}
        <div className="my-3 w-[94%]  m-auto sm:w-full sm:px-2 sm:mb-0 sm:mt-2">
          {/* clock timer btn */}
          {location.pathname === "/user/experience" && (
            
<button onClick={handleone}
  disabled={ratings}
  className={`${
    ratings ? 'bg-[#eaf6f2] text-[#2AA174]' : 'bg-backgroundFill-900 text-white'
  } flex justify-center items-center py-3 gap-2 rounded w-full mt-3 lg:w-[100%]`}
>
  {ratings ? 'Your feedback is appreciated!' : 'Rate Tour'}
</button>


       
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedCard;
