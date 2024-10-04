import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { bookingSlotsApi } from "@/utills/service/userSideService/userService/UserHomeService";
import { useParams } from "react-router-dom";
import Loader from "../Loader";
dayjs.extend(isSameOrAfter);

const EditDateCalendar = ({ date, onDateChange, setSelectedTime }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bookedTimes, setBookedTimes] = useState({
    '2024-10-05': ['09:30', '10:00'],  // Example of already booked times
    '2024-10-06': ['09:45', '10:15'],
  });
  const [timeSlots, setTimeSlots] = useState([]); // Store all generated time slots
  const [selectedSlot, setSelectedSlot] = useState(null); // State for selected time slot
  const [loading, setLoading] = useState(false); // State for loading
  const params = useParams();

  // Helper function to round up time to the nearest 5 minutes
  const roundUpToNearestFive = (minutes) => {
    return Math.ceil(minutes / 5) * 5;
  };

  // Generate time slots based on 'from' and 'to' in minutes
  const generateTimeSlots = (fromTime, toTime) => {
    const slots = [];
    let current = dayjs().set('hour', Math.floor(fromTime / 60)).set('minute', fromTime % 60).second(0);
    const end = dayjs().set('hour', Math.floor(toTime / 60)).set('minute', toTime % 60).second(0);

    // Round the current time up to the nearest 5 minutes
    const roundedStart = roundUpToNearestFive(current.minute());
    current = current.set('minute', roundedStart); // Set the rounded start time

    while (current.isBefore(end)) {
      const slotTime = current.format("HH:mm"); // Format to 24-hour
      slots.push(slotTime); // Push formatted slot to array

      // Move to the end of the 15-minute slot
      current = current.add(15, 'minute');
    }

    return slots;
  };

  // Check if a time slot is already booked
  const isTimeBooked = (time) => {
    const dateKey = selectedDate.format("YYYY-MM-DD");
    return bookedTimes[dateKey]?.includes(time); // Check if the slot is booked
  };

  // Fetch booking slots
  useEffect(() => {
    const fetchBookingSlots = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const body = { bookingDate: selectedDate.format("YYYY-MM-DD") }; // Format the date properly
        const response = await bookingSlotsApi(params?.id, body); // Call the API
        console.log("response", response);

        if (response.isSuccess) {
          console.log(response.remainingSlots); // Log the response data
          const allSlots = [];

          // Iterate over all remaining slots to generate time slots
          response.remainingSlots.forEach((item) => {
            const fromTime = item.from; // Expect format HH:mm
            const toTime = item.to; // Expect format HH:mm

            // Parse from and to times in 24-hour format
            const fromHour = parseInt(fromTime.split(':')[0], 10) * 60 + parseInt(fromTime.split(':')[1], 10); // Convert to minutes
            const toHour = parseInt(toTime.split(':')[0], 10) * 60 + parseInt(toTime.split(':')[1], 10); // Convert to minutes

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
  }, [selectedDate, params?.id]);

  const handleDateClick = (newDate) => {
    if (!newDate.isSame(selectedDate, 'day')) { // Only update if it's a different day
      setSelectedDate(newDate);
      setSelectedSlot(null); // Reset selected slot when date changes
      setSelectedTime(null); // Reset selected time when date changes
      const formattedDate = newDate.format("YYYY-MM-DD");
      onDateChange(formattedDate); // Notify parent component if necessary
    }
  };

  // Handle time slot click
  const handleTimeSlotClick = (time) => {
    console.log(time);
    setSelectedSlot(time); // Set selected time
    setSelectedTime(time); // Set time in 24-hour format
  };

  // // Custom render function for the calendar days
  // const renderDay = (date, selected, isInCurrentMonth) => {
  //   const isSelected = selectedDate.isSame(date, 'day');
  //   return (
  //     <div
  //       className={`${
  //         isSelected ? 'bg-blue-500 text-white' : 'text-black'
  //       } p-2 rounded-md`}
  //     >
  //       {date.date()}
  //     </div>
  //   );
  // };

  return (
    <>
      <div className="flex justify-evenly flex-wrap items-center">
        {/* Left side: Calendar */}
        <div className="p-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateClick} // Capture the selected date
              // renderDay={renderDay} // Custom rendering for each day
              fixedWeekNumber={6}
            />
          </LocalizationProvider>
        </div>

        {/* Right side: Meeting time slots */}
        <div className="w-96 h-full min-h-80 ml-2 p-4 overflow-auto">
          <h2 className="text-lg font-semibold">
            Available Times for {selectedDate.format("MMMM D, YYYY")}
          </h2>
          <div className="flex flex-wrap max-h-72 mt-1 text-black">
            {loading ? ( // Check if loading
              <div className="text-black text-3xl flex justify-center items-center"><span className="loading loading-spinner"><Loader/></span></div> // Spinner while loading
            ) : (
              timeSlots.map((time) => (
                <button
                  key={time}
                  disabled={isTimeBooked(time)}
                  title={isTimeBooked(time) ? "Already booked" : "Book this time"}
                  className={`p-2 rounded-md w-full mt-2 border border-black text-black font-semibold ${
                    selectedSlot === time // Check if this time is selected
                      ? 'bg-black text-white' // Change color if selected
                      : isTimeBooked(time)
                      ? 'bg-gray-400 opacity-50 cursor-not-allowed hover:bg-gray-400'
                      : 'bg-white hover:bg-black hover:text-white'
                  }`}
                  onClick={() => handleTimeSlotClick(time)} // Handle time click
                >
                  {time}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditDateCalendar;


