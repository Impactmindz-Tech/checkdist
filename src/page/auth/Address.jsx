
import { addAddressApi } from "@/utills/service/authService";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import Image from "../../constant/Images";
import { useGeolocated } from "react-geolocated";
import Dropdown from "@/components/statecitycountry/DropDown";
import { getLocalStorage, setLocalStorage } from "@/utills/LocalStorageUtills";

const Address = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loader, setLoader] = useState(false);
  const [zipCode, setZipCode] = useState("");
  
  const navigate = useNavigate();
  const params = useParams();
  const handleZipCodeChange = (e) => {
    const value = e.target.value;
    // Regular expression to allow only digits (0-9)
    if (/^\d*$/.test(value)) {
      setZipCode(value);  // Set the value if it matches the regex
    }
  };
  const {
    coords,
    getPosition,
    isGeolocationAvailable,
    isGeolocationEnabled,
  } = useGeolocated({
    positionOptions: { enableHighAccuracy: false },
    userDecisionTimeout: 5000,
    watchPosition: false,
    suppressLocationOnMount: true,
    onError: (error) => {
      setLoader(false);
      if (error.code === 1) {
        toast.error("Please allow location permissions in your browser.", {
          duration: 4000,
        });
      } else {
        toast.error("Error fetching location. Please try again.", {
          duration: 4000,
        });
      }
    },
  });

  // Fetch coordinates based on country, state, and city
  const fetchCoordinates = async (country, state = "", city = "") => {
    try {
      let query = "";
      if (city) {
        query = `${city},${state},${country}`;
      } else if (state) {
        query = `${state},${country}`;
      } else {
        query = `${country}`;
      }

      const encodedQuery = encodeURIComponent(query);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1`
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

  // Add Address Function
  const addAddress = async () => {
    const id = params?.id;

    // Validate selections
    if (!selectedCountry || !selectedCountry.name) {
      toast.error("Please Select Country");
      return;
    }

    if (!selectedState || !selectedState.name) {
      toast.error("Please Select State");
      return;
    }

    if (!selectedCity) {
      toast.error("Please Select City");
      return;
    }

    const coordinates = await fetchCoordinates(
      selectedCountry.name,
      selectedState.name,
      selectedCity
    );

    if (!coordinates) {
      toast.error("Could not fetch coordinates.");
      return;
    }

    const data = {
      country: selectedCountry.name,
      State: selectedState.name, // Ensure uppercase 'S' as per backend expectation
      city: selectedCity,
      zipCode,
      lat: coordinates.lat,
      lng: coordinates.lon,
    };

    console.log("Data being sent:", data); // Debugging line

    try {
      setLoader(true);

      let user = getLocalStorage("user");
      if (user) {
        user.City = data.city;
        user.Country = data.country;
        user.State = data.State;
        setLocalStorage("user", user);
      }

      const response = await addAddressApi(id, data);

      console.log("API Response:", response); // Debugging line

      if (response?.isSuccess) {
        // console.log(response)
        toast.success(response?.message);
        navigate("/user/dashboard");
      } else {
        toast.error(response?.message || "Failed to add address. Please try again.");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("An error occurred while adding the address.");
    } finally {
      setLoader(false);
    }
  };

  // Reverse Geocoding Function
  const getLocationFromLatLong = async (lat, lng) => {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data)
      console.log(data.address)
      if (data && data.address) {
        const { country, state, city, city_district, postcode } = data.address;
        console.log( country, state, city, city_district, postcode)
        // Determine state
        const userState = state  || city_district || "";

        // Determine city
        const userCity = city || "";
       
        if (!country || !userState || !userCity) {
          toast.error("Incomplete location details fetched.");
          setLoader(false);
          return;
        }

        const coordinates = await fetchCoordinates(country, userState, userCity);

        if (!coordinates) {
          toast.error("Could not fetch coordinates for current location.");
          setLoader(false);
          return;
        }

        // Update state variables to populate the form
        setSelectedCountry({ name: country });
        setSelectedState({ name: userState });
        setSelectedCity(userCity);
        setZipCode(postcode || "");

        const payload = {
          country: country,
          State: userState,
          city: userCity,
          zipCode: postcode || "",
          lat: coordinates.lat,
          lng: coordinates.lon,
        };

        console.log("Payload for current location:", payload); // Debugging line

        try {
          let user = getLocalStorage("user");
          if (user) {
            user.City = payload.city;
            user.Country = payload.country;
            user.State = payload.State;
            setLocalStorage("user", user);
          }

          const response = await addAddressApi(params?.id, payload);
          console.log("API Response (current location):", response); // Debugging line

          if (response?.isSuccess) {
            toast.success(response?.message);
            navigate("/user/dashboard");
          } else {
            toast.error(response?.message || "Failed to add address. Please try again.");
          }
        } catch (error) {
          console.error("Error adding address from current location:", error);
          toast.error("An error occurred while adding the address.");
        } finally {
          setLoader(false);
        }
      } else {
        toast.error("Unable to fetch location details.");
        setLoader(false);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Error fetching location details.");
      setLoader(false);
    }
  };

  // Get Current Location Function
  const getCurrentLocation = async () => {
    if (!isGeolocationAvailable) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    if (!isGeolocationEnabled) {
      toast.error("Geolocation is disabled. Please enable it in your browser settings.");
      return;
    }

    setLoader(true);
    getPosition(); // Correct usage without callback
  };

  // Effect to handle coordinates update
  useEffect(() => {
    if (coords && coords.latitude && coords.longitude) {
      getLocationFromLatLong(coords.latitude, coords.longitude);
    }
  }, [coords]);

  // Fetch countries on mount
  useEffect(() => {
    fetch("/countries.json")
      .then((response) => response.json())
      .then((data) => {
        const countryList = data.map((country) => ({
          name: country.name,
          code: country.isoCode,
        }));
        setCountries(countryList);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetch("/states.json")
        .then((response) => response.json())
        .then((data) => {
          const filteredStates = data.filter(
            (state) => state.countryCode === selectedCountry.code
          );
          setStates(
            filteredStates.map((state) => ({
              name: state.name,
              code: state.isoCode,
            }))
          );
          setSelectedState(null);
          setSelectedCity(null);
          setCities([]);
        })
        .catch((error) => console.error("Error fetching states:", error));
    } else {
      setStates([]);
      setCities([]);
      setSelectedState(null);
      setSelectedCity(null);
    }
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (selectedState) {
      fetch("/cities.json")
        .then((response) => response.json())
        .then((data) => {
          const filteredCities = data.filter(
            (city) =>
              city.stateCode === selectedState.code &&
              city.countryCode === selectedCountry.code
          );
          setCities(
            filteredCities.map((city) => ({
              name: city.name,
            }))
          );
          setSelectedCity(null);
        })
        .catch((error) => console.error("Error fetching cities:", error));
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedState, selectedCountry]);

  return (
    <>
      {loader && <Loader />}
      <div className="w-[50%] sm:w-[90%] mx-auto lg:max-w-full">
        <div className="py-1 "></div>
        <div className="flex flex-col gap-2 my-3 gap-y-4 relative">
          <h1 className="text-textMainColor-900 font-medium">Address</h1>
          <div className="flex flex-col gap-2 my-3">
            <div className="flex flex-col gap-2 my-3">
              <label htmlFor="country" className="font-semibold">
                Country
              </label>
              <Dropdown
                data={countries.map((c) => c.name)}
                selectedValue={selectedCountry?.name || ""}
                onChange={(name) => {
                  const country = countries.find((c) => c.name === name);
                  setSelectedCountry(country || null);
                }}
                placeholder="Select Country"
              />

              <label htmlFor="state" className="font-semibold">
                State
              </label>
              <Dropdown
                data={states.map((s) => s.name)}
                selectedValue={selectedState?.name || ""}
                onChange={(name) => {
                  const state = states.find((s) => s.name === name);
                  setSelectedState(state || null);
                }}
                placeholder="Select State"
                disabled={!selectedCountry}
              />

              <label htmlFor="city" className="font-semibold">
                City
              </label>
              <Dropdown
                data={cities.map((c) => c.name)}
                selectedValue={selectedCity || ""}
                onChange={(name) => setSelectedCity(name)}
                placeholder="Select City"
                disabled={!selectedState}
              />

              <label htmlFor="zip" className="font-semibold">
                Zip Code
              </label>
              <input
                type="text"
                name="zipcode"
                value={zipCode}
                onChange={handleZipCodeChange}
                id="zipcode"
                className="border py-2 px-4 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="93940"
              />
            </div>

            <div
              className="use-current-location flex gap-x-2 items-center leading-none cursor-pointer"
              onClick={getCurrentLocation}
            >
              <img src={Image.iconCurrentLocation} alt="Use current location" />
              Use current location
            </div>
          </div>

          <button
            type="button"
            className="mt-5 py-3 px-5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={addAddress}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Address;
