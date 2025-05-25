import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) =>{

    const [aToken, setAToken]= useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const backendUrl= import.meta.env.VITE_BACKEND_URL
    const [counsellors, setCounsellors]=useState([])
    const [appointments, setAppointments] = useState([])
    const [dashboardData, setDashboardData] = useState(false)

    const getAllCounsellors = async () => {
        try {
            const {data} = await axios.post(`${backendUrl}/api/admin/all-counsellors`, {}, {headers: {aToken}})

            if(data.success){
                setCounsellors(data.counsellors)

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }


    }
     
    const changeAvailability = async (counId) => {
        try {
            const {data} = await axios.post(`${backendUrl}/api/admin/change-availability`, {counId}, {headers: {aToken}})
            if (data.success){
                toast.success(data.message)
                getAllCounsellors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getAllAppointments = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/admin/get-all-appointments`, {headers: {aToken}})
            
            if(data.success){
                setAppointments(data.appointmentData.reverse())
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getDashboardData = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/admin/dashboard`, {headers: {aToken}})

            if(data.success){
                setDashboardData(data.dashboardData)
                console.log(data.dashboardData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value ={
        aToken, setAToken, backendUrl, counsellors, getAllCounsellors, changeAvailability, appointments, getAllAppointments, dashboardData, getDashboardData
    }

    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider