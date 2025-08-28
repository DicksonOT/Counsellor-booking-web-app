import React, { useEffect, useContext, useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { AdminContext } from '../../context/AdminContext'

const CounsellorsList = () => {
    const {counsellors, getAllCounsellors, aToken, changeAvailability} = useContext(AdminContext)
    const [searchTerm, setSearchTerm] = useState('')
  
    useEffect(()=>{
      if(aToken){
        getAllCounsellors()
      }
    }, [aToken])

    // Filter counsellors based on search term
    const filteredCounsellors = useMemo(() => {
      if (!searchTerm.trim()) {
        return counsellors
      }
      
      return counsellors.filter(counsellor => 
        counsellor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        counsellor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }, [counsellors, searchTerm])

    const clearSearch = () => {
      setSearchTerm('')
    }
  
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <div className="flex justify-between items-center mb-5">
        <h1 className='text-lg text-blue-500 font-semibold'>All Counsellors</h1>
        <p className="text-gray-600 text-sm">
          {filteredCounsellors.length} of {counsellors.length} counsellors
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search counsellors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Info */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600">
          {filteredCounsellors.length === 0 ? (
            <p>No counsellors found for "{searchTerm}"</p>
          ) : (
            <p>Found {filteredCounsellors.length} counsellor{filteredCounsellors.length === 1 ? '' : 's'} for "{searchTerm}"</p>
          )}
        </div>
      )}

      {/* Counsellors Grid */}
      {filteredCounsellors.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No counsellors found' : 'No counsellors available'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? `Try searching with different keywords or check the spelling.`
              : 'Counsellors will appear here once they are added to the system.'
            }
          </p>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6">
          {filteredCounsellors.map((item, index) => (
            <div
              key={item._id || index}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:bg-blue-200 hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-blue-50" src={item.image} alt="" />
              <div className="p-4">
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.specialty}</p>
                <div className='mt-2 flex items-center gap-1 text-sm'>
                  <input 
                    onChange={() => changeAvailability(item._id)} 
                    type='checkbox' 
                    checked={item.available} 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <p className={item.available ? 'text-green-600' : 'text-red-600'}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CounsellorsList