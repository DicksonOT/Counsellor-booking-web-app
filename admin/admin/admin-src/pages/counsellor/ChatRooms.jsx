import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  MessageCircle, 
  Users, 
  Settings, 
  Send, 
  Mic, 
  MicOff, 
  UserX, 
  Play, 
  Square, 
  Clock,
  AlertTriangle,
  ArrowLeft,
  MoreVertical,
  Shield,
  Crown,
  Volume2,
  VolumeX,
  Plus,
  X
} from 'lucide-react';
import { CounsellorContext } from '../../context/CounsellorContext';

const CounsellorChatInterface = () => {
  const { cToken, backendUrl, counsellors } = useContext(CounsellorContext);
  
  // State management
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [showUserActions, setShowUserActions] = useState({});
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({ title: '', agenda: '', topic: '' });
  const [showMuteModal, setShowMuteModal] = useState({ show: false, userId: null, userName: '' });
  const [muteForm, setMuteForm] = useState({ duration: '', reason: '' });
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const messagesPollInterval = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Start message polling - FIXED: Added missing function
  const startMessagePolling = (roomId) => {
    // Clear existing interval if any
    if (messagesPollInterval.current) {
      clearInterval(messagesPollInterval.current);
    }
    
    // Poll for new messages every 3 seconds
    messagesPollInterval.current = setInterval(() => {
      fetchMessages(roomId);
    }, 3000);
  };

  // Stop message polling - FIXED: Added missing function
  const stopMessagePolling = () => {
    if (messagesPollInterval.current) {
      clearInterval(messagesPollInterval.current);
      messagesPollInterval.current = null;
    }
  };

  // FIXED: Enhanced error handling and debugging for API calls
  const makeAuthenticatedRequest = async (url, options = {}) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'ctoken': cToken
    };

    const requestOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    console.log('Making request to:', url);
    console.log('With token:', cToken ? 'Present' : 'Missing');
    console.log('Request options:', requestOptions);

    const response = await fetch(url, requestOptions);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    return response;
  };

  // Updated fetchMessages function with better error handling
  const fetchMessages = async (roomId, page = 1) => {
    try {
      const response = await makeAuthenticatedRequest(
        `${backendUrl}/api/counsellor/chat-room/${roomId}/messages?page=${page}&limit=50`
      );
      
      const data = await response.json();
      console.log('Messages response:', data);
      
      if (response.ok && data.success) {
        setMessages(data.messages || []);
        setTimeout(scrollToBottom, 100);
      } else {
        const errorMsg = data.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error('Failed to fetch messages:', errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Network error while fetching messages');
    }
  };

  // Updated joinRoom function with better error handling
  const joinRoom = async (roomId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Joining room:', roomId);
      
      // Fetch room details
      const roomResponse = await makeAuthenticatedRequest(
        `${backendUrl}/api/counsellor/chat-room/${roomId}`
      );
      
      const roomData = await roomResponse.json();
      console.log('Room data response:', roomData);
      
      if (roomResponse.ok && roomData.success) {
        setSelectedRoom(roomId);
        setRoomDetails(roomData.room);
        setActiveSession(roomData.room.activeSession);
        
        // Fetch messages
        await fetchMessages(roomId);
        
        // Start polling for new messages
        startMessagePolling(roomId);
      } else {
        const errorMsg = roomData.message || `HTTP ${roomResponse.status}: ${roomResponse.statusText}`;
        console.error('Room access error:', errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      setError('Network error while joining room');
    } finally {
      setLoading(false);
    }
  };

  // Updated fetchChatRooms with better error handling and debugging
  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching chat rooms...');
      console.log('Backend URL:', backendUrl);
      console.log('Token present:', !!cToken);
      
      const response = await makeAuthenticatedRequest(
        `${backendUrl}/api/counsellor/chat-rooms`
      );
      
      const data = await response.json();
      console.log('Chat rooms response:', data);
      
      if (response.ok && data.success) {
        setChatRooms(Array.isArray(data.chatRooms) ? data.chatRooms : []);
      } else {
        const errorMsg = data.message || `HTTP ${response.status}: ${response.statusText}`;
        console.error('Failed to fetch chat rooms:', errorMsg);
        setError(errorMsg);
        
        // Additional debugging for 403 errors
        if (response.status === 403) {
          console.error('403 Forbidden - Check:');
          console.error('1. Token is valid and not expired');
          console.error('2. User has counsellor permissions');
          console.error('3. Backend route requires correct authentication');
        }
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      setError('Network error while fetching chat rooms');
    } finally {
      setLoading(false);
    }
  };

  // Send message with better error handling
  const sendMessage = async () => {
    if (!newMessage.trim() || sendingMessage) return;

    try {
      setSendingMessage(true);
      
      const response = await makeAuthenticatedRequest(
        `${backendUrl}/api/counsellor/chat/${selectedRoom}/message`,
        {
          method: 'POST',
          body: JSON.stringify({
            content: newMessage.trim(),
            messageType: 'text'
          })
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setNewMessage('');
        fetchMessages(selectedRoom);
      } else {
        const errorMsg = data.message || `HTTP ${response.status}: ${response.statusText}`;
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  // Start session with better error handling
  const startSession = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        `${backendUrl}/api/counsellor/chat/${selectedRoom}/start-session`,
        {
          method: 'POST',
          body: JSON.stringify(sessionForm)
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setActiveSession(data.session);
        setShowSessionModal(false);
        setSessionForm({ title: '', agenda: '', topic: '' });
        fetchMessages(selectedRoom);
      } else {
        const errorMsg = data.message || `HTTP ${response.status}: ${response.statusText}`;
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      setError('Failed to start session');
    }
  };

  // End session with better error handling
  const endSession = async (notes = '') => {
    try {
      const response = await makeAuthenticatedRequest(
        `${backendUrl}/api/counsellor/chat/${selectedRoom}/end-session`,
        {
          method: 'POST',
          body: JSON.stringify({ notes })
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setActiveSession(null);
        fetchMessages(selectedRoom);
      } else {
        const errorMsg = data.message || `HTTP ${response.status}: ${response.statusText}`;
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Error ending session:', error);
      setError('Failed to end session');
    }
  };

  // Mute user with better error handling
  const muteUser = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        `${backendUrl}/api/counsellor/chat/${selectedRoom}/mute/${showMuteModal.userId}`,
        {
          method: 'POST',
          body: JSON.stringify({
            duration: muteForm.duration ? parseInt(muteForm.duration) : null,
            reason: muteForm.reason || 'Muted by counselor'
          })
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setShowMuteModal({ show: false, userId: null, userName: '' });
        setMuteForm({ duration: '', reason: '' });
        fetchMessages(selectedRoom);
        joinRoom(selectedRoom);
      } else {
        const errorMsg = data.message || `HTTP ${response.status}: ${response.statusText}`;
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Error muting user:', error);
      setError('Failed to mute user');
    }
  };

  // Unmute user with better error handling
  const unmuteUser = async (userId) => {
    try {
      const response = await makeAuthenticatedRequest(
        `${backendUrl}/api/counsellor/chat/${selectedRoom}/unmute/${userId}`,
        {
          method: 'POST'
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        fetchMessages(selectedRoom);
        joinRoom(selectedRoom);
      } else {
        const errorMsg = data.message || `HTTP ${response.status}: ${response.statusText}`;
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Error unmuting user:', error);
      setError('Failed to unmute user');
    }
  };

  // Remove user with better error handling
  const removeUser = async (userId, reason = '') => {
    if (!confirm('Are you sure you want to remove this user from the chat room?')) return;
    
    try {
      const response = await makeAuthenticatedRequest(
        `${backendUrl}/api/counsellor/chat/${selectedRoom}/remove/${userId}`,
        {
          method: 'DELETE',
          body: JSON.stringify({ reason })
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        fetchMessages(selectedRoom);
        joinRoom(selectedRoom);
      } else {
        const errorMsg = data.message || `HTTP ${response.status}: ${response.statusText}`;
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Error removing user:', error);
      setError('Failed to remove user');
    }
  };

  // Leave room
  const leaveRoom = () => {
    stopMessagePolling();
    setSelectedRoom(null);
    setRoomDetails(null);
    setMessages([]);
    setActiveSession(null);
    setShowUserActions({});
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle key press for sending messages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Load chat rooms on component mount
  useEffect(() => {
    if (cToken && backendUrl) {
      console.log('Component mounted, fetching chat rooms...');
      fetchChatRooms();
    } else {
      console.warn('Missing required context values:', { 
        cToken: !!cToken, 
        backendUrl: !!backendUrl 
      });
    }
    
    return () => {
      stopMessagePolling();
    };
  }, [cToken, backendUrl]);

  // Update scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading && !selectedRoom) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading chat rooms...</p>
        </div>
      </div>
    );
  }

  if (error && !selectedRoom) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">
          <h3 className="text-lg font-medium">Error</h3>
          <p className="text-sm mt-2">{error}</p>
          {error.includes('403') && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg text-left">
              <p className="font-medium mb-2">Troubleshooting 403 Forbidden:</p>
              <ul className="text-sm space-y-1">
                <li>• Check if your authentication token is valid</li>
                <li>• Verify you have counsellor permissions</li>
                <li>• Ensure backend routes require correct authentication</li>
                <li>• Check if token is expired</li>
              </ul>
            </div>
          )}
        </div>
        <button
          onClick={fetchChatRooms}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Chat room list view
  if (!selectedRoom) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Your Chat Rooms</h1>
            <p className="text-gray-600">Select a program to join its group chat</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Counsellor</span>
          </div>
        </div>

        {chatRooms.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Chat Rooms Found</h3>
            <p className="text-gray-600">You don't have access to any chat rooms yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {chatRooms.map((room) => (
              <div 
                key={room._id} 
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => joinRoom(room._id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium text-blue-600">{room.name}</h3>
                  <div className="flex items-center gap-2">
                    {room.stats?.activeSession && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Live Session
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      room.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                </div>
                
                {room.program && (
                  <p className="text-gray-900 mb-3">{room.program.title}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {room.stats?.totalMembers || 0} members
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {room.stats?.totalMessages || 0} messages
                    </span>
                    {room.stats?.onlineMembers > 0 && (
                      <span className="text-green-600">
                        {room.stats.onlineMembers} online
                      </span>
                    )}
                  </div>
                </div>
                
                {room.lastMessage && (
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <p className="text-gray-700 truncate">{room.lastMessage.content}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {formatTime(room.lastMessage.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Chat interface view
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={leaveRoom}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-blue-600">{roomDetails?.name}</h1>
              <p className="text-sm text-blue-600">{roomDetails?.program?.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {activeSession?.isActive ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  {activeSession.title}
                </span>
                <button
                  onClick={() => endSession()}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  End Session
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSessionModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Session
              </button>
            )}
            
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Users className="w-4 h-4" />
              {roomDetails?.members?.length || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${
                message.senderRole === 'counselor' ? 'justify-end' : 
                message.senderRole === 'system' ? 'justify-center' : 'justify-start'
              }`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderRole === 'counselor' 
                    ? 'bg-blue-500 text-white' 
                    : message.senderRole === 'system'
                    ? 'bg-yellow-100 text-yellow-800 text-sm'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.senderRole !== 'system' && (
                    <p className="font-medium text-sm mb-1">
                      {message.senderRole === 'counselor' ? 'You' : message.sender?.name || 'User'}
                    </p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderRole === 'counselor' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={sendingMessage}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sendingMessage ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {/* Members Sidebar */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-4">Members ({roomDetails?.members?.length || 0})</h3>
            <div className="space-y-2">
              {roomDetails?.members?.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {member.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.user?.name || 'User'}
                      </p>
                      {member.isMuted && (
                        <p className="text-xs text-red-600">Muted</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowUserActions(prev => ({
                        ...prev,
                        [member._id]: !prev[member._id]
                      }))}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {showUserActions[member._id] && (
                      <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
                        {member.isMuted ? (
                          <button
                            onClick={() => {
                              unmuteUser(member.user._id);
                              setShowUserActions(prev => ({ ...prev, [member._id]: false }));
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Volume2 className="w-4 h-4" />
                            Unmute
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setShowMuteModal({
                                show: true,
                                userId: member.user._id,
                                userName: member.user.name
                              });
                              setShowUserActions(prev => ({ ...prev, [member._id]: false }));
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <VolumeX className="w-4 h-4" />
                            Mute
                          </button>
                        )}
                        <button
                          onClick={() => {
                            removeUser(member.user._id);
                            setShowUserActions(prev => ({ ...prev, [member._id]: false }));
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                        >
                          <UserX className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Start Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Start New Session</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Session Title"
                value={sessionForm.title}
                onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Agenda (optional)"
                value={sessionForm.agenda}
                onChange={(e) => setSessionForm(prev => ({ ...prev, agenda: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <input
                type="text"
                placeholder="Topic (optional)"
                value={sessionForm.topic}
                onChange={(e) => setSessionForm(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSessionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={startSession}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Start Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mute User Modal */}
      {showMuteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Mute User: {showMuteModal.userName}</h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="Duration (minutes, leave empty for permanent)"
                value={muteForm.duration}
                onChange={(e) => setMuteForm(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Reason for muting"
                value={muteForm.reason}
                onChange={(e) => setMuteForm(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowMuteModal({ show: false, userId: null, userName: '' })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={muteUser}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Mute User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 hover:bg-red-600 rounded p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounsellorChatInterface;