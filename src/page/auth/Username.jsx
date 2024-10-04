import { usernameadd } from "@/utills/service/authService";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import { getLocalStorage, setLocalStorage } from "@/utills/LocalStorageUtills";
import Images from "@/constant/Images";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
const Username = () => {
  const [loader, setLoader] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [userName, setUserName] = useState(""); // Updated variable name
  const [errors, setErrors] = useState({}); // State to store validation errors
  const navigate = useNavigate();
  const params = useParams();

  const id = getLocalStorage("user")?._id;

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
      setErrors((prev) => ({ ...prev, image: "" })); // Clear image error on valid file
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!userName) {
      newErrors.userName = "Username is required.";
    }

    if (!image) {
      newErrors.image = "Profile image is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const addusername = async () => {
    if (!validate()) return; // Block submission if validation fails
  
    // Create a new FormData object
    const formData = new FormData();
    formData.append("userName", userName); // Append the username
    if (image) {
      formData.append("file", image); // Append the profile image
    }
  
    try {
      setLoader(true);
  
      // Send the FormData to the backend
      const response = await usernameadd(id, formData);

      if (response?.isSuccess) {
        // Update local storage with the new username
        const user = getLocalStorage("user");
        if (user) {
          user.userName = userName;
          user.profileimage=response?.data?.profileimage;
          //user.profileimage=response // Update user object
          setLocalStorage("user", user); // Set updated user object in localStorage
        }
        toast.success(response?.message);
  
        navigate(`/auth/address/${id}`);
      }
      if(response?.isSuccess===false){
        toast(response?.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };
  

  return (
    <>
      {loader && <Loader />}
      <div className="w-[50%] sm:w-[90%] mx-auto lg:max-w-full">
        <div className="py-1"></div>
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            <img
              src={preview || Images.imagePlaceholder}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-dotted border-white sm:w-[90px] sm:h-[90px]"
            />
            <input
              name="file"
              type="file"
              id="Profile"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            <div className="absolute bottom-0 right-0 rounded-full p-2 cameraBoxShadow bg-backgroundFill-900 sm:w-[28px] sm:h-[28px] sm:p-[7px]">
              <label htmlFor="Profile">
                <img
                  src={Images.whiteCamera}
                  alt="Camera"
                  className="cursor-pointer"
                />
              </label>
            </div>
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 my-3 gap-y-4 relative">
          <h1 className="text-textMainColor-900 font-medium text-center">
            Add Your UserName
          </h1>
          <div className="flex flex-col gap-y-1">
            <input
              type="text"
              name="userName"
              value={userName} // Updated to use correct state
              onChange={(e) => {
                setUserName(e.target.value);
                setErrors((prev) => ({ ...prev, userName: "" })); // Clear username error on input change
              }}
              id="userName"
              className="input"
              placeholder="Enter Your User Name"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
            )}
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
