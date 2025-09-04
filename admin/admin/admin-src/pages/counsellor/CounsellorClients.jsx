import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { CounsellorContext } from '../../context/CounsellorContext';
import { assets } from '../../assets/assets';

const CounsellorClients = () => {
  const navigate = useNavigate();
  const { cToken, getCounsellorClients } = useContext(CounsellorContext);
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch clients data
  const fetchClients = async (search = '') => {
    if (!cToken) return;

    try {
      const isSearching = search.trim() !== '';
      if (isSearching) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      const data = await getCounsellorClients(search);
      
      if (data.success) {
        setClients(data.clients || []);
      } else {
        toast.error(data.message || 'Failed to fetch clients');
        setClients([]);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
      setClients([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchClients();
  }, [cToken]);

  // Handle search with debouncing
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== '') {
        fetchClients(searchTerm);
      } else {
        fetchClients();
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Handle client card click
  const handleClientClick = (client) => {
    if (!client || !client._id) {
      console.error('Client data is missing or invalid:', client);
      toast.error('Unable to navigate to client profile');
      return;
    }
    
    // Updated navigation path to match the existing route in App.jsx
    navigate(`/counsellor/client-profile/${client._id}`, {
      state: {
        userData: client,
        clientData: client,
        appointmentData: client.currentAppointment, // Now includes appointment data from backend
        fromClients: true // Flag to indicate source
      }
    });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-600">My Clients</h1>
            <p className="text-gray-600 mt-2">Manage and view your client information</p>
          </div>
          
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading clients...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">My Clients</h1>
              <p className="text-gray-600 mt-2">
                {clients.length > 0 
                  ? `${clients.length} client${clients.length !== 1 ? 's' : ''} total`
                  : 'No clients found'
                }
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search clients by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchLoading && (
              <div className="absolute right-12 top-3.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* Clients Grid */}
        {clients.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No clients found' : 'No clients yet'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No clients match your search "${searchTerm}". Try a different search term.`
                : 'You have not had any appointments yet. Clients will appear here once they book appointments with you.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clients.map((client, index) => (
              <div
                key={client._id || index}
                onClick={() => handleClientClick(client)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
              >
                <div className="p-6 text-center">
                  {/* Client Image */}
                  <div className="relative mb-4">
                    <img
                      src={client.image || assets.profile_placeholder}
                      alt={client.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-blue-100 shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = assets.profile_placeholder;
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full transform translate-x-1/4"></div>
                  </div>

                  {/* Client Info */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate" title={client.name}>
                      {client.name}
                    </h3>
                    <p className="text-gray-600 text-sm truncate" title={client.email}>
                      {client.email}
                    </p>
                  </div>

                  {/* Action Indicator */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center text-blue-600 font-medium text-sm">
                      <span>View Profile</span>
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Results Info */}
        {searchTerm && clients.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing {clients.length} result{clients.length !== 1 ? 's' : ''} for "{searchTerm}"
            </p>
            <button
              onClick={clearSearch}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Show all clients
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounsellorClients;