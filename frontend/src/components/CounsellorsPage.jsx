import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const CounsellorsPage = () => {
  const { specialty } = useParams();
  const { counsellors } = useContext(AppContext);
  const [filterCoun, SetFilterCoun] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (specialty) {
      SetFilterCoun(
        counsellors.filter(
          (coun) =>
            coun.status === "approved" && coun.specialty === specialty
        )
      );
    } else {
      SetFilterCoun(
        counsellors.filter((coun) => coun.status === "approved")
      );
    }
  };

  useEffect(() => {
    applyFilter();
  }, [counsellors, specialty]);

  const specialties = [
    "Marriage and Family Counsellor",
    "School Counsellor", 
    "Rehabilitation Counsellor",
    "Substance Abuse Counsellor",
    "Mental Health Counsellor",
    "Career Counsellor"
  ];

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
              </p>
            </div>

            {filterCoun.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {filterCoun.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/appointment/${item._id}`)}
                    className="w-65 border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group hover:bg-blue-200"
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        className=" h-90 object-cover bg-blue-50 group-hover:scale-105transition-transform duration-300" 
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
                      <p className="text-gray-600 text-sm mb-3">{item.specialty}</p>
                      
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
                    {specialty 
                      ? `No approved counsellors available for ${specialty} at the moment.`
                      : "No approved counsellors available at the moment."
                    }
                  </p>
                  {specialty && (
                    <button
                      onClick={() => navigate("/counsellors")}
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