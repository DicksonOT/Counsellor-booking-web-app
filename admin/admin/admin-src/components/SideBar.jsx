import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { CounsellorContext } from '../context/CounsellorContext'

// Icon Components using Tailwind CSS
const DonationIcon = ({ className = "w-5 h-5" }) => (
  <div className={`${className} relative flex items-center justify-center`}>
    <div className="absolute inset-0 bg-gray-500 rounded-full transform rotate-45"></div>
    <div className="absolute inset-1 bg-gray-400 rounded-full transform -rotate-12"></div>
    <span className="relative z-10 text-white text-xs font-bold">$</span>
  </div>
);

const ProgramIcon = ({ className = "w-5 h-5" }) => (
  <div className={`${className} relative bg-gray-500 rounded border-2 border-gray-600`}>
    <div className="absolute -top-1 left-1 w-0.5 h-2 bg-gray-600"></div>
    <div className="absolute -top-1 right-1 w-0.5 h-2 bg-gray-600"></div>
    <div className="absolute top-1 left-0 right-0 h-0.5 bg-gray-300"></div>
    <div className="flex justify-center items-center space-x-0.5 mt-2">
      <div className="w-1 h-1 bg-white rounded-full"></div>
      <div className="w-1 h-1 bg-white rounded-full"></div>
      <div className="w-1 h-1 bg-white rounded-full"></div>
    </div>
  </div>
);

const CommunityIcon = ({ className = "w-5 h-5" }) => (
  <div className={`${className} relative flex items-center justify-center`}>
    <div className="absolute left-0 top-0 w-3 h-3 bg-gray-500 rounded-full"></div>
    <div className="absolute right-0 top-1 w-2 h-2 bg-gray-400 rounded-full"></div>
    <div className="absolute bottom-0 left-0.5 w-4 h-1.5 bg-gradient-to-r from-gray-500 to-gray-400 rounded-full"></div>
    <div className="absolute bottom-0 right-0 w-2.5 h-1 bg-gray-300 rounded-full"></div>
  </div>
);

const ActivityIcon = ({ className = "w-5 h-5" }) => (
  <div className={`${className} relative bg-gray-500 rounded-full flex items-center justify-center border-2 border-gray-600`}>
    <div className="w-0 h-0 border-l-2 border-r-0 border-t-1 border-b-1 border-l-white border-t-transparent border-b-transparent ml-0.5"></div>
  </div>
);

const ProfileIcon = ({ className = "w-5 h-5" }) => (
  <div className={`${className} relative flex flex-col items-center justify-center`}>
    <div className="w-2.5 h-2.5 bg-gray-500 rounded-full mb-0.5"></div>
    <div className="w-4 h-2 bg-gray-400 rounded-full"></div>
  </div>
);

const ClientsIcon = ({ className = "w-5 h-5" }) => (
  <div className={`${className} relative flex items-center justify-center`}>
    <div className="absolute left-0 top-0 w-2.5 h-2.5 bg-gray-500 rounded-full"></div>
    <div className="absolute right-0.5 top-0.5 w-2 h-2 bg-gray-400 rounded-full"></div>
    <div className="absolute bottom-0 left-0 w-3.5 h-1.5 bg-gray-500 rounded-full"></div>
    <div className="absolute bottom-0 right-0 w-2.5 h-1 bg-gray-400 rounded-full"></div>
    <div className="absolute top-1 right-0 w-2 h-3 bg-white border border-gray-300 rounded"></div>
    <div className="absolute top-1.5 right-0.5 w-1 h-0.5 bg-gray-300"></div>
    <div className="absolute top-2.5 right-0.5 w-1 h-0.5 bg-gray-300"></div>
  </div>
);

const ModerateIcon = ({ className = "w-5 h-5" }) => (
  <div className={`${className} relative bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-full rounded-b-sm flex items-center justify-center border border-gray-600`}>
    <div className="w-2 h-1.5 flex items-center justify-center">
      <div className="w-0 h-0 border-l-1 border-r-0 border-t-1 border-b-0 border-l-white border-t-transparent transform rotate-45 scale-75"></div>
    </div>
  </div>
);

