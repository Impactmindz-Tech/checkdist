import axiosInstance from "@/utills/AxiosInstance";

export const getLiveTourApi = async (setValue) => {

  

 
  try {
    const res = await axiosInstance.get(`/user/tours?${setValue}=true`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getalltourlocation = async () => {
 
  

 
  try {
    const res = await axiosInstance.get(`/user/alltoursmap`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};


