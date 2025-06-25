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
  const currency = "GH₵";
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
    const dateArray = slotDate.split("_");

    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
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
