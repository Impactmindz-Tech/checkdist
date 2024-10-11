import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tab, Tabs } from "@mui/material";
import MapComponent from "@/components/MapComponent";
import Images from "@/constant/Images";
import UserTopSearch from "@/components/UserTopSearch/UserTopSearch";
import { getLiveTourApi } from "@/utills/service/userSideService/TourService";
import MobileNavigation from "@/components/mobile_navigation/MobileNavigation";
import HeaderBack from "@/components/HeaderBack";
import { getmeetdata } from "@/utills/service/userSideService/userService/UserHomeService";
const ExploreMap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  
  // Tabs data
  const tabLabels = [
    {
      name: "publiclive",
      image: Images.iconRadar,
    },
    {
      name: "tours",
      image: Images.toursIconLight,
    },
    {
      name: "mostpopular",
      image: Images.popularIconWhite,
    },
    {
      name: "below$5",
      image: Images.creditCardLight,
    },
  ];

  // Parse query parameters
  const query = new URLSearchParams(location.search);
  const tab = query.get("tab");

  // Calculate initial value based on the URL tab parameter
  const initialValue = tab ? tabLabels.findIndex(label => label.name === tab) : 0;
  const [value, setValue] = useState(initialValue);

  // Fetch live tour data based on the selected tab
  const getLiveTour = async (selectedTab) => {
    try {
      const response = await getLiveTourApi(selectedTab);
    
    
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

  // Sync the state with the query parameter
  useEffect(() => {
    getLiveTour(tabLabels[value].name);
  }, [value]);

  // Handle tab change and update URL
  const handleChange = (event, newValue) => {
    const selectedTab = tabLabels[newValue].name;
    setValue(newValue);

    // Navigate with the selected tab in the URL query parameter
    navigate({
      pathname: location.pathname,
      search: `?tab=${selectedTab}`,
    });
  };
  

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
      <Tabs
        variant="fullWidth"
        scrollButtons="auto"
        value={value}
        onChange={handleChange}
        aria-label="Explore Map Tabs"
        className="tabs-explore-map sm:px-4"
      >
        {tabLabels.map((label, index) => (
          <Tab
            key={index}
            icon={
              <img
                src={label.image}
                alt={label.name}
                style={{ filter: "invert(1)" }}
              />
            }
            label={label.name.replace("-", " ")}
          />
        ))}
      </Tabs>

      {/* Map component with dynamic tour data */}
      <div className="h-[calc(100svh-138px)] md:h-[calc(100svh-217px)] sm:h-[calc(100svh-192px)] relative z-10">
        <MapComponent selectPosition={tour?.data} payment={true} />
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation role="user" />
    </>
  );
};

export default ExploreMap;
