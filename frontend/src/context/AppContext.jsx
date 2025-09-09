import { createContext } from "react";
import axios from 'axios'
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { reviews, team, stats, benefits } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const navigate = useNavigate()
    const [counsellors, setCounsellors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)
    const [assessment, setAssessment] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const service_id = import.meta.env.VITE_SERVICE_ID
    const template_id = import.meta.env.VITE_TEMPLATE_ID
    const public_key = import.meta.env.VITE_PUBLIC_KEY
    const currencySymbol = 'USD '

    console.log("Backend Url:", backendUrl)

    const getUserInfo = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/info`, { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getCounsellors = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/list`)

            if (data.success) {
                setCounsellors(data.counsellors)
            }

            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const chatbotAssessment = async () => {
        try {
            const { data } = await axios.patch(`${backendUrl}/api/user/assess-chatbot`, {}, { headers: { token } });

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const fetchAssessment = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-assessment`, { headers: { token } });
            if (data.success) {
                setAssessment(data.assessment);
                toast.success(data.message)
            }
        } catch (err) {
            console.error(err);
        } 
    };

    // ============= SESSION MANAGEMENT FUNCTIONS =============

    // Get user sessions
    const getUserSessions = async () => {
        try {
            if(token){
            const response = await axios.get(`${backendUrl}/api/user/sessions`, {
                headers: { token }
            });
            return response.data; }

            else{
                toast.info('Please login to continue')
                navigate('/login')            }
        } catch (error) {
            console.error('Error fetching user sessions:', error);
            return { success: false, message: 'Failed to fetch sessions' };
        }
    };

    // Join a session
    const joinSession = async (sessionId) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/join-session`, 
                { sessionId }, 
                { headers: { token } }
            );
            return response.data;
        } catch (error) {
            console.error('Error joining session:', error);
            return { success: false, message: 'Failed to join session' };
        }
    };

    // Book a new session
    const bookSession = async (bookingData) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/book-session`, 
                bookingData, 
                { headers: { token } }
            );
            return response.data;
        } catch (error) {
            console.error('Error booking session:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to book session' 
            };
        }
    };

    // Reschedule existing session
    const rescheduleSession = async (sessionId, newData) => {
        try {
            const response = await axios.patch(`${backendUrl}/api/user/sessions/${sessionId}/reschedule`, 
                newData, 
                { headers: { token } }
            );
            return response.data;
        } catch (error) {
            console.error('Error rescheduling session:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to reschedule session' 
            };
        }
    };

    // Cancel a session
    const cancelSession = async (sessionId) => {
        try {
            const response = await axios.patch(`${backendUrl}/api/user/sessions/${sessionId}/cancel`, 
                {}, 
                { headers: { token } }
            );
            return response.data;
        } catch (error) {
            console.error('Error cancelling session:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to cancel session' 
            };
        }
    };

    // Rate a completed session
    const rateSession = async (sessionId, rating, feedback = '') => {
        try {
            const response = await axios.patch(`${backendUrl}/api/user/sessions/${sessionId}/rate`, 
                { rating, feedback }, 
                { headers: { token } }
            );
            return response.data;
        } catch (error) {
            console.error('Error rating session:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to rate session' 
            };
        }
    };

    // ============= NOTIFICATION FUNCTIONS =============

    // Get user notifications
    const getUserNotifications = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/notifications`, {
                headers: { token }
            });
            return response.data; 
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return { success: false, notifications: [] };
        }
    };

    // Mark notification as read
    const markNotificationRead = async (notificationId) => {
        try {
            const response = await axios.patch(
                `${backendUrl}/api/user/notifications/${notificationId}/read`,
                {},
                { headers: { token } }
            );
            return response.data;
        } catch (error) {
            console.error('Error marking notification:', error.response?.data || error.message);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to update notification' 
            };
        }
    };

    // ============= WEBSOCKET FUNCTIONS =============

    // WebSocket connection for real-time updates
    const setupSessionWebSocket = (userId) => {
        if (!userId) {
            console.warn("Cannot start WebSocket — User ID is missing.");
            return null;
        }

        if (typeof window !== 'undefined' && window.WebSocket) {
            // Create dynamic WebSocket URL based on backend URL
            const wsUrl = backendUrl.replace('http://', 'ws://').replace('https://', 'wss://');
            const ws = new WebSocket(`${wsUrl}/sessions/${userId}`);

            ws.onopen = () => {
                console.log('Session WebSocket connected');
            };

            ws.onmessage = (event) => {
                try {
                    const sessionUpdate = JSON.parse(event.data);
                    console.log('Session update received:', sessionUpdate);

                    switch (sessionUpdate.type) {
                        case 'session_created':
                        case 'session_scheduled':
                            toast.info('New session scheduled!');
                            break;
                            
                        case 'session_starting':
                            toast.info('Your session is starting soon!');
                            break;
                            
                        case 'session_reminder':
                            toast.info('Session reminder: Your session starts in 15 minutes');
                            break;
                            
                        case 'session_call_started':
                        case 'session_active':
                            toast.info(sessionUpdate.message || 'Your counselling session started. Join now!');
                            // Optional: Auto-redirect to session
                            if (sessionUpdate.sessionUrl) {
                                window.open(sessionUpdate.sessionUrl, '_blank');
                            }
                            break;
                            
                        case 'session_completed':
                            toast.success('Session completed successfully');
                            break;
                            
                        case 'session_cancelled':
                            toast.warning('Session has been cancelled');
                            break;
                            
                        case 'session_rescheduled':
                            toast.info('Session has been rescheduled');
                            break;
                            
                        case 'notification':
                            toast.info(sessionUpdate.message || 'New notification');
                            break;
                            
                        default:
                            console.log('Unknown session update type:', sessionUpdate.type);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onclose = (event) => {
                console.log('Session WebSocket disconnected:', event.code, event.reason);
                
                // Auto-reconnect after 5 seconds if connection was lost unexpectedly
                if (event.code !== 1000 && event.code !== 1001) {
                    setTimeout(() => {
                        console.log('Attempting to reconnect WebSocket...');
                        setupSessionWebSocket(userId);
                    }, 5000);
                }
            };

            ws.onerror = (error) => {
                console.error('Session WebSocket error:', error);
            };

            return ws;
        }
        return null;
    };

    // ============= UTILITY FUNCTIONS =============

    // Get session details (optional utility function)
    const getSessionDetails = async (sessionId) => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/sessions/${sessionId}`, {
                headers: { token }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting session details:', error);
            return { success: false, message: 'Failed to get session details' };
        }
    };

    // Update user preferences (optional utility function)
    const updateUserPreferences = async (preferences) => {
        try {
            const response = await axios.patch(`${backendUrl}/api/user/preferences`, 
                preferences, 
                { headers: { token } }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating preferences:', error);
            return { success: false, message: 'Failed to update preferences' };
        }
    };

// ============= DONATION FUNCTIONS =============

// Create donation payment
const createDonationPayment = async (donationData) => {
    try {
        const { amount, donationType, donorEmail, donorName } = donationData;
        
        const response = await axios.post(`${backendUrl}/api/user/create-donation`, 
            { amount, donationType, donorEmail, donorName }, 
            { 
                headers: token ? { token } : {}
            }
        );
        
        if (response.data.success) {
            return response.data;
        } else {
            toast.error(response.data.message);
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error('Error creating donation:', error);
        const errorMessage = error.response?.data?.message || 'Failed to process donation';
        toast.error(errorMessage);
        return { 
            success: false, 
            message: errorMessage 
        };
    }
};

// Verify donation payment
const verifyDonationPayment = async (sessionId) => {
    try {
        const response = await axios.post(`${backendUrl}/api/user/verify-donation`, 
            { sessionId }
        );
        
        if (response.data.success) {
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.error(response.data.message);
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error('Error verifying donation:', error);
        const errorMessage = error.response?.data?.message || 'Failed to verify donation';
        toast.error(errorMessage);
        return { 
            success: false, 
            message: errorMessage 
        };
    }
};

// Get user's donation history
const getUserDonationHistory = async () => {
    try {
        if (!token) {
            console.warn('No token available for donation history');
            return { success: false, donations: [], message: 'Please log in to view donation history' };
        }

        const response = await axios.get(`${backendUrl}/api/user/donation-history`, {
            headers: { token }
        });
        
        console.log('Donation history API response:', response.data); // Debug log
        
        if (response.data.success) {
            return {
                success: true,
                donations: response.data.donations || [],
                count: response.data.count || 0
            };
        } else {
            console.error('API returned error:', response.data.message);
            toast.error(response.data.message || 'Failed to load donation history');
            return { success: false, donations: [], message: response.data.message };
        }
    } catch (error) {
        console.error('Error fetching donation history:', error);
        const errorMessage = error.response?.data?.message || 'Error loading donation history';
        toast.error(errorMessage);
        return { success: false, donations: [], message: errorMessage };
    }
};

// Cancel monthly donation subscription
const cancelMonthlyDonation = async (subscriptionId) => {
    try {
        if (!token) {
            toast.error('Please log in to cancel subscription');
            return { success: false, message: 'Authentication required' };
        }

        const response = await axios.post(`${backendUrl}/api/user/cancel-monthly-donation`, 
            { subscriptionId }, 
            { headers: { token } }
        );
        
        if (response.data.success) {
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.error(response.data.message);
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        console.error('Error cancelling donation:', error);
        const errorMessage = error.response?.data?.message || 'Failed to cancel donation';
        toast.error(errorMessage);
        return { 
            success: false, 
            message: errorMessage 
        };
    }
};

// Process donation with Stripe (similar to appointment payment)
const processDonationPayment = async (amount, donationType, donorEmail, donorName) => {
    try {
        const donationData = { amount, donationType, donorEmail, donorName };
        const response = await createDonationPayment(donationData);
        
        if (response.success && response.url) {
            // Redirect to Stripe Checkout
            window.location.href = response.url;
            return response;
        } else {
            const errorMessage = response.message || 'Failed to process donation';
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    } catch (error) {
        console.error('Donation processing error:', error);
        toast.error('Failed to process donation');
        return { success: false, message: 'Failed to process donation' };
    }
};

    // Context value with all functions
    const value = {
        // State
        counsellors, 
        setCounsellors,
        token, 
        setToken,
        userData, 
        setUserData,
        assessment, 
        setAssessment,
        
        // Constants
        currencySymbol, 
        backendUrl, 
        service_id, 
        template_id, 
        public_key, 
        
        // Static data
        reviews, 
        team, 
        stats, 
        benefits,
        
        // User functions
        getUserInfo,
        
        // Counsellor functions
        getCounsellors,
        
        // Assessment functions
        chatbotAssessment, 
        fetchAssessment,
        
        // Session management functions
        getUserSessions,
        joinSession,
        bookSession,
        rescheduleSession,
        cancelSession,
        rateSession,
        getSessionDetails,
        
        // Notification functions
        getUserNotifications,
        markNotificationRead,
        
        // WebSocket functions
        setupSessionWebSocket,
        
        // Utility functions
        updateUserPreferences,

        // Donation functions
         createDonationPayment,
        verifyDonationPayment,
        getUserDonationHistory,
        cancelMonthlyDonation,
        processDonationPayment
    }

    useEffect(() => {
        getCounsellors()
    }, [])

    useEffect(() => {
        if (token) {
            getUserInfo()
        } else {
            setUserData(false)
        }
    }, [token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider