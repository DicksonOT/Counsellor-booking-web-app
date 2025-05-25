import React, { useEffect,useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'

const CounsellorsList = () => {
    const {counsellors, getAllCounsellors, aToken, changeAvailability} = useContext(AdminContext)
  
    useEffect(()=>{
      if(aToken){
        getAllCounsellors()
      }
    }, [aToken])
  
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Counsellors</h1>

      <div className="w-full grid grid-cols-5 gap-4 gap-y-6">
          {counsellors.map((item, index) => (
            <div
              key={index}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:bg-blue-200 hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-blue-50" src={item.image} alt="" />
              <div className="p-4">
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.specialty}</p>
                <div className='mt-2 flex items-center gap-1 text-sm'>
                  <input onChange={()=> changeAvailability(item._id)} type='checkbox' checked={item.available} />
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>

      </div>
    </div>
  )
}

export default CounsellorsList