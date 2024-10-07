import Images from "@/constant/Images";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@/utills/LocalStorageUtills";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { switchProfile } from "@/utills/service/switchRole/RoleSwitch";

const HeaderNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(
    getLocalStorage("user") ? getLocalStorage("user")?.Activeprofile : null
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const roleSwitch = async () => {
    const newRole = role === "user" ? "avatar" : "user";
    try {
      const response = await switchProfile(newRole);
     
      if (response?.isSuccess) {
        removeLocalStorage("user");
        setLocalStorage("user", response?.data);
       setLocalStorage("token",response?.token);

    
       
          navigate(newRole === "user" ? "/user/dashboard" : "/avatar/dashboard", { replace: true });
         
  
        toast.success(response?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {loading && <Loader />}

      <Sheet>
        <SheetTrigger asChild>
          <img
            className="w-8 sm:w-6 cursor-pointer"
            src={Images.hamburger_img}
            alt=""
          />
        </SheetTrigger>

        <SheetContent side="left">
          <SheetTitle as="h2" className="sr-only">
            Navigation Menu
          </SheetTitle>
          <div className="pt-[100px] pb-4">
            {role === "user" ? (
              <>
                <div className="my-2">
                  <Link to="/user/dashboard" className="block">
                    <SheetTrigger className="w-full">
                      <button
                        className={`py-3 px-10 pl-[54px] w-full text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px] ${
                          isActive("/user/dashboard")
                            ? "bg-gradient-to-r from-[#000000]/[0.13] to-[transparent] text-[#2d2d2d] before:bg-[#2d2d2d]/[1]"
                            : "bg-[#ffffff] text-[#ababab]"
                        }`}
                      >
                        <img
                          src={Images.navIconHome}
                          alt=""
                          className={`absolute w-[20px] left-[24px] top-[14px] ${
                            isActive("/user/dashboard")
                              ? "opacity-[1]"
                              : "opacity-[0.4]"
                          }`}
                        />
                        Home
                      </button>
                    </SheetTrigger>
                  </Link>
                </div>
                {/* <div className="my-2">
                  <SheetTrigger className="w-full">
                    <button className="py-3 px-10 w-full bg-[#2D2D2D] text-white">
                      Explore
                    </button>
                  </SheetTrigger>
                </div> */}
                <div className="my-2">
                  <Link to="/user/experience" className="block">
                    <SheetTrigger className="w-full">
                      <button
                        className={`py-3 px-10 pl-[54px] w-full text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px] ${
                          isActive("/user/experience")
                            ? "bg-gradient-to-r from-[#000000]/[0.13] to-[transparent] text-[#2d2d2d] before:bg-[#2d2d2d]/[1]"
                            : "bg-[#ffffff] text-[#ababab]"
                        }`}
                      >
                        <img
                          src={Images.navIconExperience}
                          alt=""
                          className={`absolute w-[20px] left-[24px] top-[14px] ${
                            isActive("/user/experience")
                              ? "opacity-[1]"
                              : "opacity-[0.4]"
                          }`}
                        />
                        Experience
                      </button>
                    </SheetTrigger>
                  </Link>
                </div>
                <div className="">
                  <Link to="/user/profile" className="block">
                    <SheetTrigger className="w-full">
                      <button
                        className={`py-3 px-10 pl-[54px] w-full text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px] ${
                          isActive("/user/profile")
                            ? "bg-gradient-to-r from-[#000000]/[0.13] to-[transparent] text-[#2d2d2d] before:bg-[#2d2d2d]/[1]"
                            : "bg-[#ffffff] text-[#ababab]"
                        }`}
                      >
                        <img
                          src={Images.navIconProfile}
                          alt=""
                          className={`absolute w-[20px] left-[24px] top-[14px] ${
                            isActive("/user/profile")
                              ? "opacity-[1]"
                              : "opacity-[0.4]"
                          }`}
                        />
                        Profile
                      </button>
                    </SheetTrigger>
                  </Link>
                </div>
                <div className="my-2">
                  <Link to="/user/offers" className="block">
                    <SheetTrigger className="w-full">
                      <button
                        className={`py-3 px-10 pl-[54px] w-full text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px] ${
                          isActive("/user/offers")
                            ? "bg-gradient-to-r from-[#000000]/[0.13] to-[transparent] text-[#2d2d2d] before:bg-[#2d2d2d]/[1]"
                            : "bg-[#ffffff] text-[#ababab]"
                        }`}
                      >
                        <img
                          src={Images.navIconOffer}
                          alt=""
                          className={`absolute w-[20px] left-[24px] top-[14px] ${
                            isActive("/user/offers")
                              ? "opacity-[1]"
                              : "opacity-[0.4]"
                          }`}
                        />
                        Offer
                      </button>
                    </SheetTrigger>
                  </Link>
                </div>
                <div className="my-2 hidden sm:block">
                  <Link to="/avatar/dashboard" className="block ">
                    <button className="py-3 px-10 pl-[54px] w-full text-[#ababab] text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px]">
                      <button
                        className="flex-1 text-[#ababab]"
                        onClick={roleSwitch}
                      >
                        <img
                          src={Images.navIconProfileSwitch}
                          alt=""
                          className={`absolute w-[20px] left-[24px] top-[14px] ${
                            isActive("/avatar/dashboard")
                              ? "opacity-[1]"
                              : "opacity-[0.4]"
                          }`}
                        />
                        {role === "user"
                          ? "Switch To Avatar"
                          : "Switch To User"}
                      </button>
                    </button>
                  </Link>
                </div>
                <div className="my-2 hidden sm:block">
                  <Link to="/user/explore-map" className="block ">
                    <button className="py-3 px-10 pl-[54px] w-full text-[#ababab] text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px]">
                      <img
                        src={Images.navIconLiveStream}
                        alt=""
                        className={`absolute w-[20px] left-[24px] top-[14px] ${
                          isActive("/user/explore-map")
                            ? "opacity-[1]"
                            : "opacity-[0.4]"
                        }`}
                      />
                      Live Stream
                    </button>
                  </Link>
                </div>
                <div className="my-2">
                  <Link to="/user/chat" className="block">
                    <SheetTrigger className="w-full">
                      <button
                        className={`py-3 px-10 pl-[54px] w-full text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px] ${
                          isActive("/user/chat")
                            ? "bg-gradient-to-r from-[#000000]/[0.13] to-[transparent] text-[#2d2d2d] before:bg-[#2d2d2d]/[1]"
                            : "bg-[#ffffff] text-[#ababab]"
                        }`}
                      >
                        <img
                          src={Images.navIconChat}
                          alt=""
                          className={`absolute w-[20px] left-[24px] top-[14px] ${
                            isActive("/user/chat")
                              ? "opacity-[1]"
                              : "opacity-[0.4]"
                          }`}
                        />
                        Chats
                      </button>
                    </SheetTrigger>
                  </Link>
                </div>
                <div className="my-2">
                  <SheetTrigger className="w-full" onClick={handleLogout}>
                    <button className="py-3 px-10 pl-[54px] w-full text-[#FF7070] text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px]">
                      <img
                        src={Images.navIconLogout}
                        alt=""
                        className={`absolute w-[20px] max-h-[20px] left-[24px] top-[14px]`}
                      />
                      Log Out
                    </button>
                  </SheetTrigger>
                </div>
              </>
            ) : (
              <>
                <div className="my-2">
                  <Link to="/avatar/dashboard" className="block ">
                    <SheetTrigger className="w-full">
                      <button
                        className={`py-3 px-10 pl-[54px] w-full text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px] ${
                          isActive("/avatar/dashboard")
                            ? "bg-gradient-to-r from-[#000000]/[0.13] to-[transparent] text-[#2d2d2d] before:bg-[#2d2d2d]/[1]"
                            : "bg-[#ffffff] text-[#ababab]"
                        }`}
                      >
                        <img
                          src={Images.navIconHome}
                          alt=""
                          className={`absolute w-[20px] left-[24px] top-[14px] ${
                            isActive("/avatar/dashboard")
                              ? "opacity-[1]"
                              : "opacity-[0.4]"
                          }`}
                        />
                        Home
                      </button>
                    </SheetTrigger>
                  </Link>
                </div>
                <div className="my-2">
                  <Link to="/avatar/chat" className="block ">
                    <SheetTrigger className="w-full">
                      <button
                        className={`py-3 px-10 pl-[54px] w-full text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px] ${
                          isActive("/avatar/chat")
                            ? "bg-gradient-to-r from-[#000000]/[0.13] to-[transparent] text-[#2d2d2d] before:bg-[#2d2d2d]/[1]"
                            : "bg-[#ffffff] text-[#ababab]"
                        }`}
                      >
                        <img
                          src={Images.navIconChat}
                          alt=""
                          className={`absolute w-[20px] left-[24px] top-[14px] ${
                            isActive("/avatar/chat")
                              ? "opacity-[1]"
                              : "opacity-[0.4]"
                          }`}
                        />
                        Chats
                      </button>
                    </SheetTrigger>
                  </Link>
                </div>
                <div className="my-2">
                  <Link to="/avatar/experience-list" className="block ">
                    <SheetTrigger className="w-full">
                      <button
                        className={`py-3 px-10 pl-[54px] w-full text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px] ${
                          isActive("/avatar/experience-list")
                            ? "bg-gradient-to-r from-[#000000]/[0.13] to-[transparent] text-[#2d2d2d] before:bg-[#2d2d2d]/[1]"
                            : "bg-[#ffffff] text-[#ababab]"
                        }`}
                      >
                        <img
                          src={Images.navIconExperience}
                          alt=""
                          className={`absolute w-[20px] left-[24px] top-[14px] ${
                            isActive("/avatar/experience-list")
                              ? "opacity-[1]"
                              : "opacity-[0.4]"
                          }`}
                        />
                        My Experience
                      </button>
                    </SheetTrigger>
                  </Link>
                </div>
                <div className="my-2">
                  <Link to="/avatar/experience" className="block ">
                    <SheetTrigger className="w-full">
                      <button
                        className={`py-3 px-10 pl-[54px] w-full text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px] ${
                          isActive("/avatar/experience")
                            ? "bg-gradient-to-r from-[#000000]/[0.13] to-[transparent] text-[#2d2d2d] before:bg-[#2d2d2d]/[1]"
                            : "bg-[#ffffff] text-[#ababab]"
                        }`}
                      >
                        <img
                          src={Images.navIconExperience}
                          alt=""
                          className={`absolute w-[20px] left-[24px] top-[14px] ${
                            isActive("/avatar/experience")
                              ? "opacity-[1]"
                              : "opacity-[0.4]"
                          }`}
                        />
                        Experience
                      </button>
                    </SheetTrigger>
                  </Link>
                </div>
                <div className="">
                  <Link to="/avatar/profile" className="block ">
                    <SheetTrigger className="w-full">
                      <button
                        className={`py-3 px-10 pl-[54px] w-full text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px] ${
                          isActive("/avatar/profile")
                            ? "bg-gradient-to-r from-[#000000]/[0.13] to-[transparent] text-[#2d2d2d] before:bg-[#2d2d2d]/[1]"
                            : "bg-[#ffffff] text-[#ababab]"
                        }`}
                      >
                        <img
                          src={Images.navIconProfile}
                          alt=""
                          className={`absolute w-[20px] left-[24px] top-[14px] ${
                            isActive("/avatar/profile")
                              ? "opacity-[1]"
                              : "opacity-[0.4]"
                          }`}
                        />
                        Profile
                      </button>
                    </SheetTrigger>
                  </Link>
                </div>
                <div className="my-2 hidden sm:block">
                  <Link to="/user/offers" className="block ">
                    <button
                      className={`py-3 px-10 pl-[54px] w-full text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px] ${
                        isActive("/user/offers")
                          ? "bg-gradient-to-r from-[#000000]/[0.13] to-[transparent] text-[#2d2d2d] before:bg-[#2d2d2d]/[1]"
                          : "bg-[#ffffff] text-[#ababab]"
                      }`}
                      onClick={roleSwitch}
                    >
                      <img
                        src={Images.navIconProfileSwitch}
                        alt=""
                        className={`absolute w-[20px] left-[24px] top-[14px] ${
                          isActive("/user/offers")
                            ? "opacity-[1]"
                            : "opacity-[0.4]"
                        }`}
                      />
                      {role === "user" ? "Switch Avatar" : "Switch User"}
                    </button>
                  </Link>
                </div>
                <div className="my-2 hidden sm:block">
                  <Link to="/user/offers" className="block ">
                    <button
                      className={`py-3 px-10 pl-[54px] w-full text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px] ${
                        isActive("/user/offers")
                          ? "bg-gradient-to-r from-[#000000]/[0.13] to-[transparent] text-[#2d2d2d] before:bg-[#2d2d2d]/[1]"
                          : "bg-[#ffffff] text-[#ababab]"
                      }`}
                    >
                      <img
                        src={Images.navIconLiveStream}
                        alt=""
                        className={`absolute w-[20px] left-[24px] top-[14px] ${
                          isActive("/user/offers")
                            ? "opacity-[1]"
                            : "opacity-[0.4]"
                        }`}
                      />
                      Live Stream
                    </button>
                  </Link>
                </div>
                <div className="my-2 " onClick={handleLogout}>
                  <button className="py-3 px-10 pl-[54px] w-full text-[#FF7070] text-left relative font-semibold before:content-[''] before:absolute before:w-[4px] before:h-[100%] before:bg-[#2d2d2d]/[0] before:top-[0px] before:left-[0px]">
                    <img
                      src={Images.navIconLogout}
                      alt=""
                      className={`absolute w-[20px] max-h-[20px] left-[24px] top-[14px]`}
                    />
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default HeaderNavigation;
