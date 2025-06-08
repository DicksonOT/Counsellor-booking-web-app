import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import {AdminContext} from '../../context/AdminContext'
import {toast} from 'react-toastify'
import axios from 'axios'

const AddCounsellor = () => {

  const [counImg,setCounImg]=useState(false)
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [experience,setExperience]=useState('')
  const [fees,setFees]=useState('')
  const [about,setAbout]=useState('')
  const [specialty,setSpecialty]=useState('Marriage and Family Counsellor')
  const [degree, setDegree]=useState('')
  const [location,setLocation]=useState('')

  const {backendUrl, aToken} = useContext(AdminContext)

  const onSubmitHandler = async (event) =>{
    event.preventDefault()

    try {
        if(!counImg){
          return toast.error('Image not selected')
        }

        const formData = new FormData()

        formData.append('image', counImg)
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('experience', experience)
        formData.append('fees', Number(fees))
        formData.append('about', about)
        formData.append('specialty', specialty)
        formData.append('degree', degree)
        formData.append('location', location)

       const {data} = await axios.post(`${backendUrl}/api/admin/add-counsellor`, formData, {headers: {aToken}})

       if(data.success){
        toast.success(data.message)

        setCounImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setLocation('')
        setDegree('')
        setAbout('')
        setFees('')
        setExperience('')
       }
       else{
        toast.error(data.message)
       }
    } catch (error) {
      console.log(error)
       toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full h-full">
        <form onSubmit={onSubmitHandler} className="w-full h-full p-6">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Counsellor</h1>
            <p className="text-gray-600">Fill in the details below to add a new counsellor to the system</p>
          </div>

          <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden w-full">
            <div className="px-6 py-6 w-full">

              {/* Image Upload Section */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Picture</h2>
                <div className="flex items-center gap-6">
                  <label htmlFor="coun-img" className="cursor-pointer">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 hover:border-blue-400 transition-colors duration-200">
                      <img
                        className="w-full h-full object-cover bg-gray-100"
                        src={counImg ? URL.createObjectURL(counImg) : assets.upload_area}
                        alt="Counsellor profile"
                      />
                    </div>
                  </label>
                  <input
                    onChange={(e)=> setCounImg(e.target.files[0])} 
                    type="file" 
                    id="coun-img" 
                    hidden 
                    accept="image/*"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Upload counsellor picture</p>
                    <p className="text-xs text-gray-500 mt-1">Recommended: Square image, at least 200x200px</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Counsellor Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      onChange={(e)=> setName(e.target.value)} 
                      value={name} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                      type="text" 
                      placeholder="Enter full name" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                      onChange={(e)=> setEmail(e.target.value)} 
                      value={email} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                      type="email" 
                      placeholder="Enter email address" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input 
                      onChange={(e)=> setPassword(e.target.value)} 
                      value={password}  
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                      type="password" 
                      placeholder="Create a secure password" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience <span className="text-red-500">*</span>
                    </label>
                    <input 
                      onChange={(e)=> setExperience(e.target.value)} 
                      value={experience} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                      type="text" 
                      placeholder="e.g. 2 Years" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Fees <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input 
                        onChange={(e)=> setFees(e.target.value)} 
                        value={fees} 
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                        type="number" 
                        placeholder="0.00" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialty <span className="text-red-500">*</span>
                    </label>
                    <select 
                      onChange={(e)=> setSpecialty(e.target.value)} 
                      value={specialty} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
                    >
                      <option value="Marriage and Family Counsellor">Marriage and Family Counsellor</option>
                      <option value="School Counsellor">School Counsellor</option>
                      <option value="Rehabilitation Counsellor">Rehabilitation Counsellor</option>
                      <option value="Substance Abuse Counsellor">Substance Abuse Counsellor</option>
                      <option value="Mental Health Counsellor">Mental Health Counsellor</option>
                      <option value="Career Counsellor">Career Counsellor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education <span className="text-red-500">*</span>
                    </label>
                    <input 
                      onChange={(e)=> setDegree(e.target.value)} 
                      value={degree} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                      type="text" 
                      placeholder="e.g. Master's in Psychology" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input 
                      onChange={(e)=> setLocation(e.target.value)} 
                      value={location} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200" 
                      type="text" 
                      placeholder="City, State, Country" 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About <span className="text-red-500">*</span>
                </label>
                <textarea 
                  onChange={(e)=> setAbout(e.target.value)} 
                  value={about} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none" 
                  placeholder="Write a brief description about the counsellor's background, approach, and areas of expertise..." 
                  rows={5} 
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 50 characters recommended</p>
              </div>

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add Counsellor
                  </button>
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCounsellor;

