import React, { useContext, useEffect, useState } from 'react';
import { CounsellorContext } from '../../context/CounsellorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { toast } from "react-toastify";

const CounsellorAppointments = () => {
  const {
    appointments,
    cToken,
    getCounsellorAppointments,
    completeAppointment,
    cancelAppointment,
    assessUser,
  } = useContext(CounsellorContext);

  const { calculateAge, currency, formattedDate } = useContext(AppContext);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (cToken) {
      getCounsellorAppointments();
    }
  }, [cToken, getCounsellorAppointments]);

  const handleAssessUser = async (e, userId) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const data = await assessUser(userId, score);

    if (data.success) {
      toast.success(data.message);
      setScore('');
      setSelectedUserId(null); // Close form after assessment
    } else {
      toast.error(data.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <p className="mb-6 text-2xl font-semibold text-gray-800">All Appointments</p>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-4 py-4 px-6 bg-gray-50 text-gray-700 font-medium text-sm border-b border-gray-200">
          <p>#</p>
          <p>Client</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="max-h-[70vh] overflow-y-auto">
            {appointments.map((item, index) => (
              <div key={item._id || index} className="flex flex-col sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1fr] gap-4 items-start sm:items-center text-gray-700 py-4 px-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
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
                  <p className="text-base font-medium">{item.userData?.name || 'N/A'}</p>
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
                  <p>{formattedDate(item.slotDate)}, {item.slotTime}</p>
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
                          onClick={() => cancelAppointment(item._id)}
                          className='w-8 h-8 cursor-pointer p-1 rounded-full hover:bg-red-100'
                          src={assets.cancel_icon}
                          alt='Cancel Appointment'
                          title='Cancel Appointment'
                        />
                        <img
                          onClick={() => completeAppointment(item._id)}
                          className='w-8 h-8 cursor-pointer p-1 rounded-full hover:bg-green-100'
                          src={assets.tick_icon}
                          alt='Complete Appointment'
                          title='Complete Appointment'
                        />
                      </div>
                      <button
                        className="text-xs text-blue-600 hover:underline mt-1"
                        onClick={() => setSelectedUserId(item.userData?._id)}
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

      {/* Assessment Form (Inline at bottom) */}
      {selectedUserId && (
        <form onSubmit={(e) => handleAssessUser(e, selectedUserId)} className="mt-6 max-w-md mx-auto bg-white p-4 border rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Assess User</h3>
          <input
            type="number"
            placeholder="Enter score"
            className="w-full border rounded p-2 mb-2"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
            min={1}
          />
          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {loading ? 'Submitting...' : 'Submit Assessment'}
            </button>
            <button
              type="button"
              onClick={() => { setSelectedUserId(null); setScore(''); }}
              className="text-sm text-gray-600 underline"
            >
              Cancel
            </button>
          </div>
          {message && <p className="mt-2 text-sm text-center">{message}</p>}
        </form>
      )}
    </div>
  );
};

export default CounsellorAppointments;
