import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Video, VideoOff, Mic, MicOff, PhoneOff, Monitor,
  Users, MessageCircle
} from "lucide-react";

const TherapySession = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Refs for video/audio and connections
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const socketRef = useRef(null);

  // State
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [error, setError] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);
  const [sessionNotes, setSessionNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const rtcConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" }
    ]
  };

  useEffect(() => {
    startSession();
    return cleanup;
  }, [roomId]);

  const startSession = async () => {
    try {
      await getLocalStream();
      initPeerConnection();
      initWebSocket();
    } catch (err) {
      handleMediaError(err);
    }
  };

  const getLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: { echoCancellation: true, noiseSuppression: true }
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
  };

  const initPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection(rtcConfig);

    // Add local stream
    localStreamRef.current?.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    // Remote stream
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      setIsConnected(true);
      setConnectionStatus("Connected with client");
    };

    // ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({ type: "ice-candidate", candidate: event.candidate });
      }
    };

    // Connection state
    peerConnectionRef.current.onconnectionstatechange = () => {
      switch (peerConnectionRef.current.connectionState) {
        case "connected":
          setConnectionStatus("Session active");
          break;
        case "disconnected":
          setConnectionStatus("Client disconnected");
          setIsConnected(false);
          break;
        case "failed":
          setError("Connection failed");
          break;
        default:
          break;
      }
    };
  };

  const initWebSocket = () => {
    const counsellorId = localStorage.getItem("counsellorId") || `counsellor-${Date.now()}`;
    const wsUrl = `${import.meta.env.VITE_WS_BASE_URL || "ws://localhost:4000"}/sessions/${counsellorId}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      setConnectionStatus("Connected to session");
      sendSignal({ type: "join-room", roomId, role: "counsellor" });
    };

    socketRef.current.onmessage = handleSignal;
    socketRef.current.onerror = () => setError("WebSocket connection error");
    socketRef.current.onclose = () => setConnectionStatus("Connection closed");
  };

  const handleSignal = async (event) => {
    const msg = JSON.parse(event.data);
    switch (msg.type) {
      case "offer":
        await handleOffer(msg.offer);
        break;
      case "answer":
        await handleAnswer(msg.answer);
        break;
      case "ice-candidate":
        await handleIceCandidate(msg.candidate);
        break;
      case "client-joined":
        setClientInfo(msg.clientInfo || { name: "Client" });
        await createOffer();
        break;
      case "client-left":
        setConnectionStatus("Client left session");
        setIsConnected(false);
        break;
      default:
        console.log("Unknown message", msg);
    }
  };

  const sendSignal = (data) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ ...data, roomId, role: "counsellor" }));
    }
  };

  const createOffer = async () => {
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    sendSignal({ type: "offer", offer });
  };

  const handleOffer = async (offer) => {
    await peerConnectionRef.current.setRemoteDescription(offer);
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);
    sendSignal({ type: "answer", answer });
  };

  const handleAnswer = async (answer) => {
    await peerConnectionRef.current.setRemoteDescription(answer);
  };

  const handleIceCandidate = async (candidate) => {
    try {
      await peerConnectionRef.current.addIceCandidate(candidate);
    } catch (err) {
      console.error("Error adding ICE candidate", err);
    }
  };

  const handleMediaError = (err) => {
    if (err.name === "NotAllowedError") {
      setError("Camera/microphone access denied.");
    } else if (err.name === "NotFoundError") {
      setError("No camera or microphone found.");
    } else {
      setError("Failed to access media devices.");
    }
  };

  const toggleVideo = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsVideoEnabled(track.enabled);
    }
  };

  const toggleAudio = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsAudioEnabled(track.enabled);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await getLocalStream();
        setIsScreenSharing(false);
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current.getSenders().find(s => s.track.kind === "video");
        if (sender) await sender.replaceTrack(videoTrack);
        localVideoRef.current.srcObject = screenStream;
        setIsScreenSharing(true);
        videoTrack.onended = () => toggleScreenShare();
      }
    } catch (err) {
      console.error("Screen share error", err);
    }
  };

  const endSession = () => {
    sendSignal({ type: "counsellor-left", notes: sessionNotes });
    cleanup();
    navigate("/counsellor/dashboard");
  };

  const cleanup = () => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    peerConnectionRef.current?.close();
    socketRef.current?.close();
    setIsConnected(false);
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-red-500 font-bold text-xl mb-2">Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 text-white flex justify-between">
        <div>
          <h1 className="text-xl font-bold">Counsellor Session</h1>
          <p>Room: {roomId} {clientInfo && `• Client: ${clientInfo.name}`}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setShowNotes(!showNotes)} className="bg-blue-600 px-3 py-1 rounded">
            <MessageCircle size={16} className="inline mr-1" /> Notes
          </button>
          <span className={`px-3 py-1 rounded-full ${isConnected ? "bg-green-600" : "bg-yellow-600"}`}>
            {connectionStatus}
          </span>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Video Area */}
        <div className={`p-4 ${showNotes ? "w-2/3" : "w-full"}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative bg-gray-800 rounded-lg">
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              {!isConnected && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Users size={40} />
                  <p>Waiting for client...</p>
                </div>
              )}
            </div>
            <div className="relative bg-gray-800 rounded-lg">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <VideoOff size={40} />
                  <p>Camera off</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        {showNotes && (
          <div className="w-1/3 bg-gray-800 p-4">
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              className="w-full h-full p-2 bg-gray-700 text-white rounded"
              placeholder="Session notes..."
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex justify-center space-x-4">
        <button onClick={toggleVideo} className={`p-4 rounded-full ${isVideoEnabled ? "bg-gray-600" : "bg-red-600"}`}>
          {isVideoEnabled ? <Video /> : <VideoOff />}
        </button>
        <button onClick={toggleAudio} className={`p-4 rounded-full ${isAudioEnabled ? "bg-gray-600" : "bg-red-600"}`}>
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </button>
        <button onClick={toggleScreenShare} className={`p-4 rounded-full ${isScreenSharing ? "bg-blue-600" : "bg-gray-600"}`}>
          <Monitor />
        </button>
        <button onClick={endSession} className="p-4 rounded-full bg-red-600">
          <PhoneOff />
        </button>
      </div>
    </div>
  );
};

export default TherapySession;
