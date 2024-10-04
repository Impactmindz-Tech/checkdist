import { useEffect, useRef, useState } from "react";
import Loader from "../Loader";
import ConfirmPaymentForm from "@/components/Payment Card/Confirm_Page_Payment";
import { loadStripe } from "@stripe/stripe-js";
import { checkout, payaddon, paypalcheckout } from "@/utills/service/userSideService/userService/UserHomeService";
import { getLocalStorage } from "@/utills/LocalStorageUtills";
const AddMoreTime = ({ show, onClose ,meetId}) => {
  const [loader, setLoader] = useState(false);
  const [requestedTime, setRequestedTime] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("stripe");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };
let meetid = localStorage.getItem("meet")


  const handlecheckout = async () => {
    if (selectedMethod === "stripe") {
      const stripe = await loadStripe(import.meta.env.VITE_APP_STRIPEKEY);



      let body = {
        paymenttype:selectedMethod ,
        addmoretime:requestedTime,
        meetingId:meetId
     
      };
      try {
        setLoader(true);
        let senddata = await payaddon(body);
  
        const result = stripe.redirectToCheckout({
          sessionId: senddata.id,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoader(false);
      }
    } else {

      let body = {
        paymenttype:selectedMethod ,
        addmoretime:requestedTime,
        meetingId:meetId
      };
      try {
        setLoader(true);
        let res = await payaddon(body);
        
    
     
          let link = res.url;
          window.location.href = link;
        
      } catch (err) {
        console.log(err);
      } finally {
        setLoader(false);
      }
    }
  };



  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  if (!show) return null;

  return (
    <>
      {loader && <Loader />}
      <div className="fixed flex items-end justify-center inset-0 bg-black bg-opacity-50 z-[99]">
        <div
          ref={modalRef}
          className="bg-white rounded-t-2xl px-7 shadow-lg w-full max-w-4xl xl:max-w-2xl lg:max-w-full p-3"
        >
          <h3 className="text-2xl text-center mt-4 font-semibold mb-6 sm:text-xl">
            Want to add more time?
          </h3>

          <div className="mt-2 mb-6">
            <div className="mb-2">
              <h3 className="text-lg font-semibold mb-2 sm:text-base">
                Duration
              </h3>
              <div className="flex space-x-2">
                <button
                  className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                    requestedTime === 15 ? "bg-black text-white" : "bg-gray-200"
                  } rounded-md`}
                  onClick={() => setRequestedTime(15)}
                >
                  15 min
                </button>
                <button
                  className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                    requestedTime === 30 ? "bg-black text-white" : "bg-gray-200"
                  } rounded-md`}
                  onClick={() => setRequestedTime(30)}
                >
                  30 min
                </button>
                <button
                  className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                    requestedTime === 45 ? "bg-black text-white" : "bg-gray-200"
                  } rounded-md`}
                  onClick={() => setRequestedTime(45)}
                >
                  45 min
                </button>
                <button
                  className={`p-3 sm:px-2 sm:py-1 sm:text-sm ${
                    requestedTime === 60 ? "bg-black text-white" : "bg-gray-200"
                  } rounded-md`}
                  onClick={() => setRequestedTime(60)}
                >
                  1 hour
                </button>
              </div>
            </div>
          </div>
          {requestedTime !== null && (
            <ConfirmPaymentForm
              setSelectedMethod={setSelectedMethod}
              selectedMethod={selectedMethod}
            />
          )}

          <div className="flex mt-4 gap-4">
            <button
              onClick={onClose}
              className="bg-white border border-black text-black py-3 rounded md:text-sm w-full"
            >
              No
            </button>
            <button
              onClick={handlecheckout}
              className="bg-black text-white py-3 rounded md:text-sm w-full"
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMoreTime;