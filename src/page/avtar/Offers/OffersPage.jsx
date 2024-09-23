import OffersCard from "@/components/Avatar/Card/OffersCard";
import BlackBottomButton from "@/components/Button/BlackBottomButton";
import HeaderBack from "@/components/HeaderBack";
import Images from "@/constant/Images";
import { getLocalStorage } from "@/utills/LocalStorageUtills.jsx";
import socket from "@/utills/socket/Socket.js";
import { initClient, handleAuthClick, handleSignoutClick, createGoogleMeet, deleteGoogleMeet } from "../../../meetConfig/googleCalender.js";
import { acceptOfferApi,handleOffersApi } from "@/utills/service/avtarService/acceptOffer";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MapComponent from "@/components/MapComponent";
import moment from "moment";
import OfferMap from "@/components/OfferMap.jsx";
import toast from "react-hot-toast";



function OffersPage() {
  const params = useParams();
  const [offerDetails, setOfferDetails] = useState(null);
  const [selectPosition, setSelectPosition] = useState(null);
  const [latLon, setLatLon] = useState([]);
 const navigate = useNavigate();
const acceptOffer = async()=>{
  const body={
    id:params?.id,
    status:"Accepted"
  }
  try{
    const response = await handleOffersApi(body);
    if(response?.isSuccess){
      socket.emit("accept",'');
     toast.success("Offer is Accepted")
      navigate('/avatar/experience?tab=offers')
    }

  }catch(err){
    console.log("hello")
  }
 
}


  const handleclick =async()=>{

    try {
      const response = await acceptOfferApi(params?.id);
      if (response?.isSuccess) {
        setOfferDetails(response?.data); 
      
        // Ensure it's an array
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    handleclick();
  }, []);


  const fetchCoordinates = async (Country, City, State) => {
    try {
      // const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${country},${city},${state}%20india&format=json&limit=1`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${City},${State},${Country}&format=json&limit=1`
      );
 
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
      }
      return null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };


  useEffect(() => {
    const updateCoordinates = async () => {
      if (offerDetails) {
        const coords = await fetchCoordinates(
          offerDetails?.Country,
          offerDetails?.City,
          offerDetails?.State
        );
       
        if (coords) {
          setLatLon(coords); // Set the coordinates for the map
        }
      }
    };
    updateCoordinates();
  }, [offerDetails]);


  return (
    <div>
      <HeaderBack link={"/avatar/experience"} text={"Offers"} />
      <OffersCard item={offerDetails} state={true} />

      <div className="my-4">
        <h1 className="font-bold">User requested a tour at this location</h1>

        <div className="map">
                
                  <div className="my-3 relative">
                    <div className="centerImageIcon relative  w-full flex flex-col gap-2 justify-center">
                      <div className="w-[50%] m-auto lg:w-[98%]">
                        <div className="shape text-sm text-center">Exact location provided after booking.</div>
                        <div className="flex w-full justify-center">
                          <div className="triangleDown"></div>
                        </div>
                      </div>
                      <div   className="flex justify-center">
                        <img src={Images.homeIcon} alt="home icon" className="cursor-pointer lg:w-10 lg:h-10" />
                      </div>
                    </div>
                    <div className="h-[400px]">
                      <OfferMap data={offerDetails} setHeight={true} />
                    </div>
                  </div>
                  {/* <h4 className="font-bold">
                    {item?.State}, {item?.country}
                  </h4> */}
                  <h5 className="font-medium my-2">About this Tour</h5>
                  {/* <p className="text-grey-800">{item?.about}</p> */}
                </div>


        <h4 className="font-bold">Notes</h4>
        <p className="text-grey-800">{offerDetails?.Notes}</p>
      </div>

      <div className="w-full my-6 rounded-md bottom-1 m-auto left-0 right-0 p-2 cursor-pointer bg-backgroundFill-900 text-white text-center">
        <button onClick={acceptOffer} className="py-1 font-bold ">Accept</button>
      </div>
    </div>
  );
}

export default OffersPage;
