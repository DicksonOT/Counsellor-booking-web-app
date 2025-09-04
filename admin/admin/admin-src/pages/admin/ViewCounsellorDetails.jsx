import React, { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const CounsellorDetails = () => {
  const { aToken, backendUrl } = useContext(AdminContext)
  const [counsellors, setCounsellors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCounsellor, setSelectedCounsellor] = useState(null)
  const [detailedData, setDetailedData] = useState(null)
  const [currentMonth, setCurrentMonth] = useState('')
  const [debugMode, setDebugMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter counsellors based on search query
  const filteredCounsellors = counsellors.filter(counsellor => 
    counsellor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    counsellor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (counsellor.specialty && counsellor.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  // Format date helper
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Enhanced debug logging
  const logDebug = (message, data = null) => {
    if (debugMode) {
      console.log(`[DEBUG] ${message}`, data)
    }
  }

  // Token validation helper
  const validateToken = () => {
    if (!aToken) {
      toast.error('No authentication token found. Please login again.')
      return false
    }
    
    // Basic JWT token validation
    try {
      const tokenParts = aToken.split('.')
      if (tokenParts.length !== 3) {
        toast.error('Invalid token format. Please login again.')
        return false
      }
      
      // Try to decode the payload - handle both JSON and string payloads
      let payload
      try {
        const decodedPayload = atob(tokenParts[1])
        logDebug('Raw decoded payload:', decodedPayload)
        
        // Try to parse as JSON first
        try {
          payload = JSON.parse(decodedPayload)
        } catch (jsonError) {
          // If JSON parsing fails, treat as string payload (your backend uses string tokens)
          logDebug('Token contains string payload, not JSON object:', decodedPayload)
          payload = { data: decodedPayload }
        }
      } catch (decodeError) {
        console.error('Token decoding error:', decodeError)
        toast.error('Invalid token format. Please login again.')
        return false
      }
      
      // Check if token is expired (only if payload has exp field)
      const currentTime = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < currentTime) {
        toast.error('Token has expired. Please login again.')
        return false
      }
      
      logDebug('Token validation passed', { 
        tokenExists: !!aToken, 
        payloadType: typeof payload.data !== 'undefined' ? 'string' : 'object',
        expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'No expiry',
        currentTime: new Date(currentTime * 1000).toISOString(),
        payload: payload
      })
      return true
    } catch (error) {
      console.error('Token validation error:', error)
      toast.error('Invalid token. Please login again.')
      return false
    }
  }

  // Fetch all counsellors with revenue
  const fetchCounsellorsRevenue = async () => {
    try {
      setLoading(true)
      
      // Validate prerequisites
      if (!backendUrl) {
        toast.error('Backend URL not configured')
        setLoading(false)
        return
      }
      
      if (!validateToken()) {
        setLoading(false)
        return
      }
      
      const endpoint = `${backendUrl}/api/admin/revenue-overview`
      logDebug('Making request to:', endpoint)
      logDebug('Using token:', aToken ? `${aToken.substring(0, 20)}...` : 'None')
      
      const response = await axios.get(endpoint, {
        headers: {
          'atoken': aToken,  // Changed from 'Authorization': `Bearer ${aToken}`
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      })
      
      logDebug('Response received:', {
        status: response.status,
        success: response.data?.success,
        dataKeys: Object.keys(response.data || {})
      })
      
      if (response.data.success) {
        setCounsellors(response.data.counsellors)
        setCurrentMonth(response.data.month)
        toast.success(`Loaded ${response.data.counsellors.length} counsellors successfully`)
      } else {
        toast.error(response.data.message || 'Failed to fetch data')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      handleApiError(error, 'counsellor revenue data')
    } finally {
      setLoading(false)
    }
  }

  // Enhanced error handling
  const handleApiError = (error, context = 'data') => {
    if (error.response) {
      const statusCode = error.response.status
      const errorMessage = error.response.data?.message || error.response.statusText
      
      logDebug('API Error Response:', {
        status: statusCode,
        message: errorMessage,
        headers: error.response.headers,
        data: error.response.data
      })
      
      switch (statusCode) {
        case 401:
          toast.error('Authentication failed. Please login again.')
          // You might want to redirect to login here
          // window.location.href = '/login'
          break
        case 403:
          toast.error('Access denied. You do not have permission to view this data.')
          break
        case 404:
          toast.error('API endpoint not found. Please check your backend routes.')
          break
        case 500:
          toast.error('Server error. Please try again later or contact support.')
          break
        case 429:
          toast.error('Too many requests. Please wait a moment and try again.')
          break
        default:
          toast.error(`Server error: ${statusCode} - ${errorMessage}`)
      }
    } else if (error.request) {
      logDebug('Network error:', error.request)
      toast.error(`Cannot connect to server at ${backendUrl}. Please check if backend is running.`)
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your internet connection.')
    } else {
      console.error('Error:', error.message)
      toast.error(`Failed to fetch ${context}: ${error.message}`)
    }
  }

  // Fetch detailed data for specific counsellor
  const fetchCounsellorDetails = async (counsellorId) => {
    try {
      if (!validateToken()) return
      
      logDebug('Fetching details for counsellor:', counsellorId)
      
      const response = await axios.get(`${backendUrl}/api/admin/revenue/${counsellorId}`, {
        headers: {
          'atoken': aToken,  // Changed from 'Authorization': `Bearer ${aToken}`
          'Content-Type': 'application/json'
        },
        timeout: 10000
      })
      
      logDebug('Detail response:', response.data)
      
      if (response.data.success) {
        setDetailedData(response.data.data)
        setSelectedCounsellor(counsellorId)
        toast.success('Counsellor details loaded successfully')
      } else {
        toast.error(response.data.message || 'Failed to fetch counsellor details')
      }
    } catch (error) {
      console.error('Detail fetch error:', error)
      handleApiError(error, 'counsellor details')
    }
  }

  // Force token refresh function (you'll need to implement this in your AdminContext)
  const refreshAuthToken = () => {
    toast.info('Attempting to refresh authentication...')
    // This would depend on your authentication implementation
    // You might need to call a refresh endpoint or redirect to login
    window.location.reload()
  }

  useEffect(() => {
    if (aToken && backendUrl) {
      fetchCounsellorsRevenue()
    } else {
      logDebug('Missing required data:', { 
        hasToken: !!aToken, 
        hasBackendUrl: !!backendUrl,
        backendUrl 
      })
      toast.error('Authentication required or backend URL missing')
      setLoading(false)
    }
  }, [aToken, backendUrl])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 mb-2">Loading counsellor revenue data...</p>
        <button 
          onClick={() => setDebugMode(!debugMode)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Toggle Debug Mode
        </button>
      </div>
    )
  }

  if (counsellors.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No Counsellors Found</h2>
          <p className="text-gray-600 mb-4">No counsellor revenue data available. This could be because:</p>
          <ul className="text-gray-600 text-sm list-disc list-inside mb-6">
            <li>Authentication token has expired</li>
            <li>No counsellors have been approved yet</li>
            <li>No appointments have been made this month</li>
            <li>Backend server is not running</li>
            <li>API routes are not properly configured</li>
          </ul>
          <div className="space-x-4 mb-6">
            <button
              onClick={fetchCounsellorsRevenue}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry Loading Data
            </button>
            <button
              onClick={refreshAuthToken}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Refresh Authentication
            </button>
            <button
              onClick={() => setDebugMode(!debugMode)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              {debugMode ? 'Hide' : 'Show'} Debug Info
            </button>
          </div>
          
          {debugMode && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
              <p className="text-sm text-gray-700 font-semibold mb-2">Debug Information:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Backend URL: {backendUrl || 'Not set'}</p>
                <p>Admin Token: {aToken ? `${aToken.substring(0, 20)}...` : 'Missing'}</p>
                <p>API Endpoint: {backendUrl}/api/admin/revenue-overview</p>
                <p>Token Valid: {aToken ? 'Checking...' : 'No'}</p>
                <p>Browser: {navigator.userAgent}</p>
                <p>Timestamp: {new Date().toISOString()}</p>
              </div>
              
              {aToken && (
                <div className="mt-4 p-2 bg-white rounded border">
                  <p className="text-xs font-semibold text-gray-700">Token Analysis:</p>
                  <div className="text-xs text-gray-600">
                    {(() => {
                      try {
                        const parts = aToken.split('.')
                        if (parts.length === 3) {
                          const decodedPayload = atob(parts[1])
                          
                          // Try JSON parsing first
                          try {
                            const payload = JSON.parse(decodedPayload)
                            return (
                              <div className="space-y-1">
                                <p>Format: Valid JWT (JSON payload)</p>
                                <p>Issued: {payload.iat ? new Date(payload.iat * 1000).toLocaleString() : 'Unknown'}</p>
                                <p>Expires: {payload.exp ? new Date(payload.exp * 1000).toLocaleString() : 'No expiry'}</p>
                                <p>Subject: {payload.sub || 'Not specified'}</p>
                                <p>Role: {payload.role || 'Not specified'}</p>
                              </div>
                            )
                          } catch (jsonError) {
                            // Handle string payload (your backend's format)
                            return (
                              <div className="space-y-1">
                                <p>Format: Valid JWT (String payload)</p>
                                <p>Payload: {decodedPayload.substring(0, 20)}...</p>
                                <p>Type: Admin authentication token</p>
                                <p>Expires: Not specified in payload</p>
                                <p>Note: Backend uses string-based admin tokens</p>
                              </div>
                            )
                          }
                        }
                        return <p>Invalid JWT format</p>
                      } catch (e) {
                        return <p>Token parsing error: {e.message}</p>
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Counsellor Revenue Dashboard</h1>
          <p className="text-gray-600">Revenue overview for {currentMonth}</p>
          <p className="text-sm text-gray-500">
            Found {counsellors.length} counsellors with revenue data
            {searchQuery && ` (${filteredCounsellors.length} matching search)`}
          </p>
        </div>
        <button
          onClick={() => setDebugMode(!debugMode)}
          className="text-xs px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          {debugMode ? 'Hide' : 'Show'} Debug
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search counsellors by name, email, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {filteredCounsellors.slice(0, 4).map((counsellor, index) => (
          <div
            key={counsellor._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
            onClick={() => fetchCounsellorDetails(counsellor._id)}
          >
            <div className="flex items-center mb-4">
              <img
                src={counsellor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(counsellor.name)}&background=e3f2fd&color=1976d2`}
                alt={counsellor.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(counsellor.name)}&background=e3f2fd&color=1976d2`
                }}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {counsellor.name}
                </h3>
                <p className="text-sm text-gray-600">{counsellor.specialty || 'General'}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {formatCurrency(counsellor.currentMonthRevenue || 0)}
                </p>
                <p className="text-sm text-gray-500">Gross Revenue</p>
              </div>
              <div>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(counsellor.currentMonthPayable || 0)}
                </p>
                <p className="text-sm text-green-700">Amount Payable</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Appointments:</span>
                <span className="font-medium">{counsellor.currentMonthAppointments || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Fee:</span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(counsellor.platformFeeCurrentMonth || 0)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Counsellors Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            All Counsellors ({filteredCounsellors.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Counsellor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Payable
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCounsellors.map((counsellor, index) => (
                <tr key={counsellor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={counsellor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(counsellor.name)}&background=e3f2fd&color=1976d2&size=32`}
                        alt={counsellor.name}
                        className="w-8 h-8 rounded-full object-cover mr-3"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(counsellor.name)}&background=e3f2fd&color=1976d2&size=32`
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {counsellor.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {counsellor.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {counsellor.specialty || 'General'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">
                        {formatCurrency(counsellor.currentMonthRevenue || 0)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total: {formatCurrency(counsellor.totalRevenue || 0)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    <div>
                      <div className="text-green-600">
                        {formatCurrency(counsellor.currentMonthPayable || 0)}
                      </div>
                      <div className="text-xs text-green-500">
                        Total: {formatCurrency(counsellor.totalPayable || 0)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    <div>
                      <div className="text-red-600">
                        -{formatCurrency(counsellor.platformFeeCurrentMonth || 0)}
                      </div>
                      <div className="text-xs text-red-500">
                        Total: -{formatCurrency(counsellor.platformFeeTotal || 0)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>This Month: {counsellor.currentMonthAppointments || 0}</div>
                      <div className="text-xs text-gray-500">
                        Total: {counsellor.totalAppointments || 0}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      counsellor.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {counsellor.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => fetchCounsellorDetails(counsellor._id)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* No results message */}
        {filteredCounsellors.length === 0 && searchQuery && (
          <div className="p-6 text-center text-gray-500">
            <p>No counsellors found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Clear search to see all counsellors
            </button>
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      {selectedCounsellor && detailedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {detailedData.counsellor?.name || 'Counsellor'} - Revenue Details
                </h2>
                <button
                  onClick={() => {
                    setSelectedCounsellor(null)
                    setDetailedData(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Revenue Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Current Month - Gross</h3>
                  <p className="text-xl font-bold text-gray-600">
                    {formatCurrency(detailedData.revenue?.currentMonth || 0)}
                  </p>
                  <p className="text-sm text-gray-700">
                    {detailedData.appointments?.currentMonth || 0} appointments
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 mb-2">Current Month - Payable</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(detailedData.revenue?.currentMonthPayable || 0)}
                  </p>
                  <p className="text-sm text-green-700">
                    After 10% platform fee
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Last Month - Payable</h3>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(detailedData.revenue?.lastMonthPayable || 0)}
                  </p>
                  <p className="text-sm text-blue-700">
                    Gross: {formatCurrency(detailedData.revenue?.lastMonth || 0)}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800 mb-2">Growth (Payable)</h3>
                  <p className={`text-xl font-bold ${
                    (detailedData.revenue?.payableGrowthPercentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(detailedData.revenue?.payableGrowthPercentage || 0) >= 0 ? '+' : ''}
                    {detailedData.revenue?.payableGrowthPercentage || 0}%
                  </p>
                  <p className="text-sm text-purple-700">Month over month</p>
                </div>
              </div>

              {/* Platform Fee Summary */}
              {detailedData.platformFees && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Platform Fee Summary (10%)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-red-700">Current Month Fee</p>
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency(detailedData.platformFees.currentMonth || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-red-700">Last Month Fee</p>
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency(detailedData.platformFees.lastMonth || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-red-700">Total Fees Collected</p>
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency(detailedData.platformFees.total || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Appointments */}
              {detailedData.recentAppointments && detailedData.recentAppointments.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Appointments</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Patient
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {detailedData.recentAppointments.map((appointment) => (
                          <tr key={appointment._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(appointment.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.slotTime}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.userData?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              {formatCurrency(appointment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                appointment.cancelled
                                  ? 'bg-red-100 text-red-800'
                                  : appointment.isCompleted
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">No recent appointments found for this counsellor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CounsellorDetails