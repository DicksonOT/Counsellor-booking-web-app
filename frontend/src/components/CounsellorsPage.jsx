import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const CounsellorsPage = () => {
  const { specialty } = useParams();
  const { counsellors } = useContext(AppContext);
  const [filterCoun, SetFilterCoun] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const applyFilter = () => {
    let filtered = counsellors.filter((coun) => coun.status === "approved");
    
    // Apply specialty filter
    if (specialty) {
      filtered = filtered.filter((coun) => coun.specialty === specialty);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((coun) => 
        coun.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coun.location && coun.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    SetFilterCoun(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [counsellors, specialty, searchTerm]);

  const specialties = [
    "Marriage and Family Counsellor",
    "School Counsellor", 
    "Rehabilitation Counsellor",
    "Substance Abuse Counsellor",
    "Mental Health Counsellor",
    "Career Counsellor"
  ];

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-450 mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">Find Your Counsellor</h1>
          <p className="text-gray-600">
            Browse through our counsellor specialists and find the right match for your needs
          </p>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <span className="flex items-center text-blue-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              24/7 Live Support
            </span>
            <span className="flex items-center text-blue-500">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secured Platform
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              className={`w-full py-3 px-4 border rounded-lg text-sm font-medium transition-all ${
                showFilter 
                  ? "bg-blue-500 text-white border-blue-500" 
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
              }`}
              onClick={() => setShowFilter((prev) => !prev)}
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                {showFilter ? 'Hide Filters' : 'Show Filters'}
              </div>
            </button>
          </div>

          {/* Sidebar Filters */}
          <div className={`lg:w-80 ${showFilter ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                Filter by Specialty
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/counsellors")}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                    !specialty 
                      ? "bg-blue-50 border-blue-200 text-blue-700 font-medium" 
                      : "border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  All Specialties
                </button>
                
                {specialties.map((spec, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      specialty === spec
                        ? navigate("/counsellors")
                        : navigate(`/counsellors/${spec}`)
                    }
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                      specialty === spec
                        ? "bg-blue-50 border-blue-200 text-blue-700 font-medium"
                        : "border-gray-200 text-gray-700 hover:border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>

              {specialty && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Current Filter:</p>
                      <p className="text-sm text-blue-700">{specialty}</p>
                    </div>
                    <button
                      onClick={() => navigate("/counsellors")}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Counsellors Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {filterCoun.length > 0 
                  ? `Showing ${filterCoun.length} available counsellor${filterCoun.length === 1 ? '' : 's'}` 
                  : 'No counsellors found'
                }
                {specialty && (
                  <span className="ml-2 text-blue-600 font-medium">
                    in {specialty}
                  </span>
                )}
                {searchTerm && (
                  <span className="ml-2 text-gray-500">
                    for "{searchTerm}"
                  </span>
                )}
              </p>
            </div>

            {filterCoun.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filterCoun.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/appointment/${item._id}`)}
                    className=" border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group hover:bg-blue-200"
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        className=" h-95 w-full object-cover bg-blue-50 group-hover:scale-105transition-transform duration-300" 
                        src={item.image} 
                        alt={item.name}
                      />
                      <div className="absolute top-3 right-3">
                      </div>
                    </div>
                    <div className="p-4 hover:bg-blue-200">
                      <h3 className="text-gray-900 text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{item.specialty}</p>
                      <p className="text-gray-500 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.location}
                      </p>
                    </div>
                  </div>

                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No counsellors found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm && specialty 
                      ? `No approved counsellors found for "${searchTerm}" in ${specialty}.`
                      : searchTerm 
                        ? `No approved counsellors found for "${searchTerm}".`
                        : specialty 
                          ? `No approved counsellors available for ${specialty} at the moment.`
                          : "No approved counsellors available at the moment."
                    }
                  </p>
                  {(specialty || searchTerm) && (
                    <button
                      onClick={() => {
                        navigate("/counsellors");
                        setSearchTerm("");
                      }}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View All Counsellors
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorsPage;