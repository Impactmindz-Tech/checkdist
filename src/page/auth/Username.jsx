import { usernameadd } from "@/utills/service/authService";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { getLocalStorage, setLocalStorage } from "@/utills/LocalStorageUtills";

const Username = () => {
  const [loader, setLoader] = useState(false);
  const [userName, setUserName] = useState(""); // Updated variable name
  const navigate = useNavigate();
  const params = useParams();

  const id = getLocalStorage("user")?._id;

  const addusername = async () => {
    if (!userName) {
      toast.error("Username is required");
      return;
    }

    const data = {
      userName, // Updated key to reflect the proper field
    };

    try {
      setLoader(true);

      const response = await usernameadd(id, data);

      if (response?.isSuccess) {
        // Update local storage with the new username
        const user = getLocalStorage("user");
        if (user) {
          user.userName = userName; // Update user object
          setLocalStorage("user", user); // Set updated user object in localStorage
        }

        toast.success(response?.message);
        navigate(`/auth/address/${id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update username");
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <div className="w-[50%] sm:w-[90%] mx-auto lg:max-w-full">
        <div className="py-1"></div>
        <div className="flex flex-col gap-2 my-3 gap-y-4 relative">
          <h1 className="text-textMainColor-900 font-medium text-center">
            Add Your UserName
          </h1>
          <div className="flex flex-col gap-y-1">
            <input
              type="text"
              name="userName"
              value={userName} // Updated to use correct state
              onChange={(e) => setUserName(e.target.value)} // Updated handler
              id="userName"
              className="input"
              placeholder="Enter Your User Name"
            />
          </div>

          <div onClick={addusername}>
            <button className="cursor-pointer w-full bg-primaryColor-900 p-4 text-center text-white mt-2 rounded-xl">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Username;
