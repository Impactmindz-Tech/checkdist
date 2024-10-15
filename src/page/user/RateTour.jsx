import RateTourRating from "@/components/Rating/RateTourRating";
import { Button } from "@/components/ui/button";
import HeaderWithSkipBtn from "@/components/UserHeader/HeaderWithSkipBtn";
import { getmeetdata, rateTourApi } from "@/utills/service/userSideService/userService/UserHomeService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import { payoutApi } from "@/utills/service/userSideService/PayConfiermService";

function RateTour() {
let meetId = localStorage.getItem('meet');


  const navigate = useNavigate();
  let parms = useParams();
  const location = useLocation();
  const [data, setData] = useState(location?.state);
  const [tipMoney, setTipMoney] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [onlyone, setOne] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false); // New state to track review submission

  const tipCalculate = (price) => {
    setTipMoney(price);
  };

  const handleRatingChange = (newRating) => {
    if (!hasReviewed) { // Only allow rating changes if not reviewed
      setRating(newRating);
    }
  };



  const submitReview = async () => {
    setOne(true);
    try {
      setLoading(true);
      const id = parms.id;
      const body = {
        rating,
        comment,
        AmmountTip: tipMoney,
      };
      const res = await rateTourApi(id, body);
    if(data.res.AvatarID){
      let bodydata = {
        to:data.res.AvatarID,
        price:data.res.price,
        reqid:data.res.ReqId

        

      }
      const response = await payoutApi( bodydata);
    }else{
      let bodydata = {
        to:data.res.avatarId,
        price:data.res.totalPrice,
        reqid:data.res.reqId

        

      }
      const response = await payoutApi( bodydata);

    }
 
 
      
      

   
      if (res?.isSuccess) {
        setHasReviewed(true); // Mark as reviewed

        if (tipMoney === 0) {
     
          toast.success("Rate Given Successfully");
          navigate('/user/experience?tab=completed')
        } else {
          navigate("/user/tip", { state: { item: body, res: res } });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <HeaderWithSkipBtn
        link="/user/experience"
        text="Tour Rating"
        skipLink="/user/experience"
      />
      <div className="m-auto relative mb-5">
        <h1 className="text-primaryColor-900">Review the Experience</h1>

        <div className="starRate">
          <RateTourRating onRatingChange={handleRatingChange} disabled={hasReviewed} />{" "}
          {/* Disable if reviewed */}
        </div>

        <div className="my-3">
          <textarea
            name="Comment"
            placeholder="Type review here..."
            rows="9"
            className="bg-boxFill-900 w-full outline-0 p-3 resize-none rounded-md"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={hasReviewed} // Disable if reviewed
          />
        </div>

        <p className="my-2">Tip for the Avatar({getCurrencySymbol()})</p>
        <div className="btn mb-10">
          <button
            type="button"
            className={`rateTourBtn ${tipMoney === 10 && "rateTourBtnActive"}`}
            onClick={() => tipCalculate(10)}
            disabled={hasReviewed} // Disable if reviewed
          >
            {getCurrencySymbol()}10
          </button>

          <button
            type="button"
            className={`rateTourBtn ${tipMoney === 15 && "rateTourBtnActive"}`}
            onClick={() => tipCalculate(15)}
            disabled={hasReviewed} // Disable if reviewed
          >
            {getCurrencySymbol()}15
          </button>

          <button
            type="button"
            className={`rateTourBtn ${tipMoney === 20 && "rateTourBtnActive"}`}
            onClick={() => tipCalculate(20)}
            disabled={hasReviewed} // Disable if reviewed
          >
            {getCurrencySymbol()}20
          </button>

          <button
            type="button"
            className={`rateTourBtn ${tipMoney === 25 && "rateTourBtnActive"}`}
            onClick={() => tipCalculate(25)}
            disabled={hasReviewed} // Disable if reviewed
          >
            {getCurrencySymbol()}25
          </button>

          <input
            type="text"
            className="inputCenter"
            placeholder="Enter amount"
            value={tipMoney}
            onChange={(e) => setTipMoney(e.target.value)}
            disabled={hasReviewed} // Disable if reviewed
          />
        </div>

        <Button 
          disabled={onlyone || hasReviewed} // Disable if reviewed
          className="w-full bg-[#2d2d2d]" 
          onClick={submitReview}
        >
          Add Review
        </Button>
      </div>
      {loading && <Loader />}
    </div>
  );
}

export default RateTour;
