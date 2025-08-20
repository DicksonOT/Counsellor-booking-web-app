import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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

const App = () => {
  const location = useLocation();
  const showNavbarFooter = location.pathname !== "/login";

  return (
    <div className="mt-24">
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
          <Route path="/screening" element={<MoodTrack/>} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/community" element={<Reviews />} />  
          <Route path="/crisis-support" element ={<CrisisSupportPage />} /> 
          <Route path="/therapy" element ={<OnlineTherapy />} /> 
          <Route path="/session/:roomId" element= {<TherapySession />} />
          <Route path="/meditation-center" element = {<MeditationCenter />} />
        </Routes>
      </main>
      {showNavbarFooter && <Footer />}
    </div>
  );
};

export default App;

