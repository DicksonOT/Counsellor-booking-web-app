import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import {AdminContext} from '../../context/AdminContext'
import {toast} from 'react-toastify'
import axios from 'axios'

const AddCunsellor = () => {

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
    <form onSubmit={onSubmitHandler} className="m-5 w-full">

      <p className="mb-3 text-lg font-medium">Add Counsellor</p>

      <div className="bborder-gray-600 g-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-scroll">

        <div className="flex items-center gap-4 mb-8 text-gray-500">

          <label htmlFor="coun-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={ counImg ? URL.createObjectURL(counImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
              onChange={(e)=> setCounImg(e.target.files[0])} className="bg-blue-500" type="file" id="coun-img" hidden />
          <p>
            Upload Counsellor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-shadow-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex-col gap-1">
              <p>Counsellor name</p>
              <input onChange={(e)=> setName(e.target.value)} value={name} className="border border-gray-600 rounded px-10 py-1" type="text" placeholder="name" required />
            </div>

            <div className="flex-1 flex-col gap-1">
              <p>Counsellor Email</p>
              <input onChange={(e)=> setEmail(e.target.value)} value={email} className="border border-gray-600 rounded px-10 py-1" type="email" placeholder="Email" required />
            </div>

            <div className="flex-1 flex-col gap-1">
              <p>Counsellor Password</p>
              <input onChange={(e)=> setPassword(e.target.value)} value={password}  className="border border-gray-600 rounded px-10 py-1" type="password" placeholder="Password" required />
            </div>

            <div className="flex-1 flex-col gap-1">
              <p>Experience</p>
              <input onChange={(e)=> setExperience(e.target.value)} value={experience} className="border border-gray-600 rounded px-10 py-1" type="text" placeholder="e.g 2 Years" required />
            </div>

            <div className="flex-1 flex-col gap-1">
              <p>Fees</p>
              <input onChange={(e)=> setFees(e.target.value)} value={fees} className="border border-gray-600 rounded px-10 py-1" type="number" placeholder="Fees" required />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">

            <div className="flex-1 flex-col gap-1">
              <p>Specialty</p>
              <select onChange={(e)=> setSpecialty(e.target.value)} value={specialty} className="border border-gray-600 rounded px-10 py-1" name="" id="">
                <option value="Marriage and Family Counsellor">
                  Marriage and Family Counsellor
                </option>
                <option value="School Counsellor">School Counsellor</option>
                <option value="Rehabilitation Counsellor">
                  Rehabilitation Counsellor
                </option>
                <option value="Substance Abuse Counsellor">
                  Substance Abuse Counsellor
                </option>
                <option value="Mental Health Counsellor">
                  Mental Health Counsellor
                </option>
                <option value="Career Counsellor">Career Counsellor</option>
              </select>
            </div>

            <div className="flex-1 flex-col gap-1">
              <p>Education</p>
              <input onChange={(e)=> setDegree(e.target.value)} value={degree} className="border border-gray-600 rounded px-10 py-1" type="text" placeholder="e.g. Degree" required />
            </div>

            <div className="flex-1 flex-col gap-1">
              <p>Location</p>
              <input onChange={(e)=> setLocation(e.target.value)} value={location} className="border border-gray-600 rounded px-10 py-1" type="text" placeholder="State, Country" required />
            </div>
          </div>
        </div>


        <div className="flex-1 flex-col gap-1">
            <p className="mt-4 mb-2">About</p>
            <textarea onChange={(e)=> setAbout(e.target.value)} value={about} className="w-full px-4 pt-2 border rounded" placeholder='Write about yourself' rows={5} required/>
        </div>

        <button type="submit" className="bg-blue-500 px-10 py-3 mt-4 text-white rounded-full cursor-pointer">Submit</button>
      </div>
    </form>
  );
};


export default AddCunsellor;
