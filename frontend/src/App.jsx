import React, { useContext } from "react";
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
import { AlertCircle } from "lucide-react";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const showNavbarFooter = location.pathname !== "/login";

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

      {/* Emergency Support Notice */}
      <div className="fixed bottom-3 left-4 bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg shadow-lg lg:max-w-sm z-50">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="font-medium text-sm">Crisis Support</span>
        </div>
        <p className="text-xs">
          If you're in crisis, please contact emergency services or call the crisis hotline: 988
        </p>
      </div>

      {showNavbarFooter && <Footer />}
    </div>
  );
};

export default App;
