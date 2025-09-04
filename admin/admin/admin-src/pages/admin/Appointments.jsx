import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";

const AppointmentData = () => {
  const { appointments, getAllAppointments, aToken } = useContext(AdminContext);
  const { calculateAge, formattedDateUniversal, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="m-2 sm:m-5">
      <p className="mb-3 text-lg text-blue-500 font-semibold">All Appointments</p>


      {/* Summary Stats */}
      {appointments.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-xl font-bold text-gray-900">{appointments.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-xl font-bold text-green-600">
              {appointments.filter(item => item.isCompleted).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border  border-blue-200 shadow-sm">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-xl font-bold text-blue-600">
              {appointments.filter(item => !item.cancelled && !item.isCompleted).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border  border-blue-200 shadow-sm">
            <p className="text-sm text-gray-600">Paid</p>
            <p className="text-xl font-bold text-green-600">
              {appointments.filter(item => item.payment).length}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border  border-blue-200 rounded text-sm max-h-[90vh] min-h-[60vh] overflow-x-auto mt-5">
        {/* Desktop Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-blue-200 bg-blue-50 font-medium text-gray-700">
          <p>#</p>
          <p>User</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Counsellor</p>
          <p>Fees</p>
          <p>Payment</p>
          <p>Status</p>
        </div>

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">No appointments found</p>
              <p className="text-gray-400 text-sm mt-1">Appointments will appear here when users book sessions</p>
            </div>
          </div>
        ) : (
          appointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:grid sm:grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1fr_1fr] items-start sm:items-center text-gray-600 py-4 px-6 border-b  border-blue-200 hover:bg-gray-50 transition-colors duration-200"
            >
              {/* Index */}
              <div className="sm:block">
                <span className="sm:hidden text-xs font-medium text-gray-500 uppercase tracking-wider">No:</span>
                <p className="font-semibold text-gray-800">{index + 1}</p>
              </div>

              {/* User */}
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <span className="sm:hidden text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">User:</span>
                <div className="flex items-center gap-2">
                  <img 
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200" 
                    src={item.userData?.image || "/default-avatar.png"} 
                    alt={item.userData?.name || "User"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <p className="font-medium text-gray-800">{item.userData?.name || "Unknown User"}</p>
                </div>
              </div>

              {/* Age */}
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <span className="sm:hidden text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Age:</span>
                <p className="text-gray-700">{item.userData?.dob ? `${calculateAge(item.userData.dob)} yrs` : "N/A"}</p>
              </div>

              {/* Date & Time */}
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <span className="sm:hidden text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Date & Time:</span>
                <div className="flex flex-col">
                  <p className="text-gray-800 font-medium">{formattedDateUniversal(item.slotDate)}</p>
                  <p className="text-gray-600 text-xs">{item.slotTime}</p>
                </div>
              </div>

              {/* Counsellor */}
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <span className="sm:hidden text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Counsellor:</span>
                <div className="flex items-center gap-2">
                  <img 
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-200" 
                    src={item.counData?.image || "/default-counsellor.png"} 
                    alt={item.counData?.name || "Counsellor"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-counsellor.png";
                    }}
                  />
                  <p className="font-medium text-gray-800">{item.counData?.name || "Unknown Counsellor"}</p>
                </div>
              </div>

              {/* Fees */}
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <span className="sm:hidden text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Fees:</span>
                <p className="font-semibold text-gray-800">{currency}{item.amount || 0}</p>
              </div>

              {/* Payment Status */}
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <span className="sm:hidden text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Payment:</span>
                <div className="flex items-center">
                  {item.payment ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Not Paid
                    </span>
                  )}
                </div>
              </div>

              {/* Appointment Status */}
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <span className="sm:hidden text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Status:</span>
                <div className="flex items-center">
                  {item.cancelled ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentData;