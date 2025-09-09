import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, Users } from "lucide-react";

const TherapySession = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [error, setError] = useState(null);

  const rtcConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  };

  useEffect(() => {
    joinSession();
    return cleanup;
  }, [roomId]);

  const joinSession = async () => {
    try {
      await getUserMedia();
      initPeerConnection();

      const wsUrl = `wss://counsellor-booking-web-app-1.onrender.com/sessions/user/${roomId}`;
      console.log("Connecting to WebSocket:", wsUrl)
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        setConnectionStatus("Connected to signalling server");
        socketRef.current.send(JSON.stringify({
          type: "join-room",
          roomId,
          role: "user"
        }));
      };

      socketRef.current.onmessage = handleSocketMessage;
      socketRef.current.onerror = () => setError("WebSocket connection error");
      socketRef.current.onclose = () => setConnectionStatus("Connection closed");
    } catch (err) {
      console.log(err)
      setError("Unable to start session. Check your camera/mic permissions.");
    }
  };

  const getUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
  };

  const initPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection(rtcConfig);

    localStreamRef.current.getTracks().forEach(track =>
      peerConnectionRef.current.addTrack(track, localStreamRef.current)
    );

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      setIsConnected(true);
      setConnectionStatus("Connected to counsellor");
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.send(JSON.stringify({
          type: "webrtc-ice-candidate",
          candidate: event.candidate,
          roomId,
          role: "user"
        }));
      }
    };
  };

  const handleSocketMessage = async (event) => {
    const msg = JSON.parse(event.data);

    switch (msg.type) {
      case "webrtc-offer":
        await peerConnectionRef.current.setRemoteDescription(msg.offer);
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socketRef.current.send(JSON.stringify({
          type: "webrtc-answer",
          answer,
          roomId,
          role: "user"
        }));
        break;

      case "webrtc-ice-candidate":
        if (msg.candidate) await peerConnectionRef.current.addIceCandidate(msg.candidate);
        break;

      case "counsellor-left-room":
        setConnectionStatus("Counsellor left the session");
        setIsConnected(false);
        break;

      default:
        console.log("Unknown message type:", msg.type);
    }
  };

  const toggleVideo = () => {
    const track = localStreamRef.current.getVideoTracks()[0];
    track.enabled = !track.enabled;
    setIsVideoEnabled(track.enabled);
  };

  const toggleAudio = () => {
    const track = localStreamRef.current.getAudioTracks()[0];
    track.enabled = !track.enabled;
    setIsAudioEnabled(track.enabled);
  };

  const cleanup = () => {
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (socketRef.current) socketRef.current.close();
    setIsConnected(false);
  };

  const endSession = () => {
    cleanup();
    navigate("/sessions");
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        <div className="bg-red-600 p-6 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 text-white flex justify-between">
        <div>
          <h1 className="text-xl font-bold">Therapy Session</h1>
          <p className="text-sm">{connectionStatus}</p>
        </div>
      </div>

      {/* Videos */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Remote Video */}
        <div className="relative bg-black rounded overflow-hidden">
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          {!isConnected && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <Users size={40} />
              <p>Waiting for counsellor...</p>
            </div>
          )}
        </div>

        {/* Local Video */}
        <div className="relative bg-black rounded overflow-hidden">
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-black/50">
              <VideoOff size={40} />
              <p className="ml-2">Camera Off</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex justify-center space-x-4">
        <button onClick={toggleVideo} className="p-3 bg-gray-700 rounded-full text-white">
          {isVideoEnabled ? <Video /> : <VideoOff />}
        </button>
        <button onClick={toggleAudio} className="p-3 bg-gray-700 rounded-full text-white">
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </button>
        <button onClick={endSession} className="p-3 bg-red-600 rounded-full text-white">
          <PhoneOff />
        </button>
      </div>
    </div>
  );
};

export default TherapySession;
