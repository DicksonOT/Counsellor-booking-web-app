import React from "react";
import { useContext } from "react";
import { use } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";

const AppointmentData = () => {
  const { appointments, getAllAppointments, aToken } = useContext(AdminContext);
  const { calculateAge, formattedDate, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);
  console.log(appointments.userData);
  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[90vh] min-h-[60vh] overflow-x-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>User</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Counsellor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {appointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-start sm:items-center text-gray-600 py-4 px-6 border-b hover:bg-gray-100"
          >
            <p className="sm:block font-semibold">{index + 1}.</p>

            {/* User */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <img className="w-8 rounded-full" src={item.userData.image} alt=""/>
                <p>{item.userData.name}</p>
              </div>
            </div>

            {/* Age */}
            <div className="flex flex-col">
              <p>{item.userData.dob ? calculateAge(item.userData.dob) : "N/A"}</p>
            </div>

            {/* Date & Time */}
            <div className="flex flex-col">
              <p>{formattedDate(item.slotDate)}, {item.slotTime}</p>
            </div>

            {/* Counsellor */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <img className="w-9 h-9 rounded-full bg-gray-200" src={item.counData.image} alt="" />
                <p>{item.counData.name}</p>
              </div>
            </div>

            {/* Fees */}
            <div className="flex flex-col">
              <p>{currency} {item.amount}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col">
              {
                item.cancelled 
                ? <p className="text-red-400 text-xs font-medium">Cancelled</p>
                : <p>...</p>
              } 
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentData;
