import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { CounsellorContext } from '../context/CounsellorContext'

const Login = () => {

  const [state, setState]=useState('Admin')
  const [email, setEmail]=useState('')
  const [password, setPassword]=useState('')

  const {setAToken, backendUrl} = useContext(AdminContext)
  const {setCToken} = useContext(CounsellorContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {
      if (state == 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {email, password});

        console.log(data)
        if (data.success) {  
          localStorage.setItem('atoken', data.token);
          setAToken(data.token);

        } else {
          toast.error(data.message)
        }

      //Counsellor API
      } else {
          const {data} = await axios.post(`${backendUrl}/api/counsellor/login`, {email, password})

          if(data.success){
            localStorage.setItem('cToken', data.token)
            setCToken(data.token) 
            toast.success('Login Successful')
        } else{
          toast.error(data.message)
        }
      }

    } catch (error) {
      console.error('Login error:', error);
      
      toast.error(error.message)
    }
  };
  
  return (

  <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
    <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[250px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
      <p className='text-2xl font-semibold m-auto'><span className='text-blue-500'>{state}</span> Login</p>

      <div className='w-full'>
        <p>Email</p>
        <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required/>
      </div>
      <div className='w-full'>
        <p>Password</p>
        <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required/>
      </div>
      <button className='bg-blue-500 text-white w-full py-2 rounded-md text-base cursor-pointer'>Login</button>

      {
        state === 'Admin'
        ? <p>Counsellor Login? <span onClick={()=>setState('Counsellor')} className='text-blue-500 underline cursor-pointer'>Click here</span></p>
        : <p>Admin Login? <span onClick={()=>setState('Admin')} className='text-blue-500 underline cursor-pointer'>Click here</span></p>
      }
    </div>
  </form>
  )
}

export default Login;