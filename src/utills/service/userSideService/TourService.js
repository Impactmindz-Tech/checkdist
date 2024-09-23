import axiosInstance from "@/utills/AxiosInstance";

export const getLiveTourApi = async (setValue) => {
  console.log(setValue);
  

 
  try {
    const res = await axiosInstance.get(`/user/tours?${setValue}=true`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};


