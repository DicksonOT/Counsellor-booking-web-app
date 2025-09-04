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

const formattedDateUniversal = (dateInput) => {
  // Handle null/undefined
  if (!dateInput) {
    console.warn('formattedDateUniversal received invalid date:', dateInput);
    return "Invalid Date";
  }

  try {
    // Check if it's the slot format (contains underscores)
    if (typeof dateInput === 'string' && dateInput.includes('_')) {
      const dateArray = dateInput.split("_");
      
      // Ensure we have the expected format (3 parts: day_month_year)
      if (dateArray.length !== 3) {
        console.warn('formattedDateUniversal received unexpected slot format:', dateInput);
        return "Invalid Date Format";
      }

      const day = dateArray[0];
      const monthIndex = Number(dateArray[1]);
      const year = dateArray[2];

      // Validate month index
      if (monthIndex < 1 || monthIndex > 12) {
        console.warn('formattedDateUniversal received invalid month:', monthIndex);
        return "Invalid Month";
      }

      return `${day} ${months[monthIndex]} ${year}`;
    } else {
      // Handle regular date (ISO string or Date object)
      const date = new Date(dateInput);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('formattedDateUniversal received invalid date:', dateInput);
        return "Invalid Date";
      }

      const day = date.getDate();
      const monthIndex = date.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
      const year = date.getFullYear();

      // Validate month index
      if (monthIndex < 1 || monthIndex > 12) {
        console.warn('formattedDateUniversal calculated invalid month:', monthIndex);
        return "Invalid Month";
      }

      return `${day} ${months[monthIndex]} ${year}`;
    }
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', dateInput);
    return "Date Error";
  }
};

  const value = {
    calculateAge,
    formattedDateUniversal,
    currency,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;