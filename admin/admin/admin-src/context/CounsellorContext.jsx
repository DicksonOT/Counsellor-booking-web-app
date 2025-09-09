import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const CounsellorContext = createContext()

const CounsellorContextProvider = (props) => {
    const [cToken, setCToken] = useState(localStorage.getItem('cToken') ? localStorage.getItem('cToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashInfo, setDashInfo] = useState(false)
    const [counsellorInfo, setCounsellorInfo] = useState(false)
    const backendUrl = "http://localhost:4000"

    const getCounsellorAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/counsellor/counsellor-appointments`, { headers: { cToken } })

            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Add the missing getClientAppointments function
    const getClientAppointments = async (userId) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/counsellor/client-appointments/${userId}`, { headers: { cToken } })
            
            if (data.success) {
                return data.appointments;
            } else {
                toast.error(data.message)
                return [];
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return [];
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/counsellor/cancel-appointment`, { appointmentId }, { headers: { cToken } })
            if (data.success) {
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

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/counsellor/complete-appointment`, { appointmentId }, { headers: { cToken } })
            if (data.success) {
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
            const { data } = await axios.get(`${backendUrl}/api/counsellor/counsellor-dashboard`, { headers: { cToken } })
            if (data.success) {
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
            const { data } = await axios.get(`${backendUrl}/api/counsellor/profile`, { headers: { cToken } })
            if (data.success) {
                setCounsellorInfo(data.profile)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const assessUser = async (userId, score) => {
        try {
            const { data } = await axios.patch(`${backendUrl}/api/counsellor/assess-user`, { userId, score: Number(score) }, {
                headers: { cToken },
            });

            return data;
        } catch (error) {
            console.error(error);
            return { success: false, message: '❌ Failed to submit assessment' };
        }
    };

    const getClientProfile = async (userId) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/counsellor/client-profile/${userId}`, {
                headers: { cToken }
            });
            return data;
        } catch (error) {
            console.log(error);
            return { success: false, message: error.response?.data?.message || 'Error fetching client profile' };
        }
    };

const getClientSessions = async (userId) => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/counsellor/client/${userId}/sessions`, {
      headers: { cToken }
    });
    return data;
  } catch (error) {
    console.log(error);
    return { success: false, message: error.response?.data?.message || 'Failed to fetch client sessions' };
  }
};

const createOnlineSession = async (sessionData) => {
  try {
    const { data } = await axios.post(`${backendUrl}/api/counsellor/create-session`, sessionData, {
      headers: { cToken }
    });
    return data;
  } catch (error) {
    console.log(error);
    return { success: false, message: error.response?.data?.message || 'Failed to create online session' };
  }
};

const getCounsellorSessions = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/counsellor/sessions`, {
      headers: { cToken }
    });
    return data;
  } catch (error) {
    console.log(error);
    return { success: false, message: error.response?.data?.message || 'Failed to fetch sessions' };
  }
};


const updateSessionStatus = async (sessionId, statusData) => {
  try {
    const { data } = await axios.put(`${backendUrl}/api/counsellor/session/${sessionId}/status`, statusData, {
      headers: { cToken }
    });
    return data;
  } catch (error) {
    console.log(error);
    return { success: false, message: error.response?.data?.message || 'Failed to update session status' };
  }
};

const startCall = async (sessionId) => {
  try {
    const { data } = await axios.put(`${backendUrl}/api/counsellor/session/${sessionId}/start-call`, {}, {
      headers: { cToken }
    });
    return data;
  } catch (error) {
    console.error(error);
    return { success: false, message: error.response?.data?.message || 'Failed to start call' };
  }
};

const getCounsellorClients = async (search = '') => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/counsellor/clients`, {
      headers: { cToken },
      params: search ? { search } : {}
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching counsellor clients:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch clients' 
    };
  }
};

    const value = {
        cToken, 
        setCToken, 
        backendUrl, 
        appointments, 
        setAppointments, 
        getCounsellorAppointments, 
        getClientAppointments, 
        completeAppointment, 
        cancelAppointment, 
        dashBoard, 
        dashInfo, 
        setDashInfo, 
        profileData, 
        counsellorInfo, 
        setCounsellorInfo, 
        assessUser, 
        getClientProfile, 
        createOnlineSession, 
        updateSessionStatus,
        getCounsellorSessions,
        getClientSessions, 
        startCall, 
        getCounsellorClients
    }

    return (
        <CounsellorContext.Provider value={value}>
            {props.children}
        </CounsellorContext.Provider>
    )
}

export default CounsellorContextProvider