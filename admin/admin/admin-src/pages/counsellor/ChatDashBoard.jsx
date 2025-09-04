// components/counsellor/CounsellorChatDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { MessageCircle, Crown, Shield, X, Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import ChatRoom from '../../../../../frontend/src/components/ChatRoom';
import CounsellorChatModeration from '../counsellor/ChatModeration';
import axios from 'axios';

const CounsellorChatDashboard = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModeration, setShowModeration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalMembers: 0,
    activeSessions: 0,
    totalMessages: 0
  });

  const fetchChatRooms = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/counsellor/chat-rooms`, {
        headers: { token }
      });
      
      if (data.success) {
        setChatRooms(data.chatRooms);
        
        // Calculate stats
        const totalMembers = data.chatRooms.reduce((sum, room) => sum + (room.members?.length || 0), 0);
        const activeSessions = data.chatRooms.filter(room => room.activeSession?.isActive).length;
        const totalMessages = data.chatRooms.reduce((sum, room) => sum + (room.stats?.totalMessages || 0), 0);
        
        setStats({
          totalRooms: data.chatRooms.length,
          totalMembers,
          activeSessions,
          totalMessages
        });
      }
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  useEffect(() => {
    fetchChatRooms();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchChatRooms, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your chat rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chat Moderation Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your assigned program support groups</p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg">
            <Crown className="w-4 h-4" />
            <span className="font-medium">Counsellor</span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
                <p className="text-gray-600 text-sm">Chat Rooms</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
                <p className="text-gray-600 text-sm">Total Members</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSessions}</p>
                <p className="text-gray-600 text-sm">Active Sessions</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMessages}</p>
                <p className="text-gray-600 text-sm">Total Messages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Rooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {chatRooms.map((room) => (
            <div key={room._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Room Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{room.name}</h3>
                  {room.activeSession?.isActive && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{room.program?.title}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {room.members?.length || 0}
                  </span>
                  <span>{room.stats?.totalMessages || 0} msgs</span>
                  <span className="capitalize">{room.program?.category}</span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-4 space-y-3">
                {room.stats?.lastActivity && (
                  <div className="text-xs text-gray-500">
                    Last activity: {formatTime(room.stats.lastActivity)}
                  </div>
                )}

                {/* Active Session Info */}
                {room.activeSession?.isActive && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-2">
                    <p className="text-green-800 font-medium text-sm">{room.activeSession.title}</p>
                    <p className="text-green-600 text-xs">
                      Started: {formatTime(room.activeSession.startedAt)}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedRoom(selectedRoom === room._id ? null : room._id)}
                    className="w-full bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {selectedRoom === room._id ? 'Close Chat' : 'Open Chat'}
                  </button>
                  
                  <button
                    onClick={() => setShowModeration(showModeration === room._id ? null : room._id)}
                    className="w-full bg-yellow-500 text-white py-2 px-3 rounded-md hover:bg-yellow-600 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    {showModeration === room._id ? 'Close Tools' : 'Moderation Tools'}
                  </button>
                </div>
              </div>

              {/* Embedded Chat */}
              {selectedRoom === room._id && (
                <div className="border-t border-gray-200">
                  <div style={{ height: '400px' }}>
                    <ChatRoom 
                      programId={room.program._id} 
                      onClose={() => setSelectedRoom(null)} 
                    />
                  </div>
                </div>
              )}

              {/* Embedded Moderation */}
              {showModeration === room._id && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <CounsellorChatModeration roomId={room._id} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {chatRooms.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Chat Rooms Assigned</h3>
            <p className="text-gray-600 mb-4">Contact your administrator to get assigned to program chat rooms.</p>
            <button 
              onClick={fetchChatRooms}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounsellorChatDashboard;