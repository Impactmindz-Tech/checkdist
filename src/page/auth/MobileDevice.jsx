import { useEffect, useState } from "react";
import DeviceCard from "@/components/DeviceCard";
import { allDevicesDetails } from "@/utills/service/avtarService/getDevicesServices";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addDevicesApi } from "@/utills/service/authService";
import { useParams } from "react-router-dom";
import { getLocalStorage } from "@/utills/LocalStorageUtills";

const MobileDevice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [glimble, setglimble] = useState(false);
  const [loader, setLoader] = useState(false);
  const [activeTab, setActiveTab] = useState("iphone");
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [iphoneData, setIphoneData] = useState([]);
  const [samsungData, setSamsungData] = useState([]);
  const [otherData, setOtherData] = useState([]);
  const [manually, setmanually] = useState("");
  const tabs = ["iphone", "android", "other"];
  const isgooglesignup = getLocalStorage("user")?.isgoogleSignup;
  const isapplesignup = getLocalStorage("user")?.isAppleSignup;
  const fetchDevicesData = async () => {
    setLoader(true);
    try {
      const res = await allDevicesDetails();
      if (res?.success) {
        const devices = res.data || [];

        const iphoneDevices = devices.filter(
          (device) => device.deviceType === "iphone"
        );
        const samsungDevices = devices.filter(
          (device) => device.deviceType === "android"
          
        );
        const OtherDevices = devices.filter(
          (device) => device.deviceType === "other"
        );

        setIphoneData(iphoneDevices);
        setSamsungData(samsungDevices);
        setOtherData(OtherDevices);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };
  const handleToggle = () => {
    setIsChecked((prev) => {
      const newState = !prev;
      // Print true or false when toggled
      setglimble(newState); // Send the updated state to backend
      return newState;
    });
  };
  useEffect(() => {
    fetchDevicesData();
  }, []);

  useEffect(() => {
    setSelectedDevice(null);
  }, [activeTab]);

  let data;
  if (activeTab === "iphone") {
    data = iphoneData;
  } else if (activeTab === "android") {
    data = samsungData;
  } else {
    data = otherData;
  }
  const addDevice = async () => {
    const deviceToSubmit = manually || selectedDevice;
    if (!deviceToSubmit) {
      toast.error("Please Select Device Name");
      return;
    }

    let payload = {
      id,
      device: deviceToSubmit,
      role: "avatar",
      glimble: glimble,
    };
    try {
      setLoader(true);
      let res = await addDevicesApi(payload);
      if (res?.isSuccess) {
        toast.success("Devices Added Successfully");
        if (isapplesignup || isgooglesignup) {
          navigate("/auth/username/" + id);
        } else {
          navigate("/auth/address/" + id);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {loader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader className="text-white text-3xl" />
        </div>
      )}
      <div className="max-w-[80%] h-[90vh] mx-auto lg:max-w-full relative">
        <h1 className="text-grey-700 font-medium text-md">
          Please select your device
        </h1>

        <div className="my-4">
          <div className="lg:overflow-x-auto lg:overflow-y-auto">
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-md w-[50%] font-medium border-b-2 ${
                    activeTab === tab
                      ? "border-primaryColor-900 text-primaryColor-900 font-bold"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2 overflow-y-auto max-h-[63vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {activeTab === "other" ? (
                <>
                  <label htmlFor="username" className="label">
                    Type Your Device Name
                  </label>
                  <br />
                  <input
                    className="input mt-3"
                    value={selectedDevice}
                    type="text"
                    placeholder="Iphone 7"
                    name="Device"
                    id="username"
                    onChange={(e) => setmanually(e.target.value)}
                    disabled={selectedDevice}
                  />
                </>
              ) : (
                data.map((item) => (
                  <DeviceCard
                    name={item.model}
                    key={item._id}
                    isSelected={selectedDevice === item.model}
                    onSelect={() => setSelectedDevice(item.model)}
                  />
                ))
              )}
              {/* {data.map((item) => (
                <DeviceCard
                  name={item.model}
                  key={item._id}
                  isSelected={selectedDevice === item.model}
                  onSelect={() => setSelectedDevice(item.model)}
                />
              ))} */}
            </div>
          </div>
        </div>

        {/* <div>
          <p className="text-center">Or</p>
          <label htmlFor="username" className="label">
            Manually Enter Device Name
          </label>
          <br />
          <input
            className="input mt-3"
            value={selectedDevice}
            type="text"
            placeholder="Enter Your Device Name "
            name="Device"
            id="username"
            onChange={(e) => setmanually(e.target.value)}
            disabled={selectedDevice}
          />
        </div> */}

        <div className="py-2 w-full mt-3 mb-4">
          <label htmlFor="notesForUser" className="font-semibold flex">
            Do you have glimble?
            <input
              type="checkbox"
              id="notesForUser"
              className="hidden"
              checked={isChecked}
              onChange={handleToggle}
            />
            <span
              className={`relative inline-block w-10 h-6 transition-colors duration-300 ease-in-out rounded-full ml-4 ${
                isChecked ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute left-1 top-1 bg-white w-4 h-4 cursor-pointer rounded-full transition-transform duration-300 ease-in-out ${
                  isChecked ? "translate-x-4" : ""
                }`}
              ></span>
            </span>
          </label>
        </div>
        <div
          className="btn min-w-full bg-black py-3 text-white text-center rounded-sm cursor-pointer mt-3"
          onClick={() => addDevice()}
        >
          Next
        </div>
      </div>
    </>
  );
};

export default MobileDevice;
