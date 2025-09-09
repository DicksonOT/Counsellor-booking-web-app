import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import {
  MessageCircle,
  Users,
  MessageSquare,
  UserCheck,
  UserMinus,
  Plus,
  Search,
  Filter,
  Activity,
  Clock,
  Crown,
  Shield,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const ChatManagement = () => {
  const { aToken, backendUrl, counsellors, getAllCounsellors } = useContext(AdminContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedRoom, setExpandedRoom] = useState(null);

  // Load chat rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/admin/chat-rooms`, {
          headers: { aToken },
        });
        const data = await res.json();
        setChatRooms(data?.chatRooms || []);
      } catch (err) {
        console.error("Fetch chat rooms error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
    getAllCounsellors();
  }, [backendUrl, aToken]);

  // Filter chat rooms based on search and status
  const filteredChatRooms = chatRooms.filter(room => {
    const matchesSearch = !searchTerm || 
      room.program.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Assign counsellor
  const handleAssign = async (programId) => {
    const counsellorId = selectedCounselor[programId];
    if (!counsellorId) return;

    try {
      const res = await fetch(
        `${backendUrl}/api/admin/program/${programId}/assign-counsellor`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            aToken 
          },
          body: JSON.stringify({ counsellorId })
        }
      );
      const data = await res.json();

      if (data.success || data.message) {
        setChatRooms((prev) =>
          prev.map((room) =>
            room.program._id === programId ? { ...room, program: data.program } : room
          )
        );
        
        setSelectedCounselor(prev => ({
          ...prev,
          [programId]: ""
        }));
      }
    } catch (err) {
      console.error("Assign error:", err);
    }
  };

  // Unassign counsellor
  const handleUnassign = async (programId, counsellorId) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/admin/program/${programId}/unassign-counsellor/${counsellorId}`,
        {
          method: 'DELETE',
          headers: { aToken }
        }
      );
      const data = await res.json();

      if (data.success) {
        setChatRooms((prev) =>
          prev.map((room) =>
            room.program._id === programId ? { ...room, program: data.program } : room
          )
        );
      }
    } catch (err) {
      console.error("Unassign error:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-blue-50 text-blue-600';
      case 'pending': return 'bg-blue-200 text-blue-900';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return <Activity className="w-3 h-3" />;
      case 'inactive': return <Clock className="w-3 h-3" />;
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      default: return <MessageCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-600 rounded-lg mr-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Chat Management</h1>
            <p className="text-blue-600">Manage chat rooms and counsellor assignments</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total Rooms</p>
                <p className="text-2xl font-bold text-blue-700">{chatRooms.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Active Rooms</p>
                <p className="text-2xl font-bold text-blue-700">
                  {chatRooms.filter(room => room.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <Activity className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total Members</p>
                <p className="text-2xl font-bold text-blue-700">
                  {chatRooms.reduce((sum, room) => sum + (room.stats?.totalMembers || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-300 rounded-lg">
                <Users className="w-6 h-6 text-blue-800" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total Messages</p>
                <p className="text-2xl font-bold text-blue-700">
                  {chatRooms.reduce((sum, room) => sum + (room.stats?.totalMessages || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-400 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search chat rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chat Rooms */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredChatRooms.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="mx-auto h-12 w-12 text-blue-400 mb-4" />
          <h3 className="text-lg font-medium text-blue-900 mb-2">No chat rooms found</h3>
          <p className="text-blue-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChatRooms.map((room) => (
            <div key={room._id} className="bg-white rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              {/* Room Header */}
              <div className="p-6 border-b border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800">
                        {room.program.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                          {getStatusIcon(room.status)}
                          <span className="capitalize">{room.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setExpandedRoom(expandedRoom === room._id ? null : room._id)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <ChevronRight 
                      className={`w-5 h-5 text-blue-400 transition-transform ${
                        expandedRoom === room._id ? 'rotate-90' : ''
                      }`} 
                    />
                  </button>
                </div>

                {/* Room Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600">
                      <span className="font-medium text-blue-800">{room.stats?.totalMembers || 0}</span> Members
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600">
                      <span className="font-medium text-blue-800">{room.stats?.totalMessages || 0}</span> Messages
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-700" />
                    <span className="text-sm text-blue-600">
                      <span className="font-medium text-blue-800">
                        {room.program.counselors?.length || 0}
                      </span> Counsellors
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedRoom === room._id && (
                <div className="p-6 bg-blue-50">
                  {/* Current Counselors */}
                  {room.program.counselors && room.program.counselors.length > 0 && (
                    <div className="mb-6">
                      <h4 className="flex items-center text-sm font-medium text-blue-700 mb-3">
                        <UserCheck className="w-4 h-4 mr-2 text-blue-500" />
                        Assigned Counselors
                      </h4>
                      <div className="space-y-3">
                        {room.program.counselors.map((counselor) => (
                          <div 
                            key={counselor._id || counselor} 
                            className="flex items-center justify-between bg-white rounded-lg p-4 border border-blue-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Crown className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <span className="font-medium text-blue-800">
                                  {counselor.name || `Counselor ${counselor}`}
                                </span>
                                {counselor.email && (
                                  <p className="text-xs text-blue-500">{counselor.email}</p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleUnassign(room.program._id, counselor._id || counselor)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Remove counselor"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assign New Counsellour */}
                  <div className="bg-white rounded-lg p-6 border border-blue-200">
                    <h4 className="flex items-center text-sm font-medium text-blue-700 mb-4">
                      <Plus className="w-4 h-4 mr-2 text-blue-500" />
                      Assign New Counsellour
                    </h4>
                    
                    <div className="flex flex-col md:flex-row gap-3">
                      <div className="flex-1">
                        <select
                          value={selectedCounselor[room.program._id] || ""}
                          onChange={(e) =>
                            setSelectedCounselor({
                              ...selectedCounselor,
                              [room.program._id]: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select a counsellour to assign</option>
                          {counsellors
                            ?.filter(c => 
                              !room.program.counsellors?.some(assigned => 
                                (assigned._id || assigned) === c._id
                              )
                            )
                            .map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.name} ({c.email}) - {c.specialty || 'General'}
                              </option>
                            ))
                          }
                        </select>
                      </div>

                      <button
                        onClick={() => handleAssign(room.program._id)}
                        disabled={!selectedCounselor[room.program._id]}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Assign
                      </button>
                    </div>

                    {counsellors?.filter(c => 
                      !room.program.counsellors?.some(assigned => 
                        (assigned._id || assigned) === c._id
                      )
                    ).length === 0 && (
                      <div className="mt-4 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="text-sm text-blue-700">
                            All available counsellours are already assigned to this program
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatManagement;