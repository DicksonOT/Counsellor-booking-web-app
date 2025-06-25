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
import { ToastContainer, toast } from 'react-toastify';
import Chatbot from "./components/Bot";

const App = () => {
  const location = useLocation();
  const showNavbarFooter = location.pathname !== "/login"

  return (
    <div className="mt-16">
    {showNavbarFooter && <Navbar />}
      <ToastContainer />
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
      </Routes>
      {showNavbarFooter && <Footer />}
    </div>
  );
};

export default App;
