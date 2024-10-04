import RecordItModal from "@/components/Modal/RecordItModal";
import OnlyBrandNameHeader from "@/components/UserHeader/OnlyBrandNameHeader";
import Images from "@/constant/Images";
import { useState } from "react";
import { Link } from "react-router-dom";

function CustomAlert() {
  const [InstantLiveModal, setInstantLiveModal] = useState(false);
  return (
    <div className="container h-[calc(100svh-80px)] md:h-[calc(100svh-170px)] pt-[40px] sm:h-[calc(100svh-120px)]">
      <div className="max-w-2xl m-auto h-[100%] flex flex-col justify-between">
        <div>
          {/* success */}
          <div className="main">
            <div className="flex justify-center items-center ">
              <img
                src={Images.paymentSuccess}
                alt="paymentSuccess"
                className="w-[150px] "
              />
            </div>
            <h1 className="text-center text-success pt-5">Request Approved!</h1>
            <p className="text-grey-800 text-center py-3">
              Your request has been successfully approved!
            </p>
          </div>
        </div>
        <Link
          to="/user/dashboard"
          className="block max-w-[400px] mx-auto w-full"
        >
          <button className="border border-primaryColor-900 bg-primaryColor-900 text-white font-semibold py-2 rounded w-full">
            Okay
          </button>
        </Link>
      </div>

      <RecordItModal
        InstantLiveModal={InstantLiveModal}
        setInstantLiveModal={setInstantLiveModal}
      />
    </div>
  );
}

export default CustomAlert;
