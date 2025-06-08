import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export const CounsellorContext = createContext()

const CounsellorContextProvider = (props) => {
    const [cToken,setCToken] = useState(localStorage.getItem('cToken') ?localStorage.getItem('cToken') :'')
    const [appointments, setAppointments] = useState([])
    const [dashInfo, setDashInfo] = useState(false)
    const [counsellorInfo, setCounsellorInfo] = useState(false)
    const backendUrl= import.meta.env.VITE_BACKEND_URL
    
    const getCounsellorAppointments = async () =>{
        try {
            const {data} = await axios.get(`${backendUrl}/api/counsellor/counsellor-appointments`, {headers: {cToken}})

            if (data.success){
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId)=> {
        try {
            const {data} = await axios.post(`${backendUrl}/api/counsellor/cancel-appointment`, {appointmentId}, {headers: {cToken}})
            if (data.success){
                toast.success(data.message)
                getCounsellorAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const completeAppointment = async (appointmentId)=> {
        try {
            const {data} = await axios.post(`${backendUrl}/api/counsellor/complete-appointment`, {appointmentId},{headers: {cToken}})
            if (data.success){
                toast.success(data.message)
                getCounsellorAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const dashBoard = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/counsellor/counsellor-dashboard`, {headers: {cToken}})
            if (data.success){
                setDashInfo(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const profileData = async () => {
        try {
            const {data} = await axios.get (`${backendUrl}/api/counsellor/profile`, {headers: {cToken}})
            if(data.success){
                setCounsellorInfo(data.profile)
                console.log(data.profile)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const value = {
        cToken,setCToken, backendUrl, appointments, setAppointments, getCounsellorAppointments, completeAppointment, cancelAppointment, dashBoard, dashInfo, setDashInfo, profileData, counsellorInfo, setCounsellorInfo
    }

    return(
        <CounsellorContext.Provider value={value}>
            {props.children}
        </CounsellorContext.Provider>
    )
}

export default CounsellorContextProvider