import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tab, Tabs } from "@mui/material";
import MapComponent from "@/components/MapComponent";
import Images from "@/constant/Images";
import UserTopSearch from "@/components/UserTopSearch/UserTopSearch";
import { getalltourlocation, getLiveTourApi } from "@/utills/service/userSideService/TourService";
import MobileNavigation from "@/components/mobile_navigation/MobileNavigation";
import HeaderBack from "@/components/HeaderBack";
import { getmeetdata } from "@/utills/service/userSideService/userService/UserHomeService";
import AllTourMap from "@/components/AllTourMap";
const Allmap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  

  // Fetch live tour data based on the selected tab
  const getLiveTour = async () => {
    try {
      const response = await getalltourlocation();
      
    
    
      if (response?.isSuccess) {
        setTour(response);
      } else {
        setTour(null); // Handle case where API call was unsuccessful
      }
    } catch (error) {
      console.log(error);
      setTour(null); // Handle API error
    }
  };

useEffect(()=>{
  getLiveTour()
},[])

  return (
    <>
      <div className="pl-4 flex items-center justify-between md:pl-0 sm:px-4">
        <Link
          to="/user/dashboard"
          className="text-[24px] font-semibold md:hidden"
        >
          AvatarWalk
        </Link>
        <div className="w-[calc(100%-200px)] md:w-full">
          <UserTopSearch />
        </div>
      </div>

      {/* Tabs component */}
     

      {/* Map component with dynamic tour data */}
      <div className="h-[calc(100svh-138px)] md:h-[calc(100svh-217px)] sm:h-[calc(100svh-0px)] relative z-10">
        <AllTourMap selectPosition={tour?.data} />
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation role="user" />
    </>
  );
};

export default Allmap;
