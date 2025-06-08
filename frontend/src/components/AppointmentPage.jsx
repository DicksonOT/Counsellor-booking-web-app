import React, { useContext, useEffect, useState } from "react";
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
  const navigate = useNavigate()

  const fetchCounInfo = () => {
    const info = counsellors.find(coun => coun._id === counId);
    setCounInfo(info || null);
  };

  const getAvailableSlots = () => {
    if (!counInfo) return;

    const slots = [];
    const today = new Date();

  for (let i = 0; i < 7; i++) {
    let currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    let endTime = new Date(currentDate);
    endTime.setHours(21, 0, 0, 0);

    currentDate.setHours(
      today.getDate() === currentDate.getDate()
        ? (currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        : 10,
      today.getDate() === currentDate.getDate() && currentDate.getMinutes() > 30 ? 30 : 0
    );

    const timeSlots = [];

    while (currentDate < endTime) {
      const slotTimeStr = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      let day = currentDate.getDate()
      let month = currentDate.getMonth() + 1;
      let year = currentDate.getFullYear()
      const slotDate = `${day}_${month}_${year}`

      const isBooked = counInfo.slots_booked?.[slotDate]?.includes(slotTimeStr)

      if (!isBooked) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: slotTimeStr,
        })
      }

      currentDate.setMinutes(currentDate.getMinutes() + 30)
    }

    slots.push(timeSlots);
  }

    setCounSlots(slots);
  }

  const bookAppointment = async()=> {
    try {
      if(!token){
      toast.warn('Login to book appointment')
      return navigate('/login')
    }
    
      const date = counSlots[slotIndex][0].datetime

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day+'_'+month+'_'+year
      
      const {data} = await axios.post(`${backendUrl}/api/user/book-appointment`, {counId, slotDate, slotTime}, {headers: {token}})

      if(data.success){
        toast.success(data.message)
        getCounsellors()
        navigate('/my-appointment')
      } else(
        toast.error(data.message)
      )
     
    
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  useEffect(fetchCounInfo, [counsellors, counId]);
  useEffect(getAvailableSlots, [counInfo]);

  if (!counInfo) return <div className="p-4">Loading counsellor information...</div>;

  return (
    <div className="pb-8 mx-5 mt-19">
      {/* Counsellor Details */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="sm:w-80 flex-shrink-0">
          <img
            className="w-full sm:h-100 object-cover rounded-lg bg-blue-50 border border-blue-300"
            src={counInfo.image}
            alt=''
          />
        </div>

        <div className="border border-blue-300 rounded-lg p-6 bg-white sm:mt-0 mt-16 sm:-ml-0 relative z-10 w-full">
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
                <span className="text-xs px-2 py-0.5 border rounded-full">
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
            <p className="text-sm text-gray-600 mt-1">{counInfo.about}</p>
          </div>

          <p className="mt-4 text-gray-600">
            Appointment Fee:{" "}
            <span className="font-medium">
              {currencySymbol}
              {counInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="mt-8 sm:ml-80">
        <h2 className="text-lg font-medium text-gray-900">Booking slots</h2>
        
        {/* Date Selection */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {counSlots.map((slots, index) => (
            <button
              key={index}
              onClick={() => setSlotIndex(index)}
              className={`flex flex-col items-center justify-center min-w-20 py-3 rounded-lg cursor-pointer transition-colors ${
                slotIndex === index
                  ? "bg-blue-500 text-white"
                  : "border border-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="text-xs font-medium">
                {slots[0] && daysOfWeek[slots[0].datetime.getDay()]}
              </span>
              <span className="text-sm font-medium">
                {slots[0] && slots[0].datetime.getDate()}
              </span>
            </button>
          ))}
        </div>

        {/* Time Selection */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {counSlots[slotIndex]?.map((slot, index) => (
            <button
              key={index}
              onClick={() => setSlotTime(slot.time)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                slot.time === slotTime
                  ? "bg-blue-500 text-white"
                  : "border border-gray-500 text-gray-800 hover:bg-gray-100"
              }`}
            >
              {slot.time.toLowerCase()}
            </button>
          ))}
        </div>

        <button
          onClick={()=> {bookAppointment(); window.scrollTo(0,0)}}
          disabled={!slotTime}
          className={`mt-6 px-8 py-2 rounded-full text-white text-sm font-medium ${
            slotTime ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          } transition-colors`}
        >
          Book Appointment
        </button>
      </div>

      {/* Related Counsellors */}
      <RelatedCounsellors counId={counId} specialty={counInfo.specialty} />
    </div>
  );
};

export default AppointmentPage;