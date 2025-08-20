import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CounsellorContext } from '../context/CounsellorContext';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { toast } from "react-toastify";

const UserProfile = () => {
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { 
    cToken, 
    getUserProfile, 
    createOnlineSession, 
    getClientAppointments, 
    getClientSessions, 
    startCall,
    sendSessionNotification,
    sendSessionReminder
  } = useContext(CounsellorContext);
  
  const { calculateAge, currency, formattedDate } = useContext(AppContext);

  // State management
  const [userData, setUserData] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [userAppointments, setUserAppointments] = useState([]);
  const [userSessions, setUserSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showSessionModal, setShowSessionModal] = useState(false);
  
  // Loading states for different actions
  const [actionLoading, setActionLoading] = useState({
    sessionCreation: false,
    joiningSession: {},
    sendingNotification: false,
    sendingReminder: {}
  });

  const [sessionDetails, setSessionDetails] = useState({
    sessionType: 'video',
    duration: '60',
    notes: '',
    scheduledTime: ''
  });

  // Get dynamic frontend URL
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

  // Memoized fetch functions to prevent unnecessary re-renders
  const fetchUserProfile = useCallback(async () => {
    if (!cToken || !userId) return;

    try {
      setLoading(true);
      const data = await getUserProfile(userId);
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message || 'Failed to load user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [cToken, userId, getUserProfile]);

  const fetchUserAppointments = useCallback(async () => {
    if (!cToken || !userId) return;

    try {
      const data = await getClientAppointments(userId);
      if (data.success) {
        setUserAppointments(data.appointments || []);
      } else {
        console.log('No appointments found:', data.message);
        setUserAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      setUserAppointments([]);
    }
  }, [cToken, userId, getClientAppointments]);

  const fetchUserSessions = useCallback(async () => {
    if (!cToken || !userId) return;

    try {
      const data = await getClientSessions(userId);
      if (data.success) {
        setUserSessions(data.sessions || []);
      } else {
        console.log('No sessions found:', data.message);
        setUserSessions([]);
      }
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      setUserSessions([]);
    }
  }, [cToken, userId, getClientSessions]);

  // Effects
  useEffect(() => {
    // Get data from navigation state if available
    if (location.state) {
      setUserData(location.state.clientData || location.state.userData);
      setAppointmentData(location.state.appointmentData);
      setLoading(false);
    } else {
      // Fetch user profile if no state data
      fetchUserProfile();
    }

    // Fetch all appointments and sessions for this user
    fetchUserAppointments();
    fetchUserSessions();
  }, [userId, location.state, fetchUserProfile, fetchUserAppointments, fetchUserSessions]);

  // Session management functions
  const handleCreateSession = async (e) => {
    e.preventDefault();
    
    setActionLoading(prev => ({ ...prev, sessionCreation: true }));

    try {
      const sessionData = {
        userId: userId,
        appointmentId: appointmentData?._id,
        ...sessionDetails
      };

      const data = await createOnlineSession(sessionData);

      if (data.success) {
        toast.success('Online session created successfully!');
        setShowSessionModal(false);
        
        // Refresh sessions list
        await fetchUserSessions();

        // Reset form
        setSessionDetails({
          sessionType: 'video',
          duration: '60',
          notes: '',
          scheduledTime: ''
        });
      } else {
        toast.error(data.message || 'Failed to create session');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create online session');
    } finally {
      setActionLoading(prev => ({ ...prev, sessionCreation: false }));
    }
  };

  const handleJoinSession = async (session) => {
    if (!session.roomId) {
      toast.error('Session room not available');
      return;
    }

    setActionLoading(prev => ({ 
      ...prev, 
      joiningSession: { ...prev.joiningSession, [session._id]: true }
    }));

    try {
      // Open session window
      const sessionUrl = `${frontendUrl}/session/${session.roomId}`;
      const newWindow = window.open(sessionUrl, '_blank', 'width=1200,height=800');
      
      if (!newWindow) {
        toast.error('Please allow popups for this site to join the session');
        return;
      }

      // Start the call
      const result = await startCall(session._id);
      if (!result.success) {
        toast.error(result.message || 'Failed to start call');
        newWindow.close();
        return;
      }

      // Optimistically update the session status
      setUserSessions(prev => 
        prev.map(s => 
          s._id === session._id 
            ? { ...s, status: 'active', startTime: new Date() }
            : s
        )
      );

      toast.success('Session started successfully!');

      // Refresh sessions after a delay to get updated data
      setTimeout(() => {
        fetchUserSessions();
      }, 2000);

    } catch (error) {
      console.error('Error joining session:', error);
      toast.error('Failed to join session');
    } finally {
      setActionLoading(prev => ({ 
        ...prev, 
        joiningSession: { ...prev.joiningSession, [session._id]: false }
      }));
    }
  };

  const handleSendNotification = async (sessionId, type = 'reminder') => {
    setActionLoading(prev => ({ ...prev, sendingNotification: true }));

    try {
      const notificationData = {
        userId,
        sessionId,
        type,
        message: `Session ${type} from your counsellor`
      };

      const result = await sendSessionNotification(notificationData);
      if (result.success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} sent successfully!`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setActionLoading(prev => ({ ...prev, sendingNotification: false }));
    }
  };

  const handleSendReminder = async (sessionId) => {
    setActionLoading(prev => ({ 
      ...prev, 
      sendingReminder: { ...prev.sendingReminder, [sessionId]: true }
    }));

    try {
      const result = await sendSessionReminder(sessionId, {
        message: 'Reminder: You have an upcoming session with your counsellor'
      });
      
      if (result.success) {
        toast.success('Reminder sent successfully!');
      }
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    } finally {
      setActionLoading(prev => ({ 
        ...prev, 
        sendingReminder: { ...prev.sendingReminder, [sessionId]: false }
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSessionDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Utility functions
  const getSessionStatusColor = (status) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSessionTypeIcon = (type) => {
    const icons = {
      'video': '🎥',
      'audio': '🎵',
      'chat': '💬'
    };
    return icons[type] || '💻';
  };

  const getAppointmentStatusColor = (appointment) => {
    if (appointment.cancelled) return 'bg-red-100 text-red-800';
    if (appointment.isCompleted) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getAppointmentStatusText = (appointment) => {
    if (appointment.cancelled) return 'Cancelled';
    if (appointment.isCompleted) return 'Completed';
    return 'Scheduled';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center bg-white rounded-lg shadow-md m-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">👤</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">User Not Found</h2>
        <p className="text-gray-500 mb-6">The requested user profile could not be loaded.</p>
        <button
          onClick={() => navigate('/counsellor/appointments')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          ← Back to Appointments
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/counsellor/appointments')}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              <span className="mr-2 text-lg">←</span> Back to Appointments
            </button>
          </div>

          {/* User Header Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                    src={userData.image || assets.profile_placeholder}
                    alt="User Profile"
                    onError={(e) => { e.target.onerror = null; e.target.src = assets.profile_placeholder; }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                  <p className="text-gray-600 text-lg">{userData.email}</p>
                  {userData.phone && (
                    <p className="text-gray-500 flex items-center mt-1">
                      📞 {userData.phone}
                    </p>
                  )}
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      ✅ Active Client
                    </span>
                    <span className="text-sm text-gray-500">
                      Member since {formattedDate(userData.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-2">
                <button
                  onClick={() => setShowSessionModal(true)}
                  className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  🎥 Start Session
                </button>
                <button
                  onClick={() => handleSendNotification(null, 'general')}
                  disabled={actionLoading.sendingNotification}
                  className="block w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm disabled:bg-green-400"
                >
                  {actionLoading.sendingNotification ? 'Sending...' : '📱 Send Notification'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 bg-white rounded-t-lg">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'profile', label: 'Profile', icon: '👤' },
                { id: 'appointments', label: 'Appointments', icon: '📅', count: userAppointments.length },
                { id: 'sessions', label: 'Sessions', icon: '💻', count: userSessions.length },
                { id: 'notes', label: 'Notes', icon: '📝' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-all duration-200 rounded-t-lg flex items-center`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="mr-2">👤</span> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-gray-900 font-medium">{userData.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Age</label>
                        <p className="text-gray-900 font-medium">
                          {userData.dob ? `${calculateAge(userData.dob)} years old` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Gender</label>
                        <p className="text-gray-900 font-medium">{userData.gender || "N/A"}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900 font-medium">{userData.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900 font-medium">{userData.phone || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                        <p className="text-gray-900 font-medium">
                          {userData.dob ? formattedDate(userData.dob) : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {userData.location && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-gray-900 font-medium mt-1">{userData.location}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="mr-2">📅</span> Appointment History
                  <span className="ml-auto text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {userAppointments.length} Total
                  </span>
                </h3>
                {userAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📅</span>
                    </div>
                    <p className="text-gray-500">No appointments found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userAppointments.map((appointment, index) => (
                      <div key={appointment._id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <span className="text-lg font-medium text-gray-900">
                                {formattedDate(appointment.slotDate)}
                              </span>
                              <span className="text-gray-600">{appointment.slotTime}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment)}`}>
                                {getAppointmentStatusText(appointment)}
                              </span>
                            </div>
                            <div className="text-gray-600 text-sm">
                              <p>Fee: {currency} {appointment.amount}</p>
                              <p className="flex items-center mt-1">
                                Payment: 
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${appointment.payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {appointment.payment ? 'Paid' : 'Pending'}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <span className="mr-2">💻</span> Session History
                    <span className="ml-4 text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                      {userSessions.length} Total
                    </span>
                  </h3>
                  <button
                    onClick={() => setShowSessionModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    + New Session
                  </button>
                </div>

                {userSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💻</span>
                    </div>
                    <p className="text-gray-500 mb-4">No sessions yet</p>
                    <button
                      onClick={() => setShowSessionModal(true)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start First Session
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userSessions.map((session, index) => (
                      <div key={session._id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <span className="text-lg font-medium text-gray-900 flex items-center">
                                <span className="mr-2">{getSessionTypeIcon(session.sessionType)}</span>
                                {session.sessionType?.charAt(0).toUpperCase() + session.sessionType?.slice(1)} Session
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSessionStatusColor(session.status)}`}>
                                {session.status?.charAt(0).toUpperCase() + session.status?.slice(1)}
                              </span>
                            </div>
                            <div className="text-gray-600 text-sm space-y-1">
                              {session.scheduledTime && (
                                <p>Scheduled: {formattedDate(session.scheduledTime)}</p>
                              )}
                              <p>Duration: {session.duration} minutes</p>
                              {session.startTime && (
                                <p>Started: {formattedDate(session.startTime)}</p>
                              )}
                              {session.endTime && (
                                <p>Ended: {formattedDate(session.endTime)}</p>
                              )}
                              {session.notes && (
                                <p className="text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                                  <span className="font-medium">Notes:</span> {session.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2 ml-4">
                            {session.status === 'scheduled' && session.roomId && (
                              <button
                                onClick={() => handleJoinSession(session)}
                                disabled={actionLoading.joiningSession[session._id]}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:bg-green-400"
                              >
                                {actionLoading.joiningSession[session._id] ? 'Joining...' : 'Join Session'}
                              </button>
                            )}

                            {session.status === 'scheduled' && (
                              <button
                                onClick={() => handleSendReminder(session._id)}
                                disabled={actionLoading.sendingReminder[session._id]}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-blue-400"
                              >
                                {actionLoading.sendingReminder[session._id] ? 'Sending...' : '🔔 Reminder'}
                              </button>
                            )}

                            {session.status === 'active' && (
                              <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium text-center">
                                Session in Progress
                              </span>
                            )}

                            {session.status === 'completed' && (
                              <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium text-center">
                                ✅ Completed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="mr-2">📝</span> Counselling Notes
                </h3>
                <div className="space-y-4">
                  <textarea
                    placeholder="Add your counselling notes here..."
                    rows="8"
                    className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    defaultValue={userData.notes || ""}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Notes are automatically saved and visible only to you
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Appointment Info */}
            {appointmentData && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🎯</span> Current Appointment
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formattedDate(appointmentData.slotDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{appointmentData.slotTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fees:</span>
                    <span className="font-medium">{currency} {appointmentData.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${appointmentData.payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {appointmentData.payment ? 'Paid' : 'Not Paid'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">⚡</span> Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowSessionModal(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center"
                >
                  <span className="mr-2">🎥</span> Start Online Session
                </button>
                <button
                  onClick={() => handleSendNotification(null, 'followup')}
                  disabled={actionLoading.sendingNotification}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center justify-center disabled:bg-green-400"
                >
                  <span className="mr-2">📅</span> 
                  {actionLoading.sendingNotification ? 'Sending...' : 'Schedule Follow-up'}
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center justify-center"
                >
                  <span className="mr-2">📝</span> Add Notes
                </button>
              </div>
            </div>

            {/* User Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📊</span> Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Appointments:</span>
                  <span className="font-medium text-blue-600">{userAppointments.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">
                    {userAppointments.filter(apt => apt.isCompleted).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cancelled:</span>
                  <span className="font-medium text-red-600">
                    {userAppointments.filter(apt => apt.cancelled).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Sessions:</span>
                  <span className="font-medium text-purple-600">{userSessions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Sessions:</span>
                  <span className="font-medium text-orange-600">
                    {userSessions.filter(session => session.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed Sessions:</span>
                  <span className="font-medium text-green-600">
                    {userSessions.filter(session => session.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Upcoming:</span>
                  <span className="font-medium text-blue-600">
                    {userAppointments.filter(apt => !apt.isCompleted && !apt.cancelled).length +
                     userSessions.filter(session => session.status === 'scheduled').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🕒</span> Recent Activity
              </h3>
              <div className="space-y-3">
                {userSessions.length > 0 && (
                  <div className="text-sm">
                    <p className="text-gray-600">Last session:</p>
                    <p className="font-medium text-gray-900">
                      {formattedDate(userSessions[0].scheduledTime || userSessions[0].createdAt)}
                    </p>
                  </div>
                )}
                {userAppointments.length > 0 && (
                  <div className="text-sm">
                    <p className="text-gray-600">Last appointment:</p>
                    <p className="font-medium text-gray-900">
                      {formattedDate(userAppointments[0].slotDate)}
                    </p>
                  </div>
                )}
                {userData.createdAt && (
                  <div className="text-sm">
                    <p className="text-gray-600">Client since:</p>
                    <p className="font-medium text-gray-900">
                      {formattedDate(userData.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Online Session Modal */}
        {showSessionModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
            <div className="relative bg-white w-full max-w-md mx-auto rounded-xl shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Create Online Session</h3>
                <button
                  onClick={() => setShowSessionModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSession} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Type
                    </label>
                    <select
                      name="sessionType"
                      value={sessionDetails.sessionType}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="video">🎥 Video Call</option>
                      <option value="audio">🎵 Audio Call</option>
                      <option value="chat">💬 Text Chat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <select
                      name="duration"
                      value={sessionDetails.duration}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheduled Time (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledTime"
                      value={sessionDetails.scheduledTime}
                      onChange={handleInputChange}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to create an immediate session
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Notes
                    </label>
                    <textarea
                      name="notes"
                      value={sessionDetails.notes}
                      onChange={handleInputChange}
                      placeholder="Add any notes for this session (e.g., session goals, topics to discuss)..."
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowSessionModal(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading.sessionCreation}
                    className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center"
                  >
                    {actionLoading.sessionCreation ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Session'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;