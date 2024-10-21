
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { bookingSlotsApi } from "@/utills/service/userSideService/userService/UserHomeService";
import { getLocalStorage } from "@/utills/LocalStorageUtills";
import { useParams } from "react-router-dom";
import Loader from "../Loader";

// Extend Day.js with necessary plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);

const EditDateCalendar = ({ date, onDateChange, setSelectedTime, currentTime }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [timeSlots, setTimeSlots] = useState([]); // Store all generated time slots
  const [selectedSlot, setSelectedSlot] = useState(null); // State for selected time slot
  const [loading, setLoading] = useState(false); // State for loading
  const params = useParams();



  // Retrieve avatar timezone from local storage
  const avatarTimeZone = getLocalStorage("avatarTime");
  

  // Get the current time in the avatar's timezone
  const getCurrentTimeOfAvatar = dayjs().tz(avatarTimeZone);


  // Helper function to round up time to the nearest 5 minutes
  const roundUpToNearestFive = (minutes) => {
    return Math.ceil(minutes / 5) * 5;
  };

  // Generate time slots based on 'from' and 'to' in minutes
  const generateTimeSlots = (fromTime, toTime) => {
    const slots = [];
    
    // Create a Day.js object in the avatar's timezone
    let current = dayjs()
      .tz(avatarTimeZone)
      .set("hour", Math.floor(fromTime / 60))
      .set("minute", fromTime % 60)
      .set("second", 0)
      .set("millisecond", 0);
    
    const end = dayjs()
      .tz(avatarTimeZone)
      .set("hour", Math.floor(toTime / 60))
      .set("minute", toTime % 60)
      .set("second", 0)
      .set("millisecond", 0);

    // Get the current time in avatar's timezone
    const now = dayjs().tz(avatarTimeZone);

    // Round the current time up to the nearest 5 minutes
    const roundedStart = roundUpToNearestFive(current.minute());
    current = current.set("minute", roundedStart); // Set the rounded start time

    while (current.isBefore(end)) {
      const slotTimeAvatarFormatted = current.format("hh:mm A"); // Time in avatar's timezone (AM/PM)

      // Check if the selected date is today and the slot is in the past
      if (
        !selectedDate.isSame(dayjs(), "day") || // If the selected date is not today, include the time
        current.isSameOrAfter(now) // If the current time is in the future or equal to now
      ) {
        slots.push({
          avatarTime: current.format("HH:mm"),            // Time in avatar's timezone (24-hour format)
          avatarTimeFormatted: slotTimeAvatarFormatted,   // Time in avatar's timezone (AM/PM)
        });
      }

      // Move to the end of the 15-minute slot
      current = current.add(15, "minute");
    }

    return slots;
  };

  // Fetch booking slots
  useEffect(() => {
    const fetchBookingSlots = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const body = { bookingDate: selectedDate.format("YYYY-MM-DD") }; // Format the date properly
        const response = await bookingSlotsApi(params?.id, body); // Call the API
       

        if (response.isSuccess) {
       
          const allSlots = [];

          // Iterate over all remaining slots to generate time slots
          response.remainingSlots.forEach((item) => {
            const fromTime = item.from; // Expect format HH:mm
            const toTime = item.to;     // Expect format HH:mm

            // Parse from and to times in 24-hour format
            const fromHour =
              parseInt(fromTime.split(":")[0], 10) * 60 +
              parseInt(fromTime.split(":")[1], 10); // Convert to minutes
            const toHour =
              parseInt(toTime.split(":")[0], 10) * 60 +
              parseInt(toTime.split(":")[1], 10); // Convert to minutes

            // Generate time slots for the current range and add to allSlots
            const generatedSlots = generateTimeSlots(fromHour, toHour);
            allSlots.push(...generatedSlots); // Spread the generated slots into the array
          });

          setTimeSlots(allSlots); // Update the time slots state
        }
      } catch (error) {
        console.error("Error fetching booking slots:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    // Fetch slots only if `selectedDate` has been updated
    if (selectedDate) {
      fetchBookingSlots();
    }
  }, [selectedDate, params?.id, avatarTimeZone]); // Added avatarTimeZone as dependency

  const handleDateClick = (newDate) => {
    if (window.innerWidth < 1024) {
      document.getElementById("availableTimes").scrollIntoView({
        behavior: "smooth",
      });
    }
    if (!newDate.isSame(selectedDate, "day")) {
      // Only update if it's a different day
      setSelectedDate(newDate);
      setSelectedSlot(null); // Reset selected slot when date changes
      setSelectedTime(null); // Reset selected time when date changes
      const formattedDate = newDate.format("YYYY-MM-DD");
      onDateChange(formattedDate); // Notify parent component if necessary
    }
  };

  // Handle time slot click
  const handleTimeSlotClick = (slot) => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
    setSelectedSlot(slot.avatarTime); // Set selected time in avatar's timezone (24-hour format)
    setSelectedTime(slot.avatarTime); // Set time in 24-hour format for backend
  };

  return (
    <>
      <div className="flex justify-evenly flex-wrap items-center">
       
        <div className="p-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateClick} // Capture the selected date
              minDate={dayjs()} // Disable past dates by setting minDate to today
              fixedWeekNumber={6}
            />
          </LocalizationProvider>
        </div>

        {/* {/ Right side: Meeting time slots /} */}
        <div
          className="w-96 h-full min-h-80 ml-2 p-4 overflow-auto"
          id="availableTimes"
        >
          <h2 className="text-lg font-semibold">
            Available Times for {selectedDate.format("MMMM D, YYYY")}
          </h2>
          <p className="text-sm text-gray-500 mb-2">
            Times are displayed in the avatar's timezone ({avatarTimeZone}).
          </p>
          <div className="flex flex-wrap max-h-72 mt-1 text-black">
  {loading ? ( // Check if loading
    <div className="text-black text-3xl flex justify-center items-center">
      <span className="loading loading-spinner">
        <Loader />
      </span>
    </div> // Spinner while loading
  ) : timeSlots.length > 0 ? ( // Check if there are time slots
    timeSlots.map((slot) => (
      <button
        key={slot.avatarTime}
        className={`p-2 rounded-md w-full mt-2 border border-black text-black font-semibold ${
          selectedSlot === slot.avatarTime // Check if this time is selected
            ? "bg-black text-white" // Change color if selected
            : "bg-white hover:bg-black hover:text-white" // Unselected slot styling
        }`}
        onClick={() => handleTimeSlotClick(slot)} // Handle time click
      >
        {slot.avatarTimeFormatted} 
      </button>
    ))
  ) : (
    <div className="text-center text-green-500 font-semibold w-full  mt-5">
      No time slots available for the selected date
    </div> // Show message if no slots available
  )}
</div>

        </div>
      </div>
    </>
  );
};

export default EditDateCalendar;
