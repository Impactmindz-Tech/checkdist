import axiosInstance from "@/utills/AxiosInstance";
import toast from "react-hot-toast";

export const acceptOfferApi = async (id) => {
  try {
    const res = await axiosInstance.get("/avatar/offerdetails/" + id);
    return res.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const handleOffersApi= async(payload)=>{
const{status,id} = payload;


  try{
    const res = await axiosInstance.patch(`avatar/acceptOffer/${id}`, { status });
return res.data;
  }catch(error){
    console.log(error)
  }
}