import React, { useContext, useState, useEffect } from 'react'
import {AppContext} from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'


const MyAppointment = () => {
  const {backendUrl, token, getCounsellors} = useContext(AppContext)
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [appointments, setAppointments] = useState([])
  const months = ['','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const [seeMore, setSeeMore] = useState(false)
  const [seeMoreValue, setSeeMoreValue]= useState(3) 
  const navigate = useNavigate()

  const formattedDate = (slotDate) => {
    const dateArray = slotDate.split('_')

    return dateArray[0]+' '+ months[Number(dateArray[1])]+' '+dateArray[2]
  }

  const getUserAppointments = async () =>{
    try {

      const {data} = await axios(`${backendUrl}/api/user/appointments`, {headers: {token}})

      if(data.success){
        setAppointments(data.appointments.reverse()) 
        console.log(data.appointments)
      } else {
        toast.warn(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async(appointmentId) =>{
    try {
      const {data} = await axios.post(`${backendUrl}/api/user/cancel-appointment`, {appointmentId}, {headers: {token}})

      if(data.success){
        toast.success(data.message)
        getUserAppointments()
        getCounsellors()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const appointmentStripePay = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/payment-stripe`, { appointmentId }, { headers: {token } })

      if (data.success) {
        window.location.href = data.url
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  };

  // PAYMENT VERIFICATION
  const verifyPayment = async () => {
      try {
        const { data } = await axios.post(`${backendUrl}/api/user/verify-payment`, {sessionId})

        if (data.success) {
          toast.success(data.message)
          getUserAppointments()
          navigate('/my-appointment')
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.error( error)
        toast.error(error.message)
      }
    }

  useEffect(() => {
  if (sessionId) {
    verifyPayment()
  }
}, [sessionId])

  useEffect(()=>{
    if(token){
      getUserAppointments()
    }
  },[token])

  return (
    <div>
      <p className='pb-3 mt-10 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        { appointments.slice(0, seeMoreValue).map((item, index)=>(
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap6 py-2 border-b mt-2' key={index}>
            <div>
            <img className='w-40 bg-indigo-50 border border-blue-200 rounded-lg' src={item.counData.image} alt=''/>
            </div>
            <div className='flex-1 text;sm text-zinc-600 mt-6'>
              <p className='text-neutral-800 font-semibold'>{item.counData.name}</p>
              <p className='text-zinc-700 font-medium mt-1'>Degree: </p>
              <p className='text-sm mt-1'>{item.degree}</p>
              <p>{item.counData.speacialty}</p>
              <p className='text-zinc-700 font-medium mt-1'>Location:</p>
              <p className='text-xs'>{item.counData.location}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time: </span>{formattedDate(item.slotDate)} |{item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-center'>

              {!item.cancelled && item.payment && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button> }
              {!item.cancelled && !item.payment && <button  onClick={()=>appointmentStripePay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-blue-300 hover:text-white  transition-all duration-300'> Pay Online </button>}
              {!item.cancelled && <button onClick={()=> cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-lg hover:bg-red-500 hover:text-white  transition-all duration-300'> Cancel Appointment </button>}
              {item.cancelled && <button className='sm:min-w-48 py-2 border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
            </div>
          </div>
        ))}
      </div>
      
        <div className='flex justify-center'>
          {seeMore ? <button onClick={()=> {setSeeMore(false); setSeeMoreValue(3)}} className='bg-blue-500 text-white text-base rounded-full py-2 px-10 mt-10 cursor-pointer'>Show less</button> : <button onClick={()=> {setSeeMore(true); setSeeMoreValue(10)}} className='bg-blue-500 text-white text-base rounded-full py-2 px-10 mt-10 cursor-pointer'>Show More</button>}
        </div>
    </div>
  )
}

export default MyAppointment