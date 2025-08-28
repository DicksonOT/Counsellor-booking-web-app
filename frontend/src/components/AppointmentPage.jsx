import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedCounsellors from "./RelatedCounsellors";
import { toast } from "react-toastify";
import axios from "axios";

const AppointmentPage = () => {
  const { counId } = useParams();
  const { counsellors, currencySymbol, getCounsellors, backendUrl, token } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [counInfo, setCounInfo] = useState(null);
  const [counSlots, setCounSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [selectedSessionType, setSelectedSessionType] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const navigate = useNavigate();

  // Memoize counsellor info to prevent unnecessary re-renders
  const counsellorInfo = useMemo(() => {
    return counsellors.find(coun => coun._id === counId) || null;
  }, [counsellors, counId]);

  // Update counInfo when counsellorInfo changes
  useEffect(() => {
    setCounInfo(counsellorInfo);
    // Reset slot selection when counsellor changes
    setSlotIndex(0);
    setSlotTime("");
    // Set default session type
    if (counsellorInfo) {
      if (counsellorInfo.sessionType === 'hybrid') {
        setSelectedSessionType(""); // Force user to choose
      } else {
        setSelectedSessionType(counsellorInfo.sessionType);
      }
    }
  }, [counsellorInfo]);

  const getAvailableSlots = useCallback(() => {
    if (!counInfo) return;

    const slots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      // Set start time logic
      if (today.getDate() === currentDate.getDate()) {
        // For today, start from current hour + 1 or 10 AM, whichever is later
        const startHour = currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10;
        const startMinute = currentDate.getHours() > 10 && currentDate.getMinutes() > 30 ? 30 : 0;
        currentDate.setHours(startHour, startMinute, 0, 0);
      } else {
        // For future days, start at 10 AM
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        const slotTimeStr = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const slotDate = `${day}_${month}_${year}`;

        const isBooked = counInfo.slots_booked?.[slotDate]?.includes(slotTimeStr);

        if (!isBooked) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: slotTimeStr,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slots.push(timeSlots);
    }

    setCounSlots(slots);
  }, [counInfo]);

  const bookAppointment = useCallback(async () => {
    if (isBooking) return; // Prevent double booking
    
    try {
      if (!token) {
        toast.warn('Login to book appointment');
        return navigate('/login');
      }

      if (!slotTime || !counSlots[slotIndex] || counSlots[slotIndex].length === 0) {
        toast.error('Please select a valid time slot');
        return;
      }

      if (counInfo.sessionType === 'hybrid' && !selectedSessionType) {
        toast.error('Please select a session type');
        return;
      }

      setIsBooking(true);

      const selectedSlot = counSlots[slotIndex].find(slot => slot.time === slotTime);
      if (!selectedSlot) {
        toast.error('Selected time slot is no longer available');
        setIsBooking(false);
        return;
      }

      const date = selectedSlot.datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { 
          counId, 
          slotDate, 
          slotTime,
          sessionType: selectedSessionType 
        },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getCounsellors();
        navigate('/my-appointment');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to book appointment');
    } finally {
      setIsBooking(false);
    }
  }, [
    isBooking,
    token,
    slotTime,
    counSlots,
    slotIndex,
    counId,
    backendUrl,
    navigate,
    getCounsellors,
    selectedSessionType,
    counInfo
  ]);

  const handleSlotIndexChange = useCallback((index) => {
    setSlotIndex(index);
    setSlotTime(""); // Reset time selection when date changes
  }, []);

  const handleSlotTimeChange = useCallback((time) => {
    setSlotTime(time);
  }, []);

  const handleSessionTypeChange = useCallback((type) => {
    setSelectedSessionType(type);
  }, []);

  // Generate slots when counInfo changes
  useEffect(() => {
    getAvailableSlots();
  }, [getAvailableSlots]);

  if (!counInfo) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading counsellor information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 mx-5 mt-35 ">
      {/* Counsellor Details */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="sm:w-80 flex-shrink-0">
          <img
            className="w-full sm:h-100 object-cover rounded-lg bg-blue-50 border border-blue-300"
            src={counInfo.image}
            alt={counInfo.name}
          />
        </div>

        <div className="border border-blue-300 rounded-lg p-6 bg-white sm:mt-0 mt-16 sm:-ml-0 relative z-10 w-full shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 pt-8">
                <h1 className="text-lg font-medium text-gray-900">{counInfo.name}</h1>
                <img className="w-5 h-5" src={assets.verified_icon} alt="Verified" />
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-sm text-gray-600">
                  {counInfo.degree} - {counInfo.specialty}
                </p>
                <span className="text-xs px-2 py-0.5 border border-blue-200 bg-blue-50 text-blue-700 rounded-full">
                  {counInfo.experience}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-medium text-gray-900">About</h2>
              <img src={assets.info_icon} alt="Information" className="w-4 h-4" />
            </div>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">{counInfo.about}</p>
          </div>

          <p className="mt-4 text-gray-600">
            Appointment Fee:{" "}
            <span className="font-medium text-blue-600">
              {currencySymbol}
              {counInfo.fees}
            </span>
          </p>

          {/* Location Display */}
          <div className="mt-4">
            <p className="text-gray-600 mb-2">
              Location:{" "}
            </p>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-700 text-sm">{counInfo.location}</span>
            </div>
          </div>

          {/* Session Type Display */}
          <div className="mt-4">
            <p className="text-gray-600 mb-2">
              Session Type:{" "}
            </p>
            <div className="flex flex-wrap gap-2">
              {counInfo.sessionType === 'online' && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                  🌐 Online
                </span>
              )}
              {counInfo.sessionType === 'physical' && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                  🏢 In-Person
                </span>
              )}
              {counInfo.sessionType === 'hybrid' && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium border border-purple-200">
                  🔄 Hybrid (Online & In-Person)
                </span>
              )}
            </div>
          </div>

          {/* Preferred Time Slots Display */}
          {counInfo.preferredSlots && counInfo.preferredSlots.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Preferred Time Slots</h3>
              <div className="space-y-2">
                {counInfo.preferredSlots.map((slot, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-800">
                          {slot.start} - {slot.end}
                        </span>
                      </div>
                    </div>
                    {slot.note && (
                      <p className="text-xs text-gray-600 mt-1 italic">{slot.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3">
            {counInfo.available ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-base text-green-600 font-medium">Available</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-base text-red-600 font-medium">Not Available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Slots */}
      {counInfo.available && (
        <div className="mt-8 sm:ml-80">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Booking slots</h2>

          {/* Session Type Selection for Hybrid */}
          {counInfo.sessionType === 'hybrid' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Choose Session Type</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleSessionTypeChange('online')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedSessionType === 'online'
                      ? "bg-blue-500 text-white shadow-md transform scale-105"
                      : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                  }`}
                >
                  <span className="text-base">🌐</span>
                  Online Session
                </button>
                <button
                  onClick={() => handleSessionTypeChange('physical')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedSessionType === 'physical'
                      ? "bg-blue-500 text-white shadow-md transform scale-105"
                      : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 hover:border-blue-400"
                  }`}
                >
                  <span className="text-base">🏢</span>
                  In-Person Session
                </button>
              </div>
              {selectedSessionType === 'online' && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    📹 You'll receive a video call link after booking confirmation
                  </p>
                </div>
              )}
              {selectedSessionType === 'physical' && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    📍 Please arrive 10 minutes early at the counsellor's office
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Date Selection */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Date</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {counSlots.map((slots, index) => (
                <button
                  key={index}
                  onClick={() => handleSlotIndexChange(index)}
                  className={`flex flex-col items-center justify-center min-w-20 py-3 px-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    slotIndex === index
                      ? "bg-blue-500 text-white shadow-md transform scale-105"
                      : slots.length === 0
                      ? "border border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                      : "border border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700"
                  }`}
                  disabled={slots.length === 0}
                >
                  <span className="text-xs font-medium">
                    {slots[0] && daysOfWeek[slots[0].datetime.getDay()]}
                  </span>
                  <span className="text-sm font-medium">
                    {slots[0] && slots[0].datetime.getDate()}
                  </span>
                  {slots.length === 0 && (
                    <span className="text-xs text-gray-400">No slots</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Time</h3>
            {counSlots[slotIndex]?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {counSlots[slotIndex].map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotTimeChange(slot.time)}
                    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-200 font-medium ${
                      slot.time === slotTime
                        ? "bg-blue-500 text-white shadow-md transform scale-105"
                        : "border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    {slot.time.toLowerCase()}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <p className="text-gray-600">No available time slots for this date</p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              bookAppointment();
              window.scrollTo(0, 0);
            }}
            disabled={
              !slotTime || 
              isBooking || 
              !counInfo.available || 
              (counInfo.sessionType === 'hybrid' && !selectedSessionType)
            }
            className={`px-8 py-3 rounded-lg text-white text-sm font-medium transition-all duration-200 ${
              slotTime && !isBooking && counInfo.available && (counInfo.sessionType !== 'hybrid' || selectedSessionType)
                ? "bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isBooking ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Booking...
              </span>
            ) : (
              "Book Appointment"
            )}
          </button>
        </div>
      )}

      {!counInfo.available && (
        <div className="mt-8 sm:ml-80 p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-lg">⚠️</span>
            </div>
            <div>
              <p className="text-red-800 font-medium">
                This counsellor is currently not available for appointments.
              </p>
              <p className="text-red-600 text-sm mt-1">
                Please check back later or browse other available counsellors.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Related Counsellors */}
      <RelatedCounsellors counId={counId} specialty={counInfo.specialty} />
    </div>
  );
};

export default AppointmentPage;