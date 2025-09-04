import React, { useState, useEffect, useContext } from 'react';
import { Heart, DollarSign, Users, TrendingUp, Calendar, Mail, User, Filter, Download, RefreshCw } from 'lucide-react';
import { AdminContext } from '../../context/AdminContext';

const AdminDonations = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  
  const [donations, setDonations] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalAmount: 0,
    totalDonations: 0,
    monthlyDonors: 0,
    recentDonations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, one-time, monthly, completed, pending
  const [dateRange, setDateRange] = useState('all'); // all, today, week, month
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch donation analytics
  const fetchDonationAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/admin/donation-analytics`, {
        headers: {
          'aToken': aToken
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error fetching donation analytics:', err);
      setError('Failed to fetch donation analytics');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all donations with filters
  const fetchDonations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        filter,
        dateRange,
        search: searchTerm
      });
      
      const response = await fetch(`${backendUrl}/api/admin/donations?${params}`, {
        headers: {
          'aToken': aToken
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDonations(data.donations);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Failed to fetch donations');
    } finally {
      setLoading(false);
    }
  };

  // Export donations to CSV
  const exportDonations = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/export-donations`, {
        headers: {
          'aToken': aToken
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error exporting donations:', err);
      setError('Failed to export donations');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status, donationType) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    if (status === 'completed') {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800 border border-green-200`}>
          ✓ Completed
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`}>
          ⏳ Pending
        </span>
      );
    } else if (status === 'failed') {
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800 border border-red-200`}>
          ✗ Failed
        </span>
      );
    }
    
    return (
      <span className={`${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`}>
        {status}
      </span>
    );
  };

  const getDonationTypeBadge = (type) => {
    if (type === 'monthly') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          🔄 Monthly
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
        💰 One-time
      </span>
    );
  };

  useEffect(() => {
    fetchDonationAnalytics();
    fetchDonations();
  }, [aToken]);

  useEffect(() => {
    fetchDonations();
  }, [filter, dateRange, searchTerm]);

  if (loading && donations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">Donation Management</h1>
              <p className="text-gray-600 mt-1">Monitor and manage platform donations</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  fetchDonationAnalytics();
                  fetchDonations();
                }}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={exportDonations}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalDonations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalAmount)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Monthly Donors</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.monthlyDonors}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Avg. Donation</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalDonations > 0 ? formatCurrency(analytics.totalAmount / analytics.totalDonations) : '$0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="one-time">One-time Only</option>
              <option value="monthly">Monthly Only</option>
            </select>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            <input
              type="text"
              placeholder="Search by donor name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-blue-600">
              Recent Donations ({donations.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No donations found</p>
                        <p className="text-sm">Donations will appear here when received</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  donations.map((donation, index) => (
                    <tr key={donation._id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {donation.donorName || 'Anonymous'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {donation.donorEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(donation.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getDonationTypeBadge(donation.donationType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(donation.status, donation.donationType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(donation.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default AdminDonations;