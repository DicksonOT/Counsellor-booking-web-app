import { createContext, useState, useCallback  } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) =>{

    const [aToken, setAToken]= useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const backendUrl= import.meta.env.VITE_BACKEND_URL
    const [counsellors, setCounsellors]=useState([])
    const [appointments, setAppointments] = useState([])
    const [dashboardData, setDashboardData] = useState(false)
    const [pendingCounsellors, setPendingCounsellors] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

      const fetchPendingCounsellors = useCallback (async () => {
        try {
          setLoading(true);
          setError(null);
    
        const {data} = await axios.get(`${backendUrl}/api/admin/pending-counsellors`, { headers: { aToken } } );
        if (data.success) {
         setPendingCounsellors(data.counsellors);
        }
          else {toast.error(data.message)} 
        } catch (error) {
          console.error('Error fetching counsellors:', error);
          setError(error.message || 'Failed to fetch pending applications');
        } finally {
          setLoading(false);
        }
      }, [backendUrl, aToken]);
    

    const value ={
        aToken, setAToken, backendUrl, counsellors, getAllCounsellors, changeAvailability, appointments, getAllAppointments, dashboardData, getDashboardData, fetchPendingCounsellors, pendingCounsellors, setPendingCounsellors, loading, error
    }

    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider