import HeaderBack from "@/components/HeaderBack";
import Images from "@/constant/Images";
import { editProfileValidation } from "@/utills/formvalidation/FormValidation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editProfileApi } from "@/utills/service/userSideService/editProfileService/EditProfileService";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@/utills/LocalStorageUtills";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const EditProfileAvatar = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const location= useLocation();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(editProfileValidation) });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = async (formData) => {
    setLoader(true);
    const id = getLocalStorage("user")?._id;
    const form = new FormData();
    if (image) {
      form.append("file", image);
    }
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    try {
      const response = await editProfileApi(id, form);
      if (response?.isSuccess) {
        toast.success(response?.message);
        navigate("/avatar/profile");
        removeLocalStorage("user");
        setLocalStorage("user", response?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const user = getLocalStorage("user");
    if (user) {
      setValue("firstName", user?.firstName);
      setValue("lastName", user?.lastName);
      setValue("mobileNumber", user?.mobileNumber);
      setValue("city", user?.City);
      setValue("country", user?.Country);
      setValue("Bio",user?.about);
      setValue("userName",user?.userName);
      setPreview(user.profileimage || Images.imagePlaceholder);
      const formattedDob = user?.dob?.split("T")[0];
      setValue("dob", formattedDob);

      setValue("state", user.State);
    }
  }, [setValue]);
  return (
    <>
      {loader && <Loader />}
      <div className="container">
        <HeaderBack link={"/user/profile"} text={"Edit Profile"} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="m-auto my-2"
        >
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
          </div>
          <div>
          <div className="mb-4 w-full">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
                User Name
              </label>
              <input className="inputGrayColor" id="userName" type="text" placeholder="userName" {...register("userName")} />
              {errors.userName && <p className="text-red-500 sm:text-sm">{errors.userName.message}</p>}
            </div>
            <div className="mb-4 w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                className="inputGrayColor"
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First Name"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-500 sm:text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className="inputGrayColor"
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-500 sm:text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="Bio"
              >
                Bio
              </label>
              <input
                className="inputGrayColor"
                id="Bio"
                name="Bio"
                type="text"
                placeholder="Your Description"
                {...register("Bio")}
              />
              {errors.Bio && (
                <p className="text-red-500 sm:text-sm">
                  {errors.Bio.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="mobileNumber"
              >
                Mobile Number
              </label>
              <input
                className="inputGrayColor"
                id="mobileNumber"
                name="mobileNumber"
                type="text"
                placeholder="98765 43210"
                {...register("mobileNumber")}
              />
              {errors.mobileNumber && (
                <p className="text-red-500 sm:text-sm">
                  {errors.mobileNumber.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="dob"
              >
                Date of Birth
              </label>
              <input
                className="inputGrayColor"
                id="dob"
                name="dob"
                type="date"
                placeholder="DD/MM/YYYY"
                {...register("dob")}
              />
              {errors.dob && (
                <p className="text-red-500 sm:text-sm">{errors.dob.message}</p>
              )}
            </div>
            <div className="mb-4 w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="country"
              >
                Country
              </label>
              <input
                className="inputGrayColor"
                id="country"
                type="text"
                name="country"
                placeholder="Country"
                {...register("country")}
              />
              {errors.country && (
                <p className="text-red-500 sm:text-sm">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div className="mb-4 w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="city"
              >
                City
              </label>
              <input
                className="inputGrayColor"
                id="city"
                type="text"
                name="city"
                placeholder="City"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-red-500 sm:text-sm">{errors.city.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="font-bold w-full my-6 rounded-md bottom-1 m-auto left-0 right-0 p-2 cursor-pointer bg-backgroundFill-900 text-white text-center"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfileAvatar;
