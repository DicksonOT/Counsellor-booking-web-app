import React, { useState, useEffect, useContext } from 'react';
import { Heart, Calendar, DollarSign, Download, Filter, Search, X, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const DonationHistoryPage = () => {
  const { 
    getUserDonationHistory, 
    cancelMonthlyDonation, 
    token,
    userData 
  } = useContext(AppContext);

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [totalStats, setTotalStats] = useState({
    total: 0,
    oneTime: 0,
    monthly: 0,
    totalSessions: 0
  });

  useEffect(() => {
    if (token) {
      fetchDonationHistory();
    }
  }, [token]);

  useEffect(() => {
    applyFilters();
  }, [donations, searchTerm, statusFilter, typeFilter, dateRange]);

  const fetchDonationHistory = async () => {
    try {
      setLoading(true);
      const response = await getUserDonationHistory();
      
      if (response.success) {
        setDonations(response.donations || []);
        calculateStats(response.donations || []);
      } else {
        toast.error('Failed to fetch donation history');
      }
    } catch (error) {
      console.error('Error fetching donation history:', error);
      toast.error('Error loading donation history');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (donationList) => {
    const stats = donationList.reduce((acc, donation) => {
      if (donation.status === 'completed') {
        acc.total += donation.amount;
        if (donation.type === 'monthly') {
          acc.monthly += donation.amount;
        } else {
          acc.oneTime += donation.amount;
        }
      }
      return acc;
    }, { total: 0, oneTime: 0, monthly: 0 });

    stats.totalSessions = Math.floor(stats.total / 50);
    setTotalStats(stats);
  };

  const applyFilters = () => {
    let filtered = [...donations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(donation => 
        donation.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.amount.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(donation => donation.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(donation => donation.type === typeFilter);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;

      switch (dateRange) {
        case '7days':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1year':
          cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = null;
      }

      if (cutoffDate) {
        filtered = filtered.filter(donation => 
          new Date(donation.createdAt) >= cutoffDate
        );
      }
    }

    setFilteredDonations(filtered);
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this monthly donation? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await cancelMonthlyDonation(subscriptionId);
      if (response.success) {
        toast.success('Monthly donation cancelled successfully');
        fetchDonationHistory(); // Refresh the list
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  const downloadReport = () => {
    const csvContent = [
      ['Date', 'Amount', 'Type', 'Status', 'ID'].join(','),
      ...filteredDonations.map(donation => [
        formatDate(donation.createdAt),
        donation.amount,
        donation.type,
        donation.status,
        donation.id || donation._id
      ].join(','))
    ].join('\n');

    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `donation-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your donation history.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donation History</h1>
          <p className="text-gray-600">Track your contributions and impact on mental health support</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <h3 className="font-semibold text-gray-900">Total Donated</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalStats.total)}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h3 className="font-semibold text-gray-900">One-time</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalStats.oneTime)}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Monthly</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalStats.monthly)}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-orange-600 fill-current" />
              <h3 className="font-semibold text-gray-900">Sessions Funded</h3>
            </div>
            <p className="text-2xl font-bold text-orange-600">{totalStats.totalSessions}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              
              <button
                onClick={downloadReport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="one-time">One-time</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                    <option value="90days">Last 90 days</option>
                    <option value="1year">Last year</option>
                  </select>
                </div>
              </div>
              
              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setDateRange('all');
                }}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Donations List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading donation history...</p>
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="p-8 text-center">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No donations found</h3>
              <p className="text-gray-600 mb-4">
                {donations.length === 0 
                  ? "You haven't made any donations yet." 
                  : "No donations match your current filters."
                }
              </p>
              {donations.length === 0 && (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                  Make Your First Donation
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredDonations.map((donation, index) => (
                <div key={index} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(donation.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {formatCurrency(donation.amount)}
                            {donation.type === 'monthly' && <span className="text-sm text-gray-600">/month</span>}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {donation.type === 'monthly' ? 'Monthly Donation' : 'One-time Donation'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>ID: {donation.id || donation._id}</span>
                        <span>{formatDate(donation.createdAt)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(donation.status)}`}>
                          {donation.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {donation.type === 'monthly' && donation.status === 'active' && (
                        <button
                          onClick={() => handleCancelSubscription(donation.subscriptionId)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Impact</p>
                        <p className="font-semibold text-blue-600">
                          {Math.floor(donation.amount / 50)} sessions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredDonations.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            Showing {filteredDonations.length} of {donations.length} donations
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistoryPage;