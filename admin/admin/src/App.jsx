import React, { useContext } from 'react'
import Login from './pages/Login' 
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext'
import NavBar from './components/NavBar'
import SideBar from './components/SideBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './pages/admin/Dashboard'
import AddCounsellor from './pages/admin/AddCounsellor'
import CounsellorsList from './pages/admin/CounsellorsList'
import AppointmentData from './pages/admin/Appointments'
import { CounsellorContext } from './context/CounsellorContext'
import CounsellorAppointments from './pages/counsellor/CounsellorAppointments'
import CounsellorProfile from './pages/counsellor/CounsellorProfile'
import CounsellorDashboard from './pages/counsellor/CounsellorDashboard'
import Welcome from './components/Welcome'
import ApproveCounselors from './pages/admin/ApproveCounselors'
import UserProfile from './components/ClientProfile'
import TherapySession from './pages/counsellor/TherapySession'
import Programs from './pages/admin/Programs'
import Communities from './pages/counsellor/Communities'
import CreateCommunityForm from './pages/admin/CreateCommunity'
import AdminDonations from './pages/admin/Donations'

const App = () => {

  const {aToken} = useContext(AdminContext)
  const {cToken} = useContext(CounsellorContext)
  const location = useLocation()
  const showSideBar = location.pathname !== "/"

  return aToken || cToken ? (
    <div className="min-h-screen">
      <ToastContainer/>
      {showSideBar && <NavBar/>}
      <div className='flex'>
        {showSideBar && <SideBar />}
        <div className="flex-1 w-full">
          <Routes>

            {/* Admin route */}
            <Route path='/' element={<Welcome />}/>
            <Route path='/admin-dashboard' element={<Dashboard />}/>
            <Route path='/add-counsellor' element={<AddCounsellor/>} />
            <Route path='/all-appointments' element ={<AppointmentData />} />
            <Route path='/all-counsellors' element={<CounsellorsList/>} />
            <Route path='/approve-counsellors' element={<ApproveCounselors/>} />
            <Route path='/programs' element={<Programs/>} />
            <Route path='/create-community' element={<CreateCommunityForm/>} />
            <Route path='/donations' element={<AdminDonations />} />

            {/* Counsellor route */}
            <Route path='/counsellor-dashboard' element={<CounsellorDashboard/>} />
            <Route path='/counsellor-appointments' element={<CounsellorAppointments/>} />
            <Route path='/counsellor-profile' element={<CounsellorProfile/>} />
            <Route path="/counsellor/client-profile/:userId" element={<UserProfile />} />
            <Route path="/session/:roomId" element= {<TherapySession/>} />
            <Route path="/community" element= {<Communities/>} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
    <Login/>
      <ToastContainer/>
    </>
  )
}

export default App