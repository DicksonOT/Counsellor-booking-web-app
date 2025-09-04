import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Video, Phone, User, MapPin, Star, Filter, Plus, CheckCircle, XCircle, AlertCircle, Bell, Edit, Trash2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserSessions = () => {
  const navigate = useNavigate()
  const { 
    getUserSessions, 
    joinSession, 
    rescheduleSession,
    cancelSession,
    rateSession,
    getUserNotifications,
    markNotificationRead,
    setupSessionWebSocket,
    userData,
  } = useContext(AppContext);

  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [joiningSession, setJoiningSession] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchSessions();
    fetchNotifications();
    
    // Setup WebSocket for real-time updates
    if (userData?._id) {
      const ws = setupSessionWebSocket(userData._id);
      
      return () => {
        if (ws) {
          ws.close();
        }
      };
    }
  }, [userData]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await getUserSessions();
      if (response.success) {
        setSessions(response.sessions || []);
      } else {
        toast.error(response.message || 'Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
    setLoading(false);
  };

  const fetchNotifications = async () => {
    try {
      const response = await getUserNotifications();
      if (response.success) {
        setNotifications(response.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleJoinSession = async (sessionId) => {
    setJoiningSession(sessionId);
    try {
      const response = await joinSession(sessionId);
      if (response.success) {
        const session = response.session;

        if (session.roomId || session.sessionUrl) {
          const joinUrl = session.sessionUrl || 
            `${import.meta.env.VITE_FRONTEND_URL || window.location.origin}/session/${session.roomId}`;
          
          window.open(joinUrl, '_blank');
          toast.success('Opening session room...');
        } else {
          toast.info('Session room not available yet. Please contact your counsellor.');
        }

        await fetchSessions();
      } else {
        toast.error(response.message || 'Failed to join session');
      }
    } catch (error) {
      console.error('Error joining session:', error);
      toast.error('Failed to join session');
    }
    setJoiningSession(null);
  };

  const handleRescheduleSession = async (sessionId, newData) => {
    setActionLoading(prev => ({ ...prev, [`reschedule_${sessionId}`]: true }));
    try {
      const response = await rescheduleSession(sessionId, newData);
      if (response.success) {
        toast.success('Session rescheduled successfully');
        setShowRescheduleModal(false);
        await fetchSessions();
      } else {
        toast.error(response.message || 'Failed to reschedule session');
      }
    } catch (error) {
      console.error('Error rescheduling session:', error);
      toast.error('Failed to reschedule session');
    }
    setActionLoading(prev => ({ ...prev, [`reschedule_${sessionId}`]: false }));
  };

  const handleCancelSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;
    
    setActionLoading(prev => ({ ...prev, [`cancel_${sessionId}`]: true }));
    try {
      const response = await cancelSession(sessionId);
      if (response.success) {
        toast.success('Session cancelled successfully');
        await fetchSessions();
      } else {
        toast.error(response.message || 'Failed to cancel session');
      }
    } catch (error) {
      console.error('Error cancelling session:', error);
      toast.error('Failed to cancel session');
    }
    setActionLoading(prev => ({ ...prev, [`cancel_${sessionId}`]: false }));
  };

  const handleRateSession = async (sessionId, rating, feedback = '') => {
    setActionLoading(prev => ({ ...prev, [`rate_${sessionId}`]: true }));
    try {
      const response = await rateSession(sessionId, rating, feedback);
      if (response.success) {
        toast.success('Thank you for your feedback!');
        setShowRatingModal(false);
        await fetchSessions();
      } else {
        toast.error(response.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error rating session:', error);
      toast.error('Failed to submit rating');
    }
    setActionLoading(prev => ({ ...prev, [`rate_${sessionId}`]: false }));
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await markNotificationRead(notificationId);
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleBookAppointment = () => {
    navigate('/counsellors');
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'scheduled':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'active':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'phone':
      case 'audio':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'in-person':
        return <MapPin className="h-4 w-4 text-purple-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    const now = new Date();
    const sessionDate = new Date(session.scheduledTime || session.sessionDate || session.date);

    let statusFilter = true;
    if (filterStatus !== 'all') {
      statusFilter = session.status?.toLowerCase() === filterStatus.toLowerCase();
    }

    if (activeTab === 'upcoming') {
      return sessionDate >= now && 
             !['cancelled', 'completed'].includes(session.status?.toLowerCase()) && 
             statusFilter;
    } else if (activeTab === 'history') {
      return (sessionDate < now || 
              ['completed', 'cancelled'].includes(session.status?.toLowerCase())) && 
             statusFilter;
    }
    return statusFilter;
  });

  const RescheduleModal = () => {
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const handleReschedule = async () => {
      if (!newDate || !newTime) {
        toast.error('Please select new date and time');
        return;
      }

      const rescheduleData = {
        scheduledTime: new Date(`${newDate}T${newTime}:00`).toISOString(),
        date: newDate,
        time: newTime
      };

      await handleRescheduleSession(selectedSession._id, rescheduleData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Reschedule Session</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">New Time</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="18:00">6:00 PM</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowRescheduleModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReschedule}
              disabled={!newDate || !newTime || actionLoading[`reschedule_${selectedSession?._id}`]}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {actionLoading[`reschedule_${selectedSession?._id}`] ? 'Rescheduling...' : 'Reschedule'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RatingModal = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleRating = async () => {
      if (rating === 0) {
        toast.error('Please select a rating');
        return;
      }

      await handleRateSession(selectedSession._id, rating, feedback);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Rate Your Session</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-8 h-8 ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="w-full h-full fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Feedback (Optional)</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowRatingModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRating}
              disabled={rating === 0 || actionLoading[`rate_${selectedSession?._id}`]}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {actionLoading[`rate_${selectedSession?._id}`] ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SessionCard = ({ session }) => {
    const counsellorName = session.counId?.name || session.counsellorName || 'Unknown Counsellor';
    const counsellorPhoto = session.counId?.image || session.counsellorPhoto || '/api/placeholder/40/40';
    const sessionDate = session.scheduledTime || session.sessionDate || session.date;
    const sessionTime = session.sessionTime || session.time || 
      (sessionDate ? new Date(sessionDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A');
    const sessionType = session.sessionType || session.type || 'video';
    const sessionStatus = session.status || 'pending';
    const sessionNotes = session.notes || session.description;

    const canJoin = ['confirmed', 'scheduled', 'active'].includes(sessionStatus.toLowerCase());
    const canReschedule = ['confirmed', 'scheduled', 'pending'].includes(sessionStatus.toLowerCase());
    const canCancel = ['confirmed', 'scheduled', 'pending'].includes(sessionStatus.toLowerCase());
    const canRate = sessionStatus.toLowerCase() === 'completed' && !session.rating;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img 
              src={counsellorPhoto} 
              alt={counsellorName}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = '/api/placeholder/40/40';
              }}
            />
            <div>
              <h3 className="font-semibold text-gray-900">{counsellorName}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {getTypeIcon(sessionType)}
                <span className="capitalize">{sessionType}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(sessionStatus)}
            <span className={`text-xs px-2 py-1 rounded-full capitalize ${
              ['confirmed', 'scheduled'].includes(sessionStatus.toLowerCase()) ? 'bg-green-100 text-green-700' :
              sessionStatus.toLowerCase() === 'completed' ? 'bg-blue-100 text-blue-700' :
              sessionStatus.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
              sessionStatus.toLowerCase() === 'active' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {sessionStatus}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {sessionDate ? new Date(sessionDate).toLocaleDateString() : 'Date not set'}
            </span>
            <Clock className="h-4 w-4 ml-2" />
            <span>{sessionTime} ({session.duration || 60}min)</span>
          </div>

          {session.location && sessionType !== 'video' && sessionType !== 'audio' && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{session.location}</span>
            </div>
          )}

          {sessionNotes && (
            <div className="text-gray-700 bg-gray-50 p-2 rounded text-xs">
              {sessionNotes}
            </div>
          )}

          {sessionStatus.toLowerCase() === 'completed' && session.rating && (
            <div className="flex items-center space-x-1 mt-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">
                Rated: {session.rating}/5
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {canJoin && (
            <button 
              onClick={() => handleJoinSession(session._id)}
              disabled={joiningSession === session._id}
              className={`flex-1 min-w-[120px] px-3 py-2 text-white text-sm rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                sessionType === 'video' ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400' :
                sessionType === 'audio' || sessionType === 'phone' ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400' :
                'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400'
              }`}
            >
              {sessionType === 'video' ? <Video className="h-4 w-4" /> :
               ['audio', 'phone'].includes(sessionType) ? <Phone className="h-4 w-4" /> :
               <MapPin className="h-4 w-4" />}
              <span>
                {joiningSession === session._id ? 'Opening...' : 
                 sessionType === 'video' ? 'Join Video' :
                 ['audio', 'phone'].includes(sessionType) ? 'Start Call' :
                 'Join Session'}
              </span>
            </button>
          )}

          {canReschedule && (
            <button 
              onClick={() => {
                setSelectedSession(session);
                setShowRescheduleModal(true);
              }}
              disabled={actionLoading[`reschedule_${session._id}`]}
              className="px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
            >
              <Edit className="h-3 w-3" />
              <span>{actionLoading[`reschedule_${session._id}`] ? 'Rescheduling...' : 'Reschedule'}</span>
            </button>
          )}

          {canCancel && (
            <button 
              onClick={() => handleCancelSession(session._id)}
              disabled={actionLoading[`cancel_${session._id}`]}
              className="px-3 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-1"
            >
              <Trash2 className="h-3 w-3" />
              <span>{actionLoading[`cancel_${session._id}`] ? 'Cancelling...' : 'Cancel'}</span>
            </button>
          )}

          {canRate && (
            <button 
              onClick={() => {
                setSelectedSession(session);
                setShowRatingModal(true);
              }}
              disabled={actionLoading[`rate_${session._id}`]}
              className="flex-1 min-w-[120px] px-3 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-1"
            >
              <Star className="h-3 w-3" />
              <span>{actionLoading[`rate_${session._id}`] ? 'Rating...' : 'Rate Session'}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-2">My Sessions</h1>
          <p className="text-gray-600">Manage your counselling sessions and appointments</p>
        </div>
        
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell className="h-6 w-6" />
            {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.filter(n => !n.isRead).length}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification._id)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'history', label: 'History' },
          { key: 'appointment', label: 'Book Appointment' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              if (tab.key === 'appointment') {
                handleBookAppointment();
              } else {
                setActiveTab(tab.key);
              }
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      {(activeTab === 'upcoming' || activeTab === 'history') && (
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sessions found
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming sessions."
                : "No session history available."
              }
            </p>
            <button
              onClick={handleBookAppointment}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map(session => (
              <SessionCard key={session._id || session.id} session={session} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showRescheduleModal && <RescheduleModal />}
      {showRatingModal && <RatingModal />}
    </div>
  );
};

export default UserSessions;