const SideBar = ({ isMobile, onClose }) => {
  const {aToken} = useContext(AdminContext)
  const {cToken} = useContext(CounsellorContext)

  // Handle link click on mobile to close sidebar
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  const linkClassName = ({isActive}) => 
    `flex items-center gap-3 py-3.5 px-3 md:px-9 ${isMobile ? 'min-w-full' : 'md:min-w-72'} cursor-pointer transition-colors duration-200 ${
      isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-500 text-blue-600' : 'hover:bg-gray-50'
    }`

  return (
    <div className={`${isMobile ? 'h-full' : 'min-h-screen'} bg-white ${!isMobile && 'border-r'} flex flex-col`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex justify-between items-center p-4 border-b border-blue-200 bg-blue-50">
          <h2 className="text-lg font-semibold text-blue-600">Menu</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-blue-100 rounded-full transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto">
        {aToken && (
          <ul className='text-[#515151] mt-5 space-y-1'>
            <li>
              <NavLink 
                className={linkClassName} 
                to={'/'}
                onClick={handleLinkClick}
              >
                <img src={assets.home_icon} alt='' className="w-5 h-5" />
                <p className="font-medium">Home</p>
              </NavLink>
            </li>

            <li>
              <NavLink 
                className={linkClassName} 
                to={'/admin-dashboard'}
                onClick={handleLinkClick}
              >
                <img src={assets.home_icon} alt='' className="w-5 h-5" />
                <p className="font-medium">Dashboard</p>
              </NavLink>
            </li>

            <li>
              <NavLink 
                className={linkClassName} 
                to={'/add-counsellor'}
                onClick={handleLinkClick}
              >
                <img src={assets.add_icon} alt='' className="w-5 h-5" />
                <p className="font-medium">Add Counsellors</p>
              </NavLink>
            </li>

            <li>
              <NavLink 
                className={linkClassName} 
                to={'/all-appointments'}
                onClick={handleLinkClick}
              >
                <img src={assets.appointment_icon} alt='' className="w-5 h-5" />
                <p className="font-medium">Appointments</p>
              </NavLink>
            </li>

            <li>
              <NavLink 
                className={linkClassName} 
                to={'/all-counsellors'}
                onClick={handleLinkClick}
              >
                <img src={assets.people_icon} alt='' className="w-5 h-5" />
                <p className="font-medium">Counsellors List</p>
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                className={linkClassName} 
                to={'/approve-counsellors'}
                onClick={handleLinkClick}
              >
                <img src={assets.people_icon} alt='' className="w-5 h-5" />
                <p className="font-medium">Pending Counsellors</p>
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                className={linkClassName} 
                to={'/donations'}
                onClick={handleLinkClick}
              >
                <DonationIcon className="w-5 h-5" />
                <p className="font-medium">View Donations</p>
              </NavLink>
            </li> 

            <li>
              <NavLink 
                className={linkClassName} 
                to={'/programs'}
                onClick={handleLinkClick}
              >
                <ProgramIcon className="w-5 h-5" />
                <p className="font-medium">Create A Program</p>
              </NavLink>
            </li>

            <li>
              <NavLink 
                className={linkClassName} 
                to={'/create-community'}
                onClick={handleLinkClick}
              >
                <CommunityIcon className="w-5 h-5" />
                <p className="font-medium">Create A Community</p>
              </NavLink>
            </li>

             <li>
              <NavLink 
                className={linkClassName} 
                to={'/admin-chats'}
                onClick={handleLinkClick}
              >
                <CommunityIcon className="w-5 h-5" />
                <p className="font-medium">Programs and Chats</p>
              </NavLink>
            </li>

          </ul>
        )}

        {cToken && (
          <ul className='text-[#515151] mt-5 space-y-1'>
            <li>
              <NavLink 
                className={linkClassName} 
                to={'/'}
                onClick={handleLinkClick}
              >
                <img src={assets.home_icon} alt='' className="w-5 h-5" />
                <p className="font-medium">Home</p>
              </NavLink>
            </li>

            <li>
              <NavLink 
                className={linkClassName} 
                to={'/counsellor-dashboard'}
                onClick={handleLinkClick}
              >
                <img src={assets.home_icon} alt='' className="w-5 h-5" />
                <p className="font-medium">Dashboard</p>
              </NavLink>
            </li>

            <li>
              <NavLink 
                className={linkClassName} 
                to={'/counsellor-appointments'}
                onClick={handleLinkClick}
              >
                <img src={assets.appointment_icon} alt='' className="w-5 h-5" />
                <p className="font-medium">Appointments</p>
              </NavLink>
            </li>

            <li>
              <NavLink 
                className={linkClassName} 
                to={'/community'}
                onClick={handleLinkClick}
              >
                <ActivityIcon className="w-5 h-5" />
                <p className="font-medium">Create An Activity</p>
              </NavLink>
            </li>

            <li>
              <NavLink 
                className={linkClassName} 
                to={'/counsellor-profile'}
                onClick={handleLinkClick}
              >
                <ProfileIcon className="w-5 h-5" />
                <p className="font-medium">Profile</p>
              </NavLink>
            </li>
              
            <li>
              <NavLink 
                className={linkClassName} 
                to={'/clients'}
                onClick={handleLinkClick}
              >
                <ClientsIcon className="w-5 h-5" />
                <p className="font-medium">All Clients</p>
              </NavLink>
            </li>

            <li>
              <NavLink 
                className={linkClassName} 
                to={'/counsellor-chat'}
                onClick={handleLinkClick}
              >
                <ModerateIcon className="w-5 h-5" />
                <p className="font-medium">Moderate A Program</p>
              </NavLink>
            </li>
            
          </ul>
        )}
      </div>

      {/* Mobile Footer */}
      {isMobile && (
        <div className="p-4 border-t bg-blue-50">
          <p className="text-xs text-gray-500 text-center">
            {aToken ? 'Admin Panel' : 'Counsellor Panel'}
          </p>
        </div>
      )}
    </div>
  )
}

export default SideBar