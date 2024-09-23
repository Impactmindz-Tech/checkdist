import { useCallback, useEffect, useRef, useState } from "react";
import Images from "@/constant/Images";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "@/utills/LocalStorageUtills";
import HeaderNavigation from "../HeaderNavigation";
import { switchProfile } from "@/utills/service/switchRole/RoleSwitch";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { getAllcountryApi } from "@/utills/service/userSideService/userService/UserHomeService";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { initClient, createGoogleMeet } from "../../meetConfig/googleCalender";
import moment from "moment";
import { googlesignupandsigninApis } from "@/utills/service/getRole";
import { useDispatch, useSelector } from "react-redux";
import { setCountryChanged } from "@/store/CountryChangedSlice";
import { useGeolocated } from "react-geolocated";
function Header() {
  const [current, setCurrentClick] = useState(false);

  const isCountryChanged = useSelector((state) => state.countrychanged);
  const dispatch = useDispatch();
  const [currentLocation, setCurrentLocation] = useState(
    getLocalStorage("selectedCountry") || "India"
  );
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Location dropdown state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null); // Ref to track clicks outside dropdown
  const [country, setCountry] = useState([]);
  const suggestions = country;
  const [loader, setLoader] = useState(false);

  // const [userCountry, setUserCountry] = useState("India");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countrys, setCountrys] = useState([]);
  const [role, setRole] = useState(
    getLocalStorage("user") ? getLocalStorage("user") : "India"
  );
  const [selectedCountry, setSelectedCountry] = useState(
    getLocalStorage("selectedCountry") || getLocalStorage("user")?.Country
  );
  // const location = useLocation();
  const [meetLink, setMeetLink] = useState("");
  const [eventId, setEventId] = useState("");
  const [roless, setRoles] = useState(null);
  const [duration, setDuration] = useState(30);
  // const pathname = location?.pathname;
  // const navigate = useNavigate();

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location?.pathname;
  useEffect(() => {
    const storedCountry =
      getLocalStorage("selectedCountry")?.Country || "India";
    setUserCountry(storedCountry);
    setSelectedCountry(
      getLocalStorage("selectedCountry") ||
        getLocalStorage("user")?.Country ||
        storedCountry
    );

    initClient(updateSignInStatus);
    mainhead();
  }, []);

  const mainhead = async () => {
    try {
      const res = await googlesignupandsigninApis();
      if (res?.isSuccess) {
        setRoles(res);
        setLocalStorage("profileSize", res?.roles);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateSignInStatus = (isSignedIn) => {
    setIsSignedIn(isSignedIn);
  };

  const roleSwitch = useCallback(async () => {
    const newRole = role?.Activeprofile === "user" ? "avatar" : "user";
    if (role === newRole) return;

    setLoading(true);
    try {
      const response = await switchProfile(newRole);
      if (response?.isSuccess) {
        setLocalStorage("user", response?.data);
        setLocalStorage("token", response?.token);
        setRole(newRole);
        toast.success(response?.message);

        const targetPath =
          newRole === "user" ? "/user/dashboard" : "/avatar/dashboard";
        navigate(targetPath, { replace: true });
      }
    } catch (error) {
      toast.error("Role switching failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [role, navigate]);

  // const getAllcountry = async () => {
  //   if (pathname === "/user/dashboard") {
  //     try {
  //       const response = await getAllcountryApi({ country: selectedCountry });
  //       if (response?.isSuccess) {
  //         setCountrys(response?.data);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  useEffect(() => {
    getAllcountry();
  }, [pathname, selectedCountry]);

  const handleCountryChange = useCallback(
    (e) => {
      const selected = e.target.value;
      setSelectedCountry(selected);
      setUserCountry(selected);
      setLocalStorage("selectedCountry", selected);
      window.dispatchEvent(new Event("storage"));
    },
    [pathname]
  );

  const handleLiveButtonClick = async () => {
    navigate("/user/explore-map");
    // if (!isSignedIn) {
    //   try {
    //     await handleAuthClick();
    //   } catch (error) {
    //     if (error.error === "popup_closed_by_user") {
    //       toast.error("Authentication popup was closed before completing. Please try again.");
    //     } else {
    //       toast.error("An error occurred during authentication. Please try again.");
    //       console.error("Authentication error:", error);
    //     }
    //     return;
    //   }
    // }

    // const endTime = moment(startTime).add(duration, "minutes").format("YYYY-MM-DDTHH:mm:ss");
    // try {
    //   const response = await createGoogleMeet("Live Event", "Description of the event", startTime, endTime);
    //   const meetLink = response.result.hangoutLink;
    //   const eventId = response.result.id;
    //   setMeetLink(meetLink);
    //   setEventId(eventId);
    //   toast.success("Google Meet created successfully!");
    //   openMeetWindow(meetLink, duration);
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Failed to create Google Meet.");
    // }
  };

  const openMeetWindow = (meetLink, duration) => {
    const meetWindow = window.open(meetLink, "_blank");
    setTimeout(() => {
      meetWindow.close();
    }, duration * 60000);
  };

  // new location code
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
      setLoader(true);
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
    getLocalStorage("selectedCountry") || "India"
  );

  useEffect(() => {
    getAllcountry(userCountry);
  }, [pathname, userCountry, setUserCountry]);
  const handleCountry = (country) => {
    getAllcountry(country);
    setLocalStorage("selectedCountry", country);
    setUserCountry(country);
    setCurrentLocation(country);
    setDropdownOpen(false);
  };
  return (
    <>
      <section></section>
      {loading && <Loader />}
      <header className="flex justify-between items-center p-3">
        {location.pathname === "/user/dashboard" ? (
          <div className="p-4 z-50 sm:p-1 ">
            <div className="flex items-center space-x-4 ">
              <div className="relative sm:w-[100px]" ref={dropdownRef}>
                <button
                  onClick={handleLocationClick}
                  className="flex items-center space-x-2 px-1 py-2 sm:py-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none w-full "
                >
                  <span className="text-grey-900 leading-none">
                    <LocationOnIcon fontSize="small" className="sm:!w-[14px]" />
                  </span>
                  <span className="text-grey-900 text-left flex-1 overflow-hidden text-ellipsis sm:text-xs">
                    {currentLocation}
                  </span>
                  <svg
                    className={`  sm:top-4 sm:right-4 w-4 h-4 sm:w-[10px] transition-transform  ${
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
                  <div className="absolute mt-0 bg-white shadow-lg border border-gray-200 rounded-lg sm:mt-0 w-[20vw] xl:w-[30vw] lg:w-[40vw] md:w-[60vw] sm:w-[90vw]">
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
                    <div className="relative p-2 sm:p-1 ">
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
        ) : null}

        <div className="brand">
          <Link to="/">
            <img src={Images.AvatarWalk} alt="AvatarWalk" />
          </Link>
        </div>
        <div className="cursor-pointer flex gap-4 items-center">
          {roless?.roles === 2 && (
            <button
              className="bg-[#ff5454] flex-1 py-[7px] text-white rounded-lg px-4 sm:hidden"
              onClick={roleSwitch}
            >
              {role?.Activeprofile === "user"
                ? "Switch to Avatar"
                : "Switch to User"}
            </button>
          )}
          <button
            className="bg-[#ff5454] py-[7px] text-white rounded-lg px-4 sm:hidden flex items-center gap-[5px]"
            onClick={handleLiveButtonClick}
          >
            <img src={Images.iconRadar} alt="" />
            Public Live
          </button>

          <HeaderNavigation />
        </div>
      </header>
    </>
  );
}

export default Header;
