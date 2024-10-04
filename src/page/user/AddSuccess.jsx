import RecordItModal from "@/components/Modal/RecordItModal";
import OnlyBrandNameHeader from "@/components/UserHeader/OnlyBrandNameHeader";
import Images from "@/constant/Images";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getmeetdata } from "@/utills/service/userSideService/userService/UserHomeService";
import { getLocalStorage } from "@/utills/LocalStorageUtills";
import { useNavigate } from "react-router-dom";


function  AddSuccess() {
  const [InstantLiveModal, setInstantLiveModal] = useState(false);
  const meetId = localStorage.getItem("meet") || getLocalStorage("meetdata")?._id;
  const[meetdata,setdata] = useState(null);
  const navigate = useNavigate();

  const getalldata = async (meetId) => {
    try {
      let res = await getmeetdata(meetId);
      console.log(res);
      setdata(res.data.eventId);
     
       
    } catch (err) {
      console.error("Failed to fetch meet data:", err);
    }
  };

  // UseEffect to call the getalldata function once the component mounts
  useEffect(() => {
    if (meetId) {
      getalldata(meetId);  // Fetch data only if meetId is available
    }
  }, []);
  const handleclick = ()=>{
    navigate(`/room_join/${meetdata}`)
  }
  return (
    <div className="container">
      <OnlyBrandNameHeader text={"Payment Status"} />
      <div className="max-w-2xl m-auto ">
        <div>
          {/* {/ success /} */}
          <div className="main">
            <div className="flex justify-center items-center ">
              <img
                src={Images.paymentSuccess}
                alt="paymentSuccess"
                className="w-[150px] "
              />
            </div>
            <h1 className="text-center text-success pt-5">
              Payment Successful
            </h1>
            <p className="text-grey-800 text-center py-3">
              Your payment has been successfully done!
            </p>
          </div>
        </div>

        <div className="w-[90%] m-auto my-6 fixed bottom-[20px] left-[5%]">
          <div className="w-[50%] m-auto  lg:w-full text-center">
            <Link to="/user/dashboard">
              {" "}
              <button className="border border-primaryColor-900 text-black font-semibold py-2 lg:w-[90%] rounded w-full">
                Back to Home
              </button>
            </Link>
            {/* <button
              className="bg-black text-white py-3 rounded w-full mt-3 lg:w-[90%]"
              onClick={() => setInstantLiveModal(true)}
            >
              Instant Live
            </button> */}
           
              <button onClick={handleclick} className="bg-black text-white py-3 rounded w-full mt-3 lg:w-[90%]">
               Continue 
              </button>
            
          </div>{" "}
        </div>
      </div>

      <RecordItModal
        InstantLiveModal={InstantLiveModal}
        setInstantLiveModal={setInstantLiveModal}
      />
    </div>
  );
}

export default AddSuccess;