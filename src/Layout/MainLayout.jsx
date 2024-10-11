import MobileNavigation from "@/components/mobile_navigation/MobileNavigation";
import Images from "@/constant/Images";
import { getLocalStorage, setLocalStorage } from "@/utills/LocalStorageUtills";
import { useCallback, useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getAllcountryApi } from "@/utills/service/userSideService/userService/UserHomeService";
import toast from "react-hot-toast";
import { useGeolocated } from "react-geolocated";
import { useDispatch, useSelector } from "react-redux";
import { setCountryChanged } from "@/store/CountryChangedSlice";

const MainLayout = ({ children }) => {
  const isCountryChanged = useSelector((state) => state.countrychanged);
  const dispatch = useDispatch();
  const [current, setCurrentClick] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(
    getLocalStorage("selectedCountry") || "United States"
  );
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Location dropdown state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null); // Ref to track clicks outside dropdown
  const [country, setCountry] = useState([]);
  const suggestions = country;
  const [loader, setLoader] = useState(false);
  const getAllcountry = async (country) => {
    try {
      const response = await getAllcountryApi({ country: country });
      if (response?.isSuccess) {
        setCountry(response?.data);
        dispatch(setCountryChanged(!isCountryChanged.isCountryChanged));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleLocationClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const { coords, getPosition, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: { enableHighAccuracy: false },
      userDecisionTimeout: 5000,
      watchPosition: false,
      suppressLocationOnMount: true,
      onError: (error) => {
        setLoader(false);
        if (error.code === 1) {
          toast("Please allow location permissions in your browser.", {
            duration: 4000,
          });
        } else {
          toast("Error fetching location. Please try again.", {
            duration: 4000,
          });
        }
      },
    });

  const detectLocation = () => {
    setCurrentClick(true);
    if (!isGeolocationAvailable) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    if (!isGeolocationEnabled) {
      toast.error(
        "Geolocation is disabled. Please enable it in your browser settings."
      );
      return;
    }

    setLoader(true);
    getPosition();
  };

  const getLocationFromLatLong = async (lat, lng) => {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.address) {
        const locationName = data.address.country;
        setLocalStorage("selectedCountry", locationName);
        setCurrentLocation(locationName);
        dispatch(setCountryChanged(!isCountryChanged.isCountryChanged));
        toast.success(`Location detected: ${locationName}`);
      } else {
        toast.error("Error fetching location details.");
      }
    } catch (error) {
      console.error("Geocoding error: ", error);
      toast.error("Error fetching location details.");
    } finally {
      setLoader(false);
      setDropdownOpen(false); // Close the dropdown after location detection
    }
  };

  useEffect(() => {
    if (current) {
      if (coords && coords.latitude && coords.longitude) {
        getLocationFromLatLong(coords.latitude, coords.longitude);
      }
    }
  }, [coords]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const [userCountry, setUserCountry] = useState(
    getLocalStorage("selectedCountry") || "United States"
  );

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location?.pathname;

  useEffect(() => {
    getAllcountry(userCountry);
  }, [pathname, userCountry, setUserCountry]);

  useEffect(() => {
    const user = getLocalStorage("user");
    if (user) {
      const role = user.Activeprofile;
      navigate(role === "avatar" ? "/avatar/dashboard" : "/user/dashboard");
    }
  }, []);

  const handleCountry = (country) => {
    getAllcountry(country);
    setLocalStorage("selectedCountry", country);
    setUserCountry(country);
    setCurrentLocation(country);
    setDropdownOpen(false);
  };

  return (
    <div className="container px-4 sm:px-0 lg:max-w-full">
      <header className="flex justify-between px-4 items-center my-6">
        <div className="brand">
          <Link to="/">
            <img src={Images.AvatarWalk} alt="AvatarWalk" />
          </Link>
        </div>
        <div>
          <Link
            to="/auth/login"
            className="block bg-grey-900 py-3 px-4 text-white font-medium rounded-lg lg:py-2 lg:text-sm"
          >
            <button>Become an Avatar</button>
          </Link>
          
        </div>
        <div>
        <Link
            to="/auth/login"
            className="bg-grey-900 py-[7px] text-white rounded-lg px-4 sm:px-5"
          >
            <button className="items-center">
              <span className="">
                {/* <img src={Images.hotsport} alt="hosport" /> */}
              </span>
              Login
            </button>
          </Link>
        </div>
      </header>

      {pathname === "/" && (
        <div className="flex justify-between px-4 items-center my-6 lg:px-1 ">
          <div className="w-full p-4 z-50 sm:p-1">
            <div className="flex items-center space-x-4">
              <div className="relative sm:w-[150px] w-[45vw] " ref={dropdownRef}>
                <button
                  onClick={handleLocationClick}
                  className="flex items-center space-x-2 px-2 py-2  bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none sm:w-full"
                >
                  <span className="text-grey-900">
                    <LocationOnIcon />
                  </span>
                  <span className="text-grey-900 text-xs">{currentLocation}</span>
                  <svg
                    className={`sm:absolute sm:top-4 sm:right-4 w-4 h-4 transition-transform float-right ${
                      isDropdownOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown for Location + Search */}
                {isDropdownOpen && (
                  <div className="absolute mt-0 w-full bg-white shadow-lg border border-gray-200 rounded-lg sm:mt-0 sm:w-[60vw]">
                    {/* Detect current location option */}
                    {!showSuggestions && (
                      <button
                        onClick={detectLocation}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        <div>
                          <span className="text-grey-900">
                            <LocationOnIcon /> Use current location
                          </span>
                          <span className="block text-xs text-gray-500 pl-8">
                            Using GPS
                          </span>
                        </div>
                      </button>
                    )}

                    {/* Search Input */}
                    <div className="relative p-2 sm:p-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search country for experience"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-grey-800"
                      />

                      {/* Suggestions Dropdown */}
                      {showSuggestions && (
                        <div className="absolute top-full  -ml-2 w-full bg-white shadow-lg border border-gray-200 rounded-lg sm:mt-0 sm:-ml-1">
                          {suggestions
                            .filter((item) =>
                              item
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            )
                            .map((suggestion, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleCountry(suggestion)}
                              >
                                {suggestion}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Live Button */}
         
        </div>
      )}
      {children}
    </div>
  );
};

export default MainLayout;
