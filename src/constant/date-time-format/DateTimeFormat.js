import { format } from "date-fns";
export const formatTimeToHHMM = (isoString) => {
  const date = new Date(isoString);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
export const formatTime = (timeString) => {
  if (!timeString) {
    return "";
  }
  const date = new Date(timeString);
  const options = { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "UTC" };
  return date.toLocaleString("en-US", options); // Format to '12:00 PM'
};

export const formatDate = (dateString) => {
  if (!dateString) {
    return "";
  }
  
  const date = new Date(dateString);
  return format(date, "dd MMMM yyyy"); // Format to '25 July 1995'
};
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) {
    return "";
  }

  // Convert the input dateTimeString to a Date object
  const date = new Date(dateTimeString);

  // Format date as '25 July 1995' and time as '12:00 PM' in local time zone
  const formattedDate = format(date, "dd MMMM yyyy");
  const formattedTime = format(date, "hh:mm a");

  return `${formattedDate} at ${formattedTime}`;
};

export function getDateTimeForTimezone(timezoneStr) {
  try {
    const date = new Date();

    const options = {
      timeZone: timezoneStr,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDate = formatter.format(date);

    // Get the timezone abbreviation
    const timeZoneAbbr = new Intl.DateTimeFormat("en-US", {
      timeZone: timezoneStr,
      timeZoneName: "short",
    })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName").value;

    return `${formattedDate} ${timeZoneAbbr}`;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

export const difference = (item) => {
  const bookingTime = moment(item.bookingTime);
  const endTime = moment(item.endTime);
  const duration = moment.duration(endTime.diff(bookingTime));
  const hours = Math.floor(duration.asHours());
  const minutesPart = Math.floor(duration.asMinutes()) % 60;
  return minutesPart;
};

export const formatTo24Hour = (timeString) => {
  if (!timeString) {
    return "";
  }


  const date = new Date(timeString);
  
  if (isNaN(date.getTime())) {
    
    return "Invalid time value";
  }

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();


  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes}`;
};


export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  // Options for formatting without time zone information
  const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true // Set to false for 24-hour format
  };

  return date.toLocaleString('en-US', options);
}


export const  convertTo12HourFormats=(isoString)=> {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'UTC'  // Ensures it remains in UTC
  });
}