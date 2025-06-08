import React, { useContext, useEffect } from 'react';
import { CounsellorContext } from '../../context/CounsellorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const CounsellorAppointments = () => {
  const { appointments, cToken, getCounsellorAppointments, completeAppointment, cancelAppointment } = useContext(CounsellorContext);

  const { calculateAge, currency, formattedDate } = useContext(AppContext);

  useEffect(() => {
    if (cToken) {
      getCounsellorAppointments();
    }
  }, [cToken, getCounsellorAppointments]); // Added getCounsellorAppointments to dependency array for best practice

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8"> {/* Adjusted margin for better centering and added padding */}
      <p className="mb-6 text-2xl font-semibold text-gray-800">All Appointments</p> {/* Increased font size and adjusted margin */}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"> {/* Added shadow and refined border */}
        {/* Table Header for larger screens */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-4 py-4 px-6 bg-gray-50 text-gray-700 font-medium text-sm border-b border-gray-200">
          <p>#</p>
          <p>Client</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {/* Conditional rendering for no appointments */}
        {appointments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No appointments found.</p>
            <p>Check back later or ensure you are logged in.</p>
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto"> {/* Added overflow-y-auto for scrollable body */}
            {/* Map through appointments and render each item */}
            {appointments.map((item, index) => (
              <div
                key={item._id || index} // Use item._id for a stable key if available, fallback to index
                className="flex flex-col sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-4 items-start sm:items-center text-gray-700 py-4 px-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Mobile Labels for better readability on small screens */}
                <p className="sm:hidden font-semibold text-gray-800">#:</p>
                <p className="font-semibold sm:font-normal">{index + 1}.</p>

                {/* Client */}
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <p className="sm:hidden font-semibold text-gray-800">Client:</p>
                  <img
                    className="w-10 h-10 rounded-full object-cover border border-gray-300" // Increased size, added object-cover and border
                    src={item.userData?.image || assets.profile_placeholder} // Added optional chaining and placeholder
                    alt="Client Profile"
                    onError={(e) => { e.target.onerror = null; e.target.src = assets.profile_placeholder; }} // Fallback on error
                  />
                  <p className="text-base font-medium">{item.userData?.name || 'N/A'}</p> {/* Added optional chaining and N/A */}
                </div>

                {/* Payment */}
                <div className="mt-2 sm:mt-0">
                  <p className="sm:hidden font-semibold text-gray-800">Payment:</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.payment
                        ? 'bg-green-100 text-green-800 border border-green-500'
                        : 'bg-red-100 text-red-800 border border-red-500'
                    }`}
                  >
                    {item.payment ? 'Paid' : 'Not Paid'}
                  </span>
                </div>

                {/* Age */}
                <div className="mt-2 sm:mt-0">
                  <p className="sm:hidden font-semibold text-gray-800">Age:</p>
                  <p>{item.userData?.dob ? calculateAge(item.userData.dob) : "N/A"}</p> {/* Added optional chaining */}
                </div>

                {/* Date & Time */}
                <div className="mt-2 sm:mt-0">
                  <p className="sm:hidden font-semibold text-gray-800">Date & Time:</p>
                  <p>{formattedDate(item.slotDate)}, {item.slotTime}</p>
                </div>

                {/* Fees */}
                <div className="mt-2 sm:mt-0">
                  <p className="sm:hidden font-semibold text-gray-800">Fees:</p>
                  <p className="font-medium">{currency} {item.amount}</p>
                </div>

                {/* Actions */}
                {
                  item.cancelled 
                  ?<p className='text-red-400 text-sm font-medium'>Cancelled</p>
                  : item.isCompleted
                  ? <p className='text-green-500 text-sm font-medium'>Completed</p>
                  : <div className="flex gap-2 mt-2 sm:mt-0">
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className='w-8 h-8 cursor-pointer p-1 rounded-full hover:bg-red-100 transition-colors duration-200' // Adjusted size, added padding, hover effect
                    src={assets.cancel_icon}
                    alt='Cancel Appointment'
                    title='Cancel Appointment'
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className='w-8 h-8 cursor-pointer p-1 rounded-full hover:bg-green-100 transition-colors duration-200' // Adjusted size, added padding, hover effect
                    src={assets.tick_icon}
                    alt='Complete Appointment'
                    title='Complete Appointment'
                  />
                </div>
                }
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CounsellorAppointments;
