import ConfirmPayCard from "@/components/Cards/Confirm_Pay_Card/ConfirmPayCard";
import HeaderBack from "@/components/HeaderBack";
import EditDateModal from "@/components/Modal/EditDateModal";
import EditTimeModal from "@/components/Modal/EditTimeModal";
import ConfirmPaymentForm from "@/components/Payment Card/Confirm_Page_Payment";
import { formatDate } from "@/constant/date-time-format/DateTimeFormat";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import Images from "@/constant/Images";
import { getBookingDetailsApi, checkout, paypalcheckout } from "@/utills/service/userSideService/userService/UserHomeService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import Loader from "@/components/Loader";

// In your DateTimeFormat.js file
export const formatTimeAMPM = (isoString) => {
  const date = new Date(isoString);

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

function Confirm_Pay() {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("stripe");
  const [startTime, setStartTime] = useState("N/A");
  const [editdate, setEditDate] = useState("");
  const [endTime, setEndTime] = useState("N/A");
  const params = useParams();
  const [showEditDateModal, setShowEditDateModal] = useState(false);
  const [showEditTimeModal, setShowEditTimeModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loader, setLoader] = useState(false);
  const getBookingDetails = async () => {
    try {
      setLoader(true);
      const response = await getBookingDetailsApi(params?.id);

      if (response?.isSuccess && response?.data) {
        setBookingDetails(response);
        setStartTime(response.data.booking.bookingTime);
        setEndTime(formatTimeAMPM(response.data.booking.endTime));
        setEditDate(response.data.booking.bookingDate);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  const handleToggle = () => {
    setIsChecked(!isChecked);
  };
  const total = bookingDetails?.data?.priceInfo?.AmountsperMinute * bookingDetails?.data?.priceInfo?.Duration || 0;
  // const percentage =total+parseFloat(bookingDetails?.data?.booking?.Adminfee);
  useEffect(() => {
    getBookingDetails();
  }, [params?.id, showEditTimeModal, showEditDateModal]);

  const handlecheckout = async () => {
    if (selectedMethod === "stripe") {
      const stripe = await loadStripe(import.meta.env.VITE_APP_STRIPEKEY);
      let body = {
        bookingId: bookingDetails?.data?.booking?._id,
        avatarId: bookingDetails?.data?.booking?.avatarId,
        price: totalprice.toFixed(2),
        product: bookingDetails?.data?.packageInfo?.ExperienceName,
        productId: bookingDetails?.data?.booking?.packageIds,
        Adminfee: adminfee.toFixed(2),
        paymentType: selectedMethod,
        recording:isChecked
      };
      try {
        setLoader(true);
        let senddata = await checkout(body);
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
        bookingId: bookingDetails?.data?.booking?._id,
        avatarId: bookingDetails?.data?.booking?.avatarId,
        price: totalprice.toFixed(2),
        product: bookingDetails?.data?.packageInfo?.ExperienceName,
        productId: bookingDetails?.data?.booking?.packageIds,
        Adminfee: adminfee.toFixed(2),
        paymentType: selectedMethod,
        recording:isChecked
      };
      try {
        setLoader(true);
        let res = await paypalcheckout(body);

        if (res.isSuccess) {
          let link = res.url;
          window.location.href = link;
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoader(false);
      }
    }
  };
const packageprice = total;
const adminfee = bookingDetails?.data?.booking?.Adminfee/100*packageprice;
let totalprice = adminfee+total;

  return (
    <>
      {loader && <Loader />}
      <div className="container">
        <HeaderBack link="/user/booking" text={"Confirm and Pay"} />

        <div className="mt-8">
          <div className="flex justify-center w-full">
            <ConfirmPayCard bookingDetails={bookingDetails} />
          </div>

          <div className="flex gap-4 md:block">
            {/* your events edit card */}
            <div className="flex BoxShadowLessRounded m-auto w-[50%] md:w-full my-5">
              <div className="py-2 px-4 w-full">
                <h1 className="my-2 font-bold sm:text-base">Your Events</h1>

                <div className="relative w-full sm:text-sm">
                  {/* date */}
                  <div className="flex justify-between items-center">
                    <div className="div">
                      <div className="flex gap-1 items-center">
                        <div className="icon">
                          <img src={Images.calendarIcon} alt="calendarIcon" className="sm:w-[16px]" />
                        </div>
                        <h6 className="font-semibold">Dates</h6>
                      </div>
                      <h4 className="font-medium my-1">{formatDate(bookingDetails?.data?.booking?.bookingDate) || "N/A"}</h4>
                    </div>
                    {/* edit btn */}
                    <div className="">
                      <img src={Images.edit} alt="edit" className="cursor-pointer" onClick={() => setShowEditDateModal(true)} />
                    </div>
                  </div>

                  {/* time */}
                  <div className="flex justify-between items-center my-3">
                    <div className="div">
                      <div className="flex gap-1 items-center">
                        <div className="icon">
                          <img src={Images.clock} alt="clock" className="sm:w-[16px]" />
                        </div>
                        <h6 className="font-semibold">Time</h6>
                      </div>
                      <h4 className="font-medium my-1">{formatTimeAMPM(startTime) !== "N/A" && endTime !== "N/A" ? `${formatTimeAMPM(startTime)} - ${endTime}` : "N/A"}</h4>
                    </div>
                    <div className="">
                      <img src={Images.edit} alt="edit" className="cursor-pointer" onClick={() => setShowEditTimeModal(true)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* price details card */}
            <div className="flex BoxShadowLessRounded m-auto w-[50%] md:w-full my-5 bg-boxFill-900">
              <div className="py-2 px-4 w-full">
                <h1 className="my-2 font-bold sm:text-base">Price Details</h1>

                <div className="text flex justify-between py-1 sm:text-sm">
                  <div className="title">
                    Price: {getCurrencySymbol()}
                    {bookingDetails?.data?.priceInfo?.AmountsperMinute} x {bookingDetails?.data?.priceInfo?.Duration} minutes
                  </div>
                  <div className="font-medium">
                    {getCurrencySymbol()}
                    {total.toFixed(2)}
                  </div>
                </div>
                <div className="text flex justify-between py-1 sm:text-sm">
                  <div className="title">Avatar Walk Fee</div>
                  <div className="font-medium">
                    {getCurrencySymbol()}
                    {adminfee.toFixed(2)}
                  </div>
                </div>

                {/* total */}
                <div className="total borderTop mt-2 py-2">
                  <div className="text flex justify-between py-1">
                    <div className="title font-bold">Total</div>
                    <div className="font-bold">
                      {getCurrencySymbol()}
                      {totalprice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="BoxShadowLessRounded  py-2 w-full px-4 mb-4">
            <label htmlFor="notesForUser" className="font-semibold flex">
              Do you want to record the experience?
              <input type="checkbox" id="notesForUser" className="hidden" checked={isChecked} onChange={handleToggle} />
              <span className={`relative inline-block w-10 h-6 transition-colors duration-300 ease-in-out rounded-full ml-4 ${isChecked ? "bg-green-500" : "bg-gray-300"}`}>
                <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${isChecked ? "translate-x-4" : ""}`}></span>
              </span>
            </label>
          </div>
          <ConfirmPaymentForm setSelectedMethod={setSelectedMethod} selectedMethod={selectedMethod} />

          <div className="m-auto mt-5">
            {/* <Link to={"/user/payment-status"}> */}
            <div>
              <button
                onClick={handlecheckout}
                className="py-4 font-bold w-full mt-6 mb-6 md:mb-0 rounded-md bottom-1 m-auto left-0 right-0 p-2 cursor-pointer bg-backgroundFill-900 text-white text-center"
              >
                Pay
              </button>
            </div>
            {/* </Link> */}
          </div>
        </div>
      </div>
      <EditTimeModal show={showEditTimeModal} onClose={() => setShowEditTimeModal(false)} startTime={startTime}  editdate={editdate}/>
      <EditDateModal editdate={editdate} show={showEditDateModal} onClose={() => setShowEditDateModal(false)} />
    </>
  );
}

export default Confirm_Pay;
