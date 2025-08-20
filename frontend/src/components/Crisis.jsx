import React, { useState, useContext } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const CrisisSupport = () => {
const { token, backendUrl } = useContext(AppContext)
  const [message, setMessage] = useState("");
  const [helplines, setHelplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImmediateHelp, setShowImmediateHelp] = useState(true);
  const [urgencyLevel, setUrgencyLevel] = useState("moderate");
  const [alertSent, setAlertSent] = useState(false);

  // Immediate crisis resources - always visible
  const emergencyContacts = [
    { name: "National Suicide Prevention Lifeline", phone: "988", available: "24/7" },
    { name: "Crisis Text Line", phone: "Text HOME to 741741", available: "24/7" },
    { name: "Emergency Services", phone: "911", available: "24/7" },
    { name: "SAMHSA National Helpline", phone: "1-800-662-4357", available: "24/7" }
  ];

  const copingStrategies = [
    "Take 5 deep breaths - inhale for 4, hold for 4, exhale for 6",
    "Ground yourself: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
    "Call a trusted friend or family member right now",
    "Go to a safe, public place if you're alone",
    "Remove any means of self-harm from your immediate area"
  ];

  const crisisVideos = [
    {
      title: "5-Minute Breathing Exercise for Anxiety",
      description: "Guided breathing to help you calm down right now",
      duration: "5:23",
      type: "breathing",
      thumbnail: "🫁",
      embedId: "aXItOY0sLRY"
    },
    {
      title: "Grounding Technique: 5-4-3-2-1 Method",
      description: "Step-by-step grounding exercise to reconnect with the present",
      duration: "3:45",
      type: "grounding",
      thumbnail: "🌱",
      embedId: "30VMIEmA0Co"
    },
    {
      title: "Self-Soothing for Crisis Moments",
      description: "Quick techniques to comfort yourself during distress",
      duration: "4:12",
      type: "soothing",
      thumbnail: "🤗",
      embedId: "92i5m3tV5XY"
    },
    {
      title: "Progressive Muscle Relaxation",
      description: "Release physical tension and mental stress",
      duration: "8:30",
      type: "relaxation",
      thumbnail: "💆",
      embedId: "ihO02wUzgkc"
    }
  ];

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideos, setShowVideos] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const moodScore =
      urgencyLevel === "high" ? 1 : urgencyLevel === "moderate" ? 3 : 5;

    const {data} = await axios.post( `${backendUrl}/api/user/crisis-support`, { message, moodScore }, { headers: { token } });
    console.log(data);

    if (data.success) {
      setHelplines(data.helplines || []);
      toast.success(data.message);
      setAlertSent(true);
      setMessage("");
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const handleCallNow = (phone) => {
    if (phone.includes("Text")) {
      // Simulate toast info
      console.log("Open your messaging app and text HOME to 741741");
      alert("Open your messaging app and text HOME to 741741");
    } else {
      window.location.href = `tel:${phone.replace(/\D/g, '')}`;
    }
  };

  return (
    <div className="min-h-screen pt-9">

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Left Column - Emergency & Immediate Help */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Immediate Emergency Contacts */}
            {showImmediateHelp && (
              <div className="bg-white shadow-xl rounded-xl border-l-4 border-red-500 overflow-hidden">
                <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">URGENT</span>
                      <h2 className="text-lg font-bold text-red-800">Call Now</h2>
                    </div>
                    <button 
                      onClick={() => setShowImmediateHelp(false)}
                      className="text-red-400 hover:text-red-600 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-800 text-sm">{contact.name}</h3>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          {contact.available}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-mono text-blue-600 font-bold">{contact.phone}</span>
                        <button
                          onClick={() => handleCallNow(contact.phone)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          {contact.phone.includes("Text") ? "Text" : "Call"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Immediate Coping Strategies */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <h2 className="text-lg font-bold text-blue-800 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Right Now: Do This
                </h2>
              </div>
              
              <div className="p-6 space-y-3">
                {copingStrategies.map((strategy, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <span className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{strategy}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Resources */}
            {helplines.length > 0 && (
              <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                  <h2 className="text-lg font-bold text-green-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Local Resources
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {helplines.map((line, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm">{line.name}</h3>
                          <p className="text-lg font-mono text-blue-600 font-bold">{line.phone}</p>
                        </div>
                        <button
                          onClick={() => handleCallNow(line.phone)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Call
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Videos & Crisis Alert */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Crisis Alert Form */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Connect with Our Crisis Team</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Our trained counselors will be notified immediately and will reach out to you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Urgency Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How urgent is your situation?
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: "high", label: "High - I need immediate help", color: "red", bgColor: "red-50", borderColor: "red-500" },
                      { value: "moderate", label: "Moderate - I need support soon", color: "yellow", bgColor: "yellow-50", borderColor: "yellow-500" },
                      { value: "low", label: "Low - I need someone to talk to", color: "green", bgColor: "green-50", borderColor: "green-500" }
                    ].map(({ value, label, color, bgColor, borderColor }) => (
                      <label key={value} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        urgencyLevel === value 
                          ? `border-${borderColor} bg-${bgColor}` 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}>
                        <input
                          type="radio"
                          value={value}
                          checked={urgencyLevel === value}
                          onChange={(e) => setUrgencyLevel(e.target.value)}
                          className={`mr-3 text-${color}-500 w-4 h-4`}
                        />
                        <span className="font-medium">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us what's happening
                  </label>
                  <textarea
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32 resize-none"
                    placeholder="Describe how you're feeling and what's going on. The more details you provide, the better we can help you."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Your message will be sent securely to our crisis response team.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className={`w-full px-6 py-4 rounded-lg font-medium text-white text-lg transition-all transform hover:scale-[1.02] ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : urgencyLevel === 'high'
                          ? 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
                          : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Alert...
                      </span>
                    ) : (
                      `Send ${urgencyLevel === 'high' ? 'Urgent' : ''} Crisis Alert`
                    )}
                  </button>

                  {loading && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-center font-medium">
                        🚨 Sending your crisis alert to our team. Someone will respond shortly.
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Crisis Videos Section */}
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 px-6 py-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-teal-800 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                    Guided Support Videos
                  </h2>
                  <button
                    onClick={() => setShowVideos(!showVideos)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    {showVideos ? "Hide Videos" : "Show Videos"}
                  </button>
                </div>
              </div>

              {showVideos && (
                <div className="p-6">
                  {selectedVideo && (
                    <div className="mb-6">
                      <div className="bg-gray-100 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-gray-800">{selectedVideo.title}</h3>
                            <p className="text-gray-600 text-sm">{selectedVideo.description}</p>
                            <span className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs mt-2">
                              {selectedVideo.duration}
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedVideo(null)}
                            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                          >
                            ×
                          </button>
                        </div>
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${selectedVideo.embedId}?autoplay=1&rel=0`}
                            title={selectedVideo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {crisisVideos.map((video, index) => (
                      <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="text-3xl">{video.thumbnail}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">{video.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                {video.duration}
                              </span>
                              <button
                                onClick={() => setSelectedVideo(video)}
                                className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                              >
                                Watch Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm text-teal-800">
                          <strong>Video Tips:</strong> Find a quiet space, use headphones if available, and follow along with the exercises. 
                          These videos are designed by mental health professionals to help in crisis moments.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Safety Reminder - Full Width */}
        <div className="mt-8 bg-blue-500 text-white rounded-xl p-8 text-center shadow-xl">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Remember: Your Safety Matters</h3>
            <p className="text-lg text-blue-100 leading-relaxed">
              If you are in immediate danger, don't wait - call 911 or go to your nearest emergency room.
              You are valued, and there are people who want to help you through this difficult time.
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">24/7 Support</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">Professional Help</span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">You Matter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupport;