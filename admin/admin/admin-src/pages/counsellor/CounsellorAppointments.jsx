import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CounsellorContext } from '../../context/CounsellorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { toast } from "react-toastify";

const CounsellorAppointments = () => {
  const navigate = useNavigate();
  const {
    appointments,
    cToken,
    getCounsellorAppointments,
    completeAppointment,
    cancelAppointment,
    assessUser,
  } = useContext(CounsellorContext);

  const { calculateAge, currency, formattedDateUniversal } = useContext(AppContext);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cToken) {
      getCounsellorAppointments();
    }
  }, [cToken, getCounsellorAppointments]);

  const handleAssessUser = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setLoading(true);
    const data = await assessUser(selectedUserId, score);

    if (data.success) {
      toast.success(data.message);
      setScore('');
      setSelectedUserId(null); // Close the modal
    } else {
      toast.error(data.message);
    }

    setLoading(false);
  };

  const handleOpenAssessment = (userId, e) => {
    e.stopPropagation(); // Prevent row click when clicking assess button
    setSelectedUserId(userId);
  };

  const handleCloseAssessment = () => {
    setSelectedUserId(null);
    setScore('');
  };

  const handleRowClick = (appointment) => {
    // Navigate to client profile with appointment data
    navigate(`/counsellor/client-profile/${appointment.userData?._id}`, {
      state: { 
        appointmentData: appointment,
        clientData: appointment.userData 
      }
    });
  };

  const handleActionClick = (e, action, appointmentId) => {
    e.stopPropagation(); // Prevent row click when clicking action buttons
    if (action === 'cancel') {
      cancelAppointment(appointmentId);
    } else if (action === 'complete') {
      completeAppointment(appointmentId);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-4 sm:p-6 lg:p-8">
      <p className="mb-6 text-2xl font-semibold text-blue-500">All Appointments</p>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-4 py-4 px-6 bg-gray-50 text-gray-700 font-medium text-sm border-b border-gray-200">
          <p>#</p>
          <p>Client</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {/* Empty state */}
        {appointments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto">
            {appointments.map((item, index) => (
              <div 
                key={item._id || index} 
                className="flex flex-col sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-4 items-start sm:items-center text-gray-700 py-4 px-6 border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                onClick={() => handleRowClick(item)}
                title="Click to view client profile"
              >
                <p className="sm:hidden font-semibold text-gray-800">#:</p>
                <p className="font-semibold sm:font-normal">{index + 1}.</p>

                {/* Client */}
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <p className="sm:hidden font-semibold text-gray-800">Client:</p>
                  <img
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    src={item.userData?.image || assets.profile_placeholder}
                    alt="Client Profile"
                    onError={(e) => { e.target.onerror = null; e.target.src = assets.profile_placeholder; }}
                  />
                  <p className="text-base font-medium text-blue-600">{item.userData?.name || 'N/A'}</p>
                </div>

                {/* Payment */}
                <div className="mt-2 sm:mt-0">
                  <p className="sm:hidden font-semibold text-gray-800">Payment:</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.payment ? 'bg-green-100 text-green-800 border border-green-500' : 'bg-red-100 text-red-800 border border-red-500'
                    }`}
                  >
                    {item.payment ? 'Paid' : 'Not Paid'}
                  </span>
                </div>

                {/* Age */}
                <div className="mt-2 sm:mt-0">
                  <p className="sm:hidden font-semibold text-gray-800">Age:</p>
                  <p>{item.userData?.dob ? calculateAge(item.userData.dob) : "N/A"}</p>
                </div>

                {/* Date & Time */}
                <div className="mt-2 sm:mt-0">
                  <p className="sm:hidden font-semibold text-gray-800">Date & Time:</p>
                  <p>{formattedDateUniversal(item.slotDate)}, {item.slotTime}</p>
                </div>

                {/* Fees */}
                <div className="mt-2 sm:mt-0">
                  <p className="sm:hidden font-semibold text-gray-800">Fees:</p>
                  <p className="font-medium">{currency} {item.amount}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  {item.cancelled ? (
                    <p className='text-red-400 text-sm font-medium'>Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className='text-green-500 text-sm font-medium'>Completed</p>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <img
                          onClick={(e) => handleActionClick(e, 'cancel', item._id)}
                          className='w-8 h-8 cursor-pointer p-1 rounded-full hover:bg-red-100'
                          src={assets.cancel_icon}
                          alt='Cancel Appointment'
                          title='Cancel Appointment'
                        />
                        <img
                          onClick={(e) => handleActionClick(e, 'complete', item._id)}
                          className='w-8 h-8 cursor-pointer p-1 rounded-full hover:bg-green-100'
                          src={assets.tick_icon}
                          alt='Complete Appointment'
                          title='Complete Appointment'
                        />
                      </div>
                      <button
                        className="text-xs text-blue-600 hover:underline mt-1"
                        onClick={(e) => handleOpenAssessment(item.userData?._id, e)}
                      >
                        Assess User
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assessment Form Modal */}
      {selectedUserId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-6 bg-white w-96 max-w-full mx-auto rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">Assess User</h3>
            <form onSubmit={handleAssessUser}>
              <div className="mb-4">
                <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Score (1-100)
                </label>
                <input
                  id="score"
                  type="number"
                  placeholder="e.g., 90"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                  min={1}
                  max={100}
                />
              </div>
              <div className="flex justify-between items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseAssessment}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
                >
                  {loading ? 'Submitting...' : 'Submit Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounsellorAppointments;