import { convertTo12HourFormats } from "@/constant/date-time-format/DateTimeFormat";
import Images from "@/constant/Images";
import { Link } from "react-router-dom";


export default function UserAvatarTourCard({ tour,avatardetail }) {
  let userdetails = localStorage.getItem('user');

  const formattedAvgRating = tour.avgRating ? tour.avgRating.toFixed(2) : "N/A";

  const from = avatardetail?.Availability?.from;
  const to= avatardetail?.Availability?.to;
  const timezone = avatardetail?.Availability?.timeZone
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
    { userdetails?(  <Link to={`/user/book-experience/${tour?._id}`}>
      <div className="">

        <div className="images w-full">
          <img
            src={tour.thumbnail || Images.cardImageRounded}
            alt={`${tour.name} image`}
            className="w-full rounded-md aspect-[1.4] object-cover"
          />
        </div>
        <div className="flex items-start justify-between my-2 ">
          <div className="left">
            <h1 className="sm:text-sm">{tour?.ExperienceName}</h1>
            <p className="text-[#ababab]">{tour?.country}</p>
          </div>
        

          <div className="flex gap-2 items-center mt-[2px] sm:mt-0">
            <img
              src={Images.star2}
              alt="star"
              className="w-[20px] sm:w-[14px]"
            />
            <h1 className="text-lg sm:text-sm">{formattedAvgRating}</h1>
          </div>
          
        </div>  
        <div className="flex  items-center justify-between">
            <p className="text-gray-700 text-base w-[100%] lg:w-[100%] sm:text-[14px] font-medium">
              {`${fromto} to ${too} • ${utcOffset}`}
            </p>
        
          </div>
      </div>
    </Link>):(  <Link to={`/book-experience/${tour?._id}`}>
      <div className="">
        <div className="images w-full">
          <img
            src={tour.thumbnail || Images.cardImageRounded}
            alt={`${tour.name} image`}
            className="w-full rounded-md aspect-[1.4] object-cover"
          />
        </div>
        <div className="flex items-start justify-between my-2">
          <div className="left">
            <h1 className="sm:text-sm">{tour?.ExperienceName}</h1>
            <p className="text-[#ababab]">{tour?.country}</p>
          </div>

          <div className="flex gap-2 items-center mt-[2px] sm:mt-0">
            <img
              src={Images.star2}
              alt="star"
              className="w-[20px] sm:w-[14px]"
            />
            <h1 className="text-lg sm:text-sm">{formattedAvgRating}</h1>
          </div>
          
        </div>
        <div className="flex  items-center justify-between">
            <p className="text-gray-700 text-base w-[100%] lg:w-[100%] sm:text-[14px] font-medium">
              {`${fromto} to ${too} • ${utcOffset}`}
            </p>
        
          </div>
      </div>
    </Link>)}
    
    
    </>
  
  );
}
