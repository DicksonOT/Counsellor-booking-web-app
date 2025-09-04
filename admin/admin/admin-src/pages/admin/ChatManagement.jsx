import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const ChatManagement = () => {
  const { aToken, backendUrl, counsellors, getAllCounsellors } = useContext(AdminContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState({});

  // Load chat rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/admin/chat-rooms`, {
          headers: { aToken },
        });
        setChatRooms(res.data?.chatRooms || []); // ✅ Fixed: access chatRooms property
      } catch (err) {
        console.error("Fetch chat rooms error:", err);
        toast.error("Failed to load chat rooms");
      }
    };
    fetchRooms();
    getAllCounsellors()
  }, [backendUrl, aToken]);

  // ✅ Debug: Log counsellors to check if they're loaded
  useEffect(() => {
    console.log("counsellors from context:", counsellors);
  }, [counsellors]);

  // ✅ Assign counsellor - FIXED parameter name
  const handleAssign = async (programId) => {
    const counsellorId = selectedCounselor[programId]; // ✅ Changed from counId to counsellorId
    if (!counsellorId) return toast.error("Please select a counselor first");

    try {
      const res = await axios.post(
        `${backendUrl}/api/admin/program/${programId}/assign-counsellor`,
        { counsellorId }, // ✅ Changed from counId to counsellorId
        { headers: { aToken } }
      );

      if (res.data.success || res.data.message) { // ✅ Handle both success patterns
        setChatRooms((prev) =>
          prev.map((room) =>
            room.program._id === programId ? { ...room, program: res.data.program } : room
          )
        );
        toast.success(res.data.message || "Counsellor assigned successfully");
        
        // ✅ Clear the selection after successful assignment
        setSelectedCounselor(prev => ({
          ...prev,
          [programId]: ""
        }));
      }
    } catch (err) {
      console.error("Assign error:", err);
      const errorMessage = err.response?.data?.message || "Failed to assign counsellor";
      toast.error(errorMessage);
    }
  };

  // ✅ Unassign counsellor - FIXED parameter name
  const handleUnassign = async (programId, counsellorId) => { // ✅ Changed from counId to counsellorId
    try {
      const res = await axios.delete(
        `${backendUrl}/api/admin/program/${programId}/unassign-counsellor/${counsellorId}`, // ✅ Updated URL param
        { headers: { aToken } }
      );

      if (res.data.success) {
        setChatRooms((prev) =>
          prev.map((room) =>
            room.program._id === programId ? { ...room, program: res.data.program } : room
          )
        );
        toast.success(res.data.message || "Counsellor unassigned successfully");
      }
    } catch (err) {
      console.error("Unassign error:", err);
      const errorMessage = err.response?.data?.message || "Failed to unassign counsellor";
      toast.error(errorMessage);
    }
  };

  return (
    <div mx-9>
      <h2 className="text-xl font-bold mb-4 text-blue-600">Chat Management</h2>

      {chatRooms.length === 0 ? (
        <p>No chat rooms found</p>
      ) : (
        chatRooms.map((room) => (
          <div key={room._id} className="p-4 border rounded mb-3">
            <h3 className="font-semibold">{room.program.title}</h3>
            <p className="text-sm text-gray-600 mb-3">
              Members: {room.stats?.totalMembers || 0} | 
              Messages: {room.stats?.totalMessages || 0} |
              Status: {room.status}
            </p>

            {/* Current counselors display */}
            {room.program.counselors && room.program.counselors.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-sm mb-2">Assigned Counselors:</h4>
                <div className="flex flex-wrap gap-2">
                  {room.program.counselors.map((counselor) => (
                    <div key={counselor._id || counselor} className="flex items-center bg-green-100 px-2 py-1 rounded">
                      <span className="text-sm">
                        {counselor.name || `Counselor ${counselor}`}
                      </span>
                      <button
                        onClick={() => handleUnassign(room.program._id, counselor._id || counselor)}
                        className="ml-2 text-red-500 hover:text-red-700 text-xs"
                        title="Remove counselor"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assign new counsellor */}
            <div className="flex items-center gap-2">
              <select
                value={selectedCounselor[room.program._id] || ""}
                onChange={(e) =>
                  setSelectedCounselor({
                    ...selectedCounselor,
                    [room.program._id]: e.target.value,
                  })
                }
                className="border p-2 rounded flex-1"
              >
                <option value="">Select a counsellor to assign</option>
                {counsellors
                  .filter(c => 
                    // ✅ Filter out already assigned counsellors
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

              <button
                onClick={() => handleAssign(room.program._id)}
                disabled={!selectedCounselor[room.program._id]}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Assign
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatManagement;