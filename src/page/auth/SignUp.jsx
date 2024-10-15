import React from "react";
import Images from "../../constant/Images";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "../../constant/Images";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registrationValidation } from "@/utills/formvalidation/FormValidation";
import {
  googlesignupandsigninApi,
  loginApi,
  registrationApi,
} from "@/utills/service/authService";
import { auth } from "../../FirebaseConfig/config.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { setLocalStorage } from "@/utills/LocalStorageUtills";
import toast from "react-hot-toast";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Loader from "@/components/Loader";

const SignUp = () => {
  const provider = new GoogleAuthProvider();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registrationValidation) });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = async (formData) => {
    try {
      setLoader(true); // Show loader during API call
      const form = new FormData(); // Create FormData object

      // Append image if it exists
      if (image) {
        form.append("file", image);
      }

      // Append all form data fields
      for (const key in formData) {
        form.append(key, formData[key]);
      }

      // Make the API call to submit form data
      const response = await registrationApi(form);

      if (response?.isSucces) {
        toast.success(response?.message); // Success toast message
        setLocalStorage("user", response?.data); // Store user in local storage
        // setLocalStorage("token", response?.token);
        navigate("/auth/role/" + response?.data?._id); // Redirect to role page
      }
    } catch (error) {
      console.log(error); // Log any error during the API call
    } finally {
      setLoader(false); // Hide loader after API call completes
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoogleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const body = {
        userName: user.displayName,
        email: user.email,
        profileImage: user.photoURL,
        uid: user.uid,
        isgoogleSignup: true,
      };
      if (user) {
        const response = await googlesignupandsigninApi(body);
        if (response?.isSuccess) {
          if (response?.data?.action == "registration") {
            toast.success(response?.message);
            setLocalStorage("user", response?.data);
            // setLocalStorage("token", response?.token);
            navigate("/auth/role/" + response?.data?._id);
          } else {
            if (response?.isSuccess && response?.data?.length > 1) {
              setLocalStorage("userDetails", response);
              navigate("/auth/role/" + response?.data[0].userId, {
                state: { body },
              });
            } else {
              setLocalStorage("user", response?.data);
              // setLocalStorage("token", response?.token);
              navigate("/user/dashboard");
            }
          }
        }
      }
    } catch (error) {
      console.error("Google Signup Error:", error);
      toast.error("Google Signup failed. Please try again.");
    } finally {
      setLoader(false);
    }
  };



  return (
    <>
      {loader && <Loader />}
      <div className="max-w-[60%] mx-auto lg:max-w-full">
        <Link to="/">
          {" "}
          <h1>AvatarWalk</h1>
        </Link>
        <form className="pt-10" onSubmit={handleSubmit(onSubmit)}>
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
              <p className="text-[red] sm:text-sm">{errors?.file?.message}</p>
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
            <label htmlFor="userName" className="label">
              Username
            </label>
            <br />
            <input
              className="input"
              type="text"
              placeholder="Eg. Rohan Sharma"
              name="userName"
              id="userName"
              {...register("userName")}
            />
          </div>
          <p className="text-[red] sm:text-sm">{errors?.userName?.message}</p>
          <div className="pt-4">
            <label htmlFor="email" className="label">
              Email
            </label>
            <br />
            <input
              className="input"
              type="text"
              placeholder="Eg. rohansharma@gmail.com"
              name="email"
              id="email"
              {...register("email")}
            />
          </div>
          <p className="text-[red] sm:text-sm">{errors?.email?.message}</p>
          <div className="pt-4">
            <label htmlFor="password" className="label">
              Password
            </label>
            <br />
            <div className="input flex">
              <input
                className="w-full outline-none"
                type={!showPassword ? "password" : "text"}
                placeholder="Eg. Ro12******"
                name="password"
                id="password"
                {...register("password")}
              />
              {showPassword && (
                <VisibilityOutlinedIcon
                  onClick={handleShowPassword}
                  className="cursor-pointer text-gray-400"
                />
              )}
              {!showPassword && (
                <VisibilityOffOutlinedIcon
                  onClick={handleShowPassword}
                  className="cursor-pointer text-gray-400"
                />
              )}
            </div>
          </div>
          <p className="text-[red] sm:text-sm">{errors?.password?.message}</p>
          <div className="pt-4">
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <br />
            <div className="input flex">
              <input
                className="w-full outline-none"
                type={!showConfirmPassword ? "password" : "text"}
                placeholder="Eg. **********"
                name="confirmPassword"
                id="confirmPassword"
                {...register("confirmPassword")}
              />
              {showConfirmPassword && (
                <VisibilityOutlinedIcon
                  onClick={handleShowConfirmPassword}
                  className="cursor-pointer text-gray-400"
                />
              )}
              {!showConfirmPassword && (
                <VisibilityOffOutlinedIcon
                  onClick={handleShowConfirmPassword}
                  className="cursor-pointer text-gray-400"
                />
              )}
            </div>
          </div>
          <p className="text-[red] sm:text-sm">
            {errors?.confirmPassword?.message}
          </p>
          <div className="flex items-start space-x-2 pt-2">
            <div className="custom-check relative top-[5px]">
              <input
                type="checkbox"
                name="terms"
                id="terms"
                {...register("terms")}
              />
              <div></div>
            </div>
            <Label htmlFor="terms" className="leading-normal text-gray-400">
              By Signing up, You Agree to our{" "}
              <Link to="/privacy">
                <span className="font-semibold text-gray-900">
                  Privacy Policy
                </span>{" "}
              </Link>
              and{" "}
              <Link to="/term">
                <span className="font-semibold text-gray-900">
                  Terms of Services.
                </span>
              </Link>
            </Label>
          </div>
          <p className="text-[red] sm:text-sm">{errors?.terms?.message}</p>
          <button className="font-bold block cursor-pointer w-full bg-primaryColor-900 p-4 text-center text-white mt-8 rounded-xl">
            Sign Up
          </button>
          <div className="flex flex-col gap-3 pt-2">
            <p className="text-center text-gray-400">Or</p>
            <div
              className="flex items-center justify-center gap-3 cursor-pointer w-full bg-grey-300 p-4 text-center text-bg-primaryColor-900 rounded-xl"
              onClick={handleGoogleSignup}
            >
              <img className="w-5 h-5" src={Image.google_img} alt="" />
              <button className="font-semibold text-primaryColor-500">
                Continue with Google
              </button>
            </div>
            <div className="pt-5 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  to={"/auth/login"}
                  className="font-semibold text-gray-900"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
