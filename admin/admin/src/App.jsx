import React, { useContext } from 'react'
import Login from './pages/Login' 
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext'
import NavBar from './components/NavBar'
import SideBar from './components/SideBar'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/admin/Dashboard'
import AddCunsellor from './pages/admin/AddCunsellor'
import CounsellorsList from './pages/admin/CounsellorsList'
import AppointmentData from './pages/admin/Appointments'
import { CounsellorContext } from './context/CounsellorContext'

const App = () => {

  const {aToken} = useContext(AdminContext)
  const {cToken} = useContext(CounsellorContext)

  return aToken || cToken ? (
    <div className='bg-[#F8F9FD] mx-4 sm:mx-[2%]'>
      <ToastContainer/>
      <NavBar />
      <div className='flex items-start'>
        <SideBar />
        <Routes>
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<Dashboard />}/>
          <Route path='/add-counsellor' element={<AddCunsellor/>} />
          <Route path='/all-appointments' element ={<AppointmentData />} />
          <Route path='/all-counsellors' element={<CounsellorsList/>} />
        </Routes>
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