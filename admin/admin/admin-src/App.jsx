import React, { useContext, useState } from 'react'
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
import Communities from './pages/counsellor/Communities'
import CreateCommunityForm from './pages/admin/CreateCommunity'
import AdminDonations from './pages/admin/Donations'
import ActivityManager from './pages/counsellor/ActivityManager'
import CounsellorClients from './pages/counsellor/CounsellorClients'
import CounsellorDetails from './pages/admin/ViewCounsellorDetails'
import WellnessProgramsAdmin from './pages/admin/Programs'
import AdminChatManagement from './pages/admin/ChatManagement'
import CounsellorChatRoomsList from './pages/counsellor/ChatRooms'

const App = () => {
  const {aToken} = useContext(AdminContext)
  const {cToken} = useContext(CounsellorContext)
  const location = useLocation()
  const showSideBar = location.pathname !== "/"
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  return aToken || cToken ? (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container with mobile positioning */}
      <ToastContainer 
        position="top-center"
        className="mt-16 sm:mt-0"
        toastClassName="text-sm"
      />
      
      {/* Navigation Bar */}
      <NavBar 
        onToggleSidebar={toggleMobileSidebar}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />
      
      <div className="flex relative">
        {/* Desktop Sidebar */}
        {showSideBar && (
          <div className="hidden lg:block">
            <SideBar />
          </div>
        )}
        
        {/* Mobile Sidebar Overlay */}
        {showSideBar && isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            
            {/* Mobile Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
              <SideBar 
                isMobile={true}
                onClose={() => setIsMobileSidebarOpen(false)}
              />
            </div>
          </>
        )}
        
        {/* Main Content */}
        <div className="flex-1 w-full min-h-screen">
          {/* Add padding for mobile to account for fixed navbar */}
          <div className="pt-16 lg:pt-0">
            <Routes>
              {/* Admin routes */}
              <Route path='/' element={<Welcome />}/>
              <Route path='/admin-dashboard' element={<Dashboard />}/>
              <Route path='/add-counsellor' element={<AddCounsellor/>} />
              <Route path='/all-appointments' element={<AppointmentData />} />
              <Route path='/all-counsellors' element={<CounsellorsList/>} />
              <Route path='/approve-counsellors' element={<ApproveCounselors/>} />
              <Route path='/programs' element={<WellnessProgramsAdmin/>} />
              <Route path='/create-community' element={<CreateCommunityForm/>} />
              <Route path='/donations' element={<AdminDonations />} />
              <Route path='/counsellor-details' element={<CounsellorDetails />} />
               <Route path='/admin-chats' element={< AdminChatManagement />} />

              {/* Counsellor routes */}
              <Route path='/counsellor-dashboard' element={<CounsellorDashboard/>} />
              <Route path='/counsellor-appointments' element={<CounsellorAppointments/>} />
              <Route path='/counsellor-profile' element={<CounsellorProfile/>} />
              <Route path="/counsellor/client-profile/:userId" element={<UserProfile />} />
              <Route path="/counsellor/clients/:clientId" element={<UserProfile />} />
              <Route path="/session/:roomId" element={<TherapySession/>} />
              <Route path="/community" element={<Communities/>} />
              <Route path='/clients' element={<CounsellorClients />} />
              <Route path='/counsellor/clients' element={<CounsellorClients />} />
              <Route path='/counsellor-chat' element={< CounsellorChatRoomsList />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen">
      <Login />
      <ToastContainer 
        position="top-center"
        className="mt-4"
        toastClassName="text-sm"
      />
    </div>
  )
}

export default App