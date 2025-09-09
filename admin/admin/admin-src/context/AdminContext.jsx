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
    const [programs, setPrograms] = useState([])
    
 
    const [loading, setLoading] = useState(false); 
    const [programsLoading, setProgramsLoading] = useState(false); 
    const [error, setError] = useState(null);
    const [donationAnalytics, setDonationAnalytics] = useState({});
    const [donationLoading, setDonationLoading] = useState(false);

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

    // Program Management Functions with proper loading states
    const getAllPrograms = async () => {
        try {
            setProgramsLoading(true); // Set loading to true when starting
            setError(null);
            
            console.log('Fetching programs...');
            const {data} = await axios.get(`${backendUrl}/api/admin/programs`, {headers: {aToken}})
            
            if(data.success){
                console.log('Programs fetched successfully:', data.programs);
                setPrograms(data.programs)
            } else {
                console.log('Error fetching programs:', data.message);
                toast.error(data.message)
                setError(data.message);
            }
        } catch (error) {
            console.log('Exception while fetching programs:', error)
            toast.error(error.message)
            setError(error.message);
        } finally {
            setProgramsLoading(false); // Always set loading to false when done
            console.log('Programs loading completed');
        }
    }
const addProgram = async (formData) => {
  try {
    setLoading(true);
    
    const response = await axios.post(`${backendUrl}/api/admin/add-program`, formData, {headers: {aToken}});

    const data = response.data;
    
    if (data.success) {
      toast.success(data.message);
      await getAllPrograms(); // Refresh the programs list
      return { success: true };
    } else {
      toast.error(data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Error adding program:', error);
    const errorMessage = error.response?.data?.message || 'Failed to add program. Please try again.';
    toast.error(errorMessage);
    return { success: false, message: errorMessage };
  } finally {
    setLoading(false);
  }
};

const updateProgram = async (programId, formData) => {
  try {
    setLoading(true);
    
    const response = await axios.put(`${backendUrl}/api/admin/update-program/${programId}`, formData, {headers: {aToken}});

    const data = response.data;
    
    if (data.success) {
      toast.success(data.message);
      await getAllPrograms(); // Refresh the programs list
      return { success: true };
    } else {
      toast.error(data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Error updating program:', error);
    const errorMessage = error.response?.data?.message || 'Failed to update program. Please try again.';
    toast.error(errorMessage);
    return { success: false, message: errorMessage };
  } finally {
    setLoading(false);
  }
};


const deleteProgram = async (programId) => {
  try {
    setLoading(true);
    
    const response = await axios.delete(`${backendUrl}/api/admin/delete-program/${programId}`, {headers: {aToken}});

    const data = response.data;
    
    if (data.success) {
      toast.success(data.message);
      await getAllPrograms(); // Refresh the programs list
      return { success: true };
    } else {
      toast.error(data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Error deleting program:', error);
    const errorMessage = error.response?.data?.message || 'Failed to delete program. Please try again.';
    toast.error(errorMessage);
    return { success: false, message: errorMessage };
  } finally {
    setLoading(false);
  }
};

 const getDonationAnalytics = async () => {
    try {
        setDonationLoading(true);
        const {data} = await axios.get(`${backendUrl}/api/admin/donation-analytics`, {headers: {aToken}})
        
        if(data.success){
            setDonationAnalytics(data.analytics)
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    } finally {
        setDonationLoading(false);
    }
}

    const value ={
        aToken, 
        setAToken, 
        backendUrl, 
        counsellors, 
        getAllCounsellors, 
        changeAvailability, 
        appointments, 
        getAllAppointments, 
        dashboardData, 
        getDashboardData, 
        fetchPendingCounsellors, 
        pendingCounsellors, 
        setPendingCounsellors, 
        loading, 
        error,
        // Program management
        programs,
        setPrograms,
        getAllPrograms,
        addProgram,
        updateProgram,
        deleteProgram,
        programsLoading,

        getDonationAnalytics,
        donationAnalytics,
        donationLoading
    }

    return(
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export { AdminContextProvider }
export default AdminContextProvider