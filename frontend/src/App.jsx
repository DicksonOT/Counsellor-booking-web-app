import React, { useContext, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "./context/AppContext";
import FloatingBot from "./components/FloatingBot";
import Home from "./pages/Home";
import Counsellors from "./pages/Counsellors";
import About from "./pages/AboutPage";
import Profile from "./pages/Profile";
import MyAppointment from "./pages/MyAppointment";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Specialty from "./pages/Specialty";
import CounsellorsSpecialty from "./components/CounsellorsSpecialty";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from 'react-toastify';
import Chatbot from "./components/Bot";
import PrivacyPolicy from "./components/Policy";
import TermsOfService from "./components/Terms";
import CookiePolicy from "./components/Cookie";
import RegisterCounsellor from "./components/Registration";
import CounselorSignupForm from "./components/SignupForm";
import Reviews from "./components/Community";
import MoodTrack from "./pages/MoodTrack";
import Assessments from "./pages/Assessments";
import CrisisSupportPage from "./pages/CrisisSupportPage";
import OnlineTherapy from "./pages/OnlineTherapy";
import TherapySession from "./components/LiveSession";
import MeditationCenter from "./pages/MeditationCenter";
import WellnessPrograms from "./pages/WellnessPrograms";
import MentalHealthLibrary from "./pages/Library";
import CommunitiesPage from "./pages/Communities";
import WellnessActivities from "./components/WellnessActivities";
import DonatePage from "./pages/Donations";
import DonationSuccessPage from "./components/DonationSuccess";
import DonationHistoryPage from "./components/DonationHistory";
import DonationManagementPage from "./components/DonationManagement";
import ProgramChatRoom from "./components/ChatRoom";
import { AlertCircle, X, MessageCircle } from "lucide-react"; // Import X and MessageCircle

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const [showCrisisMessage, setShowCrisisMessage] = useState(false);
  const [showBotGreeting, setShowBotGreeting] = useState(true); // New state for chatbot greeting

  const showNavbarFooter = location.pathname !== "/login";
  const showCrisisNotice = location.pathname !== "/bot";

  const handleBotClick = (destination) => {
    if (destination === 'login') {
      navigate('/login');
      window.scrollTo(0, 0)
    } else if (destination === 'bot') {
      navigate('/bot');
    }
  };

  return (
    <div className="3xl:mx-5 mt-24">
      {showNavbarFooter && <Navbar />}
      <ToastContainer />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/counsellors" element={<Counsellors />} />
          <Route path="/speciality" element={<Specialty />} />
          <Route path="/about" element={<About />} />
          <Route path="/my-profile" element={<Profile />} />
          <Route path="/counsellors/:specialty" element={<CounsellorsSpecialty />} />
          <Route path="/my-appointment" element={<MyAppointment />} />
          <Route path="/appointment/:counId" element={<Appointment />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/bot" element={<Chatbot />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/registration" element={<RegisterCounsellor />} />
          <Route path="/signup/step-1" element={<CounselorSignupForm />} />
          <Route path="/screening" element={<MoodTrack />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/community" element={<Reviews />} />
          <Route path="/crisis-support" element={<CrisisSupportPage />} />
          <Route path="/sessions" element={<OnlineTherapy />} />
          <Route path="/session/:roomId" element={<TherapySession />} />
          <Route path="/meditation-center" element={<MeditationCenter />} />
          <Route path="/wellness-programs" element={<WellnessPrograms />} />
          <Route path="/library" element={<MentalHealthLibrary />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/activity" element={<WellnessActivities />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/donation-success" element={<DonationSuccessPage />} />
          <Route path="/my-donations" element={<DonationHistoryPage />} />
          <Route path="/manage-donations" element={<DonationManagementPage />} />
          <Route path="/chat/program/:programId" element={<ProgramChatRoom />} />
        </Routes>
      </main>

      <FloatingBot
        onBotClick={handleBotClick}
        isLoggedIn={!!token}
        currentPath={location.pathname}
      />

      {/* Chatbot Greeting Message with close button */}
      {showBotGreeting && location.pathname !== "/bot" && (
        <div className="fixed bottom-20 right-4 bg-white text-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 z-50 animate-fade-in-up transition-opacity duration-300">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <p className="text-sm font-semibold">I'm ready when you are!</p>
            </div>
            <button 
              onClick={() => setShowBotGreeting(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-600">
            Click the chat icon to begin.
          </p>
        </div>
      )}

      {/* Emergency Support Notice - Responsive */}
      {showCrisisNotice && (
        <>
          {/* Icon for smaller screens */}
          <div
            className="fixed bottom-3 left-4 bg-red-500 text-white p-2 rounded-full shadow-lg cursor-pointer sm:hidden z-50"
            onClick={() => setShowCrisisMessage(!showCrisisMessage)}
          >
            <AlertCircle className="w-6 h-6" />
          </div>

          {/* Message for smaller screens (shown when icon is clicked) */}
          {showCrisisMessage && (
            <div className="fixed bottom-3 left-4 right-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg shadow-lg sm:hidden z-50">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-sm">Crisis Support</span>
                </div>
                <X className="w-4 h-4 cursor-pointer text-red-600" onClick={() => setShowCrisisMessage(false)} />
              </div>
              <p className="text-xs">
                If you're in crisis, please contact emergency services or call the crisis hotline: 988
              </p>
            </div>
          )}

          {/* Message for larger screens (always visible) */}
          <div className="fixed bottom-3 left-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg shadow-lg hidden sm:block z-50">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="font-medium text-sm">Crisis Support</span>
            </div>
            <p className="text-xs">
              If you're in crisis, please contact emergency services or call the crisis hotline: 988
            </p>
          </div>
        </>
      )}

      {showNavbarFooter && <Footer />}
    </div>
  );
};

export default App;