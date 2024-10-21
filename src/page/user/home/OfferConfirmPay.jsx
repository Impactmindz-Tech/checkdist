import ConfirmPayCard from "@/components/Cards/Confirm_Pay_Card/ConfirmPayCard";
import HeaderBack from "@/components/HeaderBack";
import EditDateModal from "@/components/Modal/EditDateModal";
import EditTimeModal from "@/components/Modal/EditTimeModal";
import ConfirmPaymentForm from "@/components/Payment Card/Confirm_Page_Payment";
import { formatDate } from "@/constant/date-time-format/DateTimeFormat";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import Images from "@/constant/Images";
import {getOfferDetails, checkout, paypalcheckout, offercheckout, offerPaypalcheckout } from "@/utills/service/userSideService/userService/UserHomeService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import Loader from "@/components/Loader";
import ConfirmOfferpaycard from "@/components/Cards/Confirm_Pay_Card/ConfirmOffer_pay_card";
import Offerpagepayment from "@/components/Payment Card/Offer_page_payment";

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

function OfferConfirmPay() {
    const [endTime, setEndTime] = useState("N/A");
    const [startTime, setStartTime] = useState("N/A");
  const [selectedMethod, setSelectedMethod] = useState("stripe");
  const[offerDetails,setOfferDetails] = useState(null);

  const params = useParams();
  const [showEditDateModal, setShowEditDateModal] = useState(false);
  const [showEditTimeModal, setShowEditTimeModal] = useState(false);

  const [loader, setLoader] = useState(false);
  const getBookingDetails = async () => {
    try {
      setLoader(true);
      const response = await getOfferDetails(params?.id);
      
      setOfferDetails(response);
      setStartTime(response.data.bookingTime);
      setEndTime(formatTimeAMPM(response.data.endTime));
   
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
 
  
  useEffect(() => {
    getBookingDetails();
  }, [params?.id]);
const adminfee = offerDetails?.data?.adminFee/100 * offerDetails?.data?.Price;
let totalprice = offerDetails?.data?.Price +adminfee;


  const handlecheckout = async () => {
    if (selectedMethod === "stripe") {
      const stripe = await loadStripe(import.meta.env.VITE_APP_STRIPEKEY);
      let body = {
     
        avatarId: offerDetails?.data?.avatarId,
        price: totalprice.toFixed(2) ,
        product: offerDetails?.data?.ExperienceName,
        OfferId: offerDetails?.data?._id,
        Adminfee: adminfee.toFixed(2),
        paymentType: selectedMethod,
      
      };
      try {
        setLoader(true);
        let senddata = await offercheckout(body);
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
     
            avatarId: offerDetails?.data?.avatarId,
            price: totalprice.toFixed(2),
            product: offerDetails?.data?.ExperienceName,
            OfferId: offerDetails?.data?._id,
            Adminfee: adminfee.toFixed(2),
            paymentType: selectedMethod,
          
          };
      try {
        setLoader(true);
        let res = await offerPaypalcheckout(body);

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

  return (
    <>
      {loader && <Loader />}
      <div className="container">
        <HeaderBack link="/user/booking" text={"Confirm and Pay"} />

        <div className="mt-8">
          <div className="flex justify-center w-full">
            <ConfirmOfferpaycard bookingDetails={offerDetails} />
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
                      <h4 className="font-medium my-1">{formatDate(offerDetails?.data?.bookingDate) || "N/A"}</h4>
                    </div>
                    {/* edit btn */}
                    {/* <div className="">
                      <img src={Images.edit} alt="edit" className="cursor-pointer" onClick={() => setShowEditDateModal(true)} />
                    </div> */}
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
                    Price: 
                   
                  </div>
                  <div className="font-medium">
                    {getCurrencySymbol()}
                    {offerDetails?.data?.Price.toFixed(2)} 
                  </div>
                </div>
                <div className="text flex justify-between py-1 sm:text-sm">
                  <div className="title">Avatar Walk Fee</div>
                  <div className="font-medium">
                    {getCurrencySymbol()}
                    {adminfee.toFixed(2)}
                  </div>
                </div>

           
                <div className="total borderTop mt-2 py-2">
                  <div className="text flex justify-between py-1">
                    <div className="title font-bold">Total</div>
                    <div className="font-bold">
                      {getCurrencySymbol()}
                      {( offerDetails?.data?.Price+ adminfee).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
   
          <Offerpagepayment setSelectedMethod={setSelectedMethod} selectedMethod={selectedMethod} />

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
      {/* <EditTimeModal show={showEditTimeModal} onClose={() => setShowEditTimeModal(false)} startTime={startTime}  editdate={editdate}/>
      <EditDateModal editdate={editdate} show={showEditDateModal} onClose={() => setShowEditDateModal(false)} /> */}
    </>
  );
}

export default OfferConfirmPay;
