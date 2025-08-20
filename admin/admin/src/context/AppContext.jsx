import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currency = "USD";

  const calculateAge = (dob) => {
    if (!dob) return "N/A";

    // Basic cleanup for common formatting issues
    const cleanedDob = dob
      .replace(/(\d+)(st|nd|rd|th)/, "$1")
      .replace(/,/g, "")
      .trim();

    const birthDate = new Date(cleanedDob);
    if (isNaN(birthDate)) return "N/A";

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) age--;

    return age;
  };

  const formattedDate = (slotDate) => {
    // Add null/undefined check to prevent the error
    if (!slotDate || typeof slotDate !== 'string') {
      console.warn('formattedDate received invalid slotDate:', slotDate);
      return "Invalid Date";
    }

    try {
      const dateArray = slotDate.split("_");
      
      // Ensure we have the expected format (3 parts: day_month_year)
      if (dateArray.length !== 3) {
        console.warn('formattedDate received unexpected format:', slotDate);
        return "Invalid Date Format";
      }

      const day = dateArray[0];
      const monthIndex = Number(dateArray[1]);
      const year = dateArray[2];

      // Validate month index
      if (monthIndex < 1 || monthIndex > 12) {
        console.warn('formattedDate received invalid month:', monthIndex);
        return "Invalid Month";
      }

      return `${day} ${months[monthIndex]} ${year}`;
    } catch (error) {
      console.error('Error formatting date:', error, 'Input:', slotDate);
      return "Date Error";
    }
  };

  const value = {
    calculateAge,
    formattedDate,
    currency,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;