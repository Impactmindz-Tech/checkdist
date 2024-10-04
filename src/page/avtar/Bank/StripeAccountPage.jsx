import AvatarBottomBtn from "@/components/Avatar/Button/AvatarBottomBtn";
import HeaderBack from "@/components/HeaderBack";
import Loader from "@/components/Loader";
import {
  AddstripeApi,
  fetchstripeApi,
} from "@/utills/service/avtarService/Earnings";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// NEW CODE
const stripeAccountSchema = yup.object().shape({
  accountHolderName: yup.string().required("Account Holder Name is required."),
  accountNumber: yup.string().required("Account Number is required."),
  routingNumber: yup.string().required("Routing Number is required."),
  firstName: yup.string().required("First Name is required."),
  lastName: yup.string().required("Last Name is required."),
  email: yup.string().email("Invalid email.").required("Email is required."),
  phoneNumber: yup
    .string()
    .matches(/^\+1\d{10}$/, "Phone number must be in the format +10000000000")
    .required("Phone number is required."),
  ssnLastDigits: yup
    .string()
    .min(4, "At least 4 characters required.")
    .required("SSN is required."),
  address: yup.string().required("Address is required."),
  city: yup.string().required("City is required."),
  state: yup.string().required("State is required."),
  postalCode: yup.string().required("Postal Code is required."),
  country: yup.string().required("Country is required."),
});
// NEW CODE

function StripeAccountPage() {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);

  // NEW CODE
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(stripeAccountSchema),
  // });
  // Initialize the form with useForm and add resolver for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Reset to set the form values dynamically
  } = useForm({
    resolver: yupResolver(stripeAccountSchema),
    defaultValues: {} // Initially empty, will be updated with fetched data
  });

  const onSubmit = async(data) => {
    setLoader(true);
  

    try {
      const res = await AddstripeApi(data);
      if (res?.isSuccess) {
        toast.success(res?.message || "Account added/updated successfully.");
      } else {
        toast.error(res?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
  };
  // NEW CODE

  const handleClick = async (e) => {

    e.preventDefault();

  };

  useEffect(() => {
    const fetchstripe = async () => {
      setLoader(true);
      try {
        const res = await fetchstripeApi();
        console.log(res.data)
        if (res?.isSuccess) {
          // Update the form with fetched values using reset()
          reset({
            accountHolderName: res?.data?.stripeAccountHolderName || "",
            accountNumber: res?.data?.stripeAccountNumber || "",
            routingNumber: res?.data?.stripeRoutingNumber || "",
            firstName: res?.data?.firstName || "",
            lastName: res?.data?.lastName || "",
            email: res?.data?.stripeEmail || "",
            phoneNumber: res?.data?.phoneNumber || "",
            ssnLastDigits: res?.data?.stripeSsnLastDigits || "",
            address: res?.data?.address || "",
            city: res?.data?.city || "",
            state: res?.data?.state || "",
            postalCode: res?.data?.postalCode || "",
            country: res?.data?.country || "",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    };
    fetchstripe();
  }, [reset]);

  
  return (
    <>
      {loader && <Loader />}
      <div className="container">
        <HeaderBack link="/avatar/bank" text={"Stripe Account"} />
        {/* <div className="mt-5">
          <label htmlFor="account">Add Stripe Account</label>
          <input
            type="email"
            id="account"
            className="input mt-2"
            value={email}
            placeholder="Eg. rohansharma@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="fixed bottom-5 left-0 w-full sm:bottom-[70px] md:bottom-[100px]">
            <div className="container">
              <div className="w-full flex justify-center">
                <button
                  onClick={handleClick}
                  className={`font-bold lg:w-[90%] md:w-full p-3 bg-backgroundFill-900 rounded-md text-white w-full`}
                >
                  {email ? "Update Account" : "Add Account"}
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/ new fields starts here /}
        <div className="bg-[#fefce8] border-l-4 border-[#facc15] text-[#a16207] py-[10px] px-[15px] mt-6">
          Account details must be valid; otherwise, you will not be able to
          withdraw your earnings. Please wait after adding or updating details,
          as it may take up to 15 minutes.
        </div>
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-lg">Add Bank Details</h3>
            <div className="flex flex-col flex-1">
              <label className="mb-[5px]">Account Holder Name</label>
              <input
                type="text"
                id="accountHolderName"
                className="input"
                {...register("accountHolderName")}
              />
              {errors.accountHolderName && (
                <p className="text-[red] text-sm">
                  {errors.accountHolderName.message}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-4 sm:flex-col">
              <div className="flex flex-col flex-1">
                <label className="mb-[5px]">Account Number</label>
                <input
                  type="number"
                  id="accountNumber"
                  className="input"
                  min={0}
                  {...register("accountNumber")}
                />
                {errors.accountNumber && (
                  <p className="text-[red] text-sm">
                    {errors.accountNumber.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <label className="mb-[5px]">Routing Number</label>
                <input
                  type="number"
                  id="routingNumber"
                  className="input"
                  min={0}
                  {...register("routingNumber")}
                />
                {errors.routingNumber && (
                  <p className="text-[red] text-sm">
                    {errors.routingNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1 mt-6">
            <h3 className="text-lg">Add Personal Info</h3>
            <div className="flex flex-wrap gap-4 sm:flex-col">
              <div className="flex flex-col flex-1">
                <label className="mb-[5px]">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="input"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-[red] text-sm">{errors.firstName.message}</p>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <label className="mb-[5px]">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="input"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-[red] text-sm">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 sm:flex-col">
              <div className="flex flex-col flex-1">
                <label className="mb-[5px]">Email</label>
                <input
                  type="email"
                  id="email"
                  className="input"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-[red] text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <label className="mb-[5px]">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="input"
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-[red] text-sm">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 sm:flex-col">
              <div className="flex flex-col flex-1">
                <label className="mb-[5px]">
                  Last 4 digits of SSN or Complete SSN
                </label>
                <input
                  type="number"
                  id="ssnLastDigits"
                  className="input"
                  {...register("ssnLastDigits")}
                />
                {errors.ssnLastDigits && (
                  <p className="text-[red] text-sm">
                    {errors.ssnLastDigits.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <label className="mb-[5px]">Address</label>
                <input
                  type="text"
                  id="address"
                  className="input"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-[red] text-sm">{errors.address.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 sm:flex-col">
              <div className="flex flex-col flex-1">
                <label className="mb-[5px]">City</label>
                <input
                  type="text"
                  id="city"
                  className="input"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-[red] text-sm">{errors.city.message}</p>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <label className="mb-[5px]">State</label>
                <input
                  type="text"
                  id="state"
                  className="input"
                  {...register("state")}
                />
                {errors.state && (
                  <p className="text-[red] text-sm">{errors.state.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 sm:flex-col">
              <div className="flex flex-col flex-1">
                <label className="mb-[5px]">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  className="input"
                  {...register("postalCode")}
                />
                {errors.postalCode && (
                  <p className="text-[red] text-sm">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <label className="mb-[5px]">Country</label>
                <input
                  type="text"
                  id="country"
                  className="input"
                  {...register("country")}
                />
                {errors.country && (
                  <p className="text-[red] text-sm">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="my-6 font-bold lg:w-[90%] md:w-full p-3 bg-backgroundFill-900 rounded-md text-white w-full"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
}

export default StripeAccountPage;