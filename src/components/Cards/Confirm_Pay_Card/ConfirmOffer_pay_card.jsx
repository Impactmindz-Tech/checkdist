import Images from "@/constant/Images";
const ConfirmOfferpaycard = ({ bookingDetails }) => {

  
   
 
    return (
      <div className="flex  gap-1 w-full BoxShadowLessRounded p-2 lg:flex-wrap lg:mb-5">
        <div className="sm:h-auto md:h-[130px] lg:h-[150px] sm:w-[30%] h-[180px] w-[20%]">
          <img src="" alt="" className="img-fluid" />
        </div>
        <div className="textRight pt-4 flex-1 px-4 sm:px-2 sm:py-0">
          <h1 className="font-bold text-grey-900 sm:text-base line-clamp-2">
            {bookingDetails?.data?.ExperienceName}{" "},
            {bookingDetails?.data?.Country}
          </h1>
          <div className="flex items-start gap-2 pt-2">
            <img
              src={Images.location2}
              alt="location2"
              className="rounded-full sm:w-[14px] mt-[4px]"
            />
            <p className="sm:text-xs">
              
              {bookingDetails?.data?.City},
              {bookingDetails?.data?.State}
            </p>
          </div>
  
          <div className="flex items-center gap-1 pt-1">
            {/* <div className="img">
              <img src={Images.star} alt="star" />
            </div> */}
            {/* <div className="text text-grey-800 py-2">
              <h2 className="text-sm">
                {bookingDetails?.data?.packageInfo?.rating} (20)
              </h2>
            </div> */}
          </div>
        </div>
      </div>
    );
  };
  export default ConfirmOfferpaycard;
