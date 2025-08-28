import React, { useState, useEffect, useContext } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock, Heart, CreditCard, Calendar, User, Mail, Phone } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const DonationManagementPage = () => {
  const { 
    getUserDonationHistory,
    cancelMonthlyDonation,
    token,
    userData 
  } = useContext(AppContext);

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDonations();
    }
  }, [token]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await getUserDonationHistory();
      
      if (response.success) {
        setDonations(response.donations || []);
      } else {
        toast.error('Failed to fetch donations');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Error loading donations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDonation = async () => {
    if (!selectedDonation || !cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await cancelMonthlyDonation(selectedDonation.subscriptionId || selectedDonation.id);
      
      if (response.success) {
        toast.success('Monthly donation cancelled successfully');
        setShowCancelModal(false);
        setSelectedDonation(null);
        setCancelReason('');
        fetchDonations(); // Refresh the list
      }
    } catch (error) {
      console.error('Error cancelling donation:', error);
    } finally {
      setIsProcessing(false);
    }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeDonations = donations.filter(d => d.status === 'active' && d.type === 'monthly');
  const completedDonations = donations.filter(d => d.status === 'completed');
  const cancelledDonations = donations.filter(d => d.status === 'cancelled');

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to manage your donations.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage My Donations</h1>
          <p className="text-gray-600">View and manage your donation subscriptions and history</p>
        </div>

        {/* User Info Card */}
        {userData && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {userData.email}
                  </span>
                  {userData.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {userData.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading donations...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Monthly Donations */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-600 fill-current" />
                Active Monthly Donations
              </h2>
              
              {activeDonations.length > 0 ? (
                <div className="space-y-4">
                  {activeDonations.map((donation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {formatCurrency(donation.amount)} / month
                            </h3>
                            <p className="text-sm text-gray-600">
                              Started: {formatDate(donation.createdAt)}
                            </p>
                            <p className="text-sm text-gray-600">
                              ID: {donation.id || donation._id}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(donation.status)}`}>
                              {getStatusIcon(donation.status)}
                              <span className="ml-1">Active</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Next: {formatDate(donation.nextChargeDate || new Date(Date.now() + 30*24*60*60*1000))}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => {
                              setSelectedDonation(donation);
                              setShowCancelModal(true);
                            }}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                      
                      {/* Impact Display */}
                      <div className="mt-4 bg-blue-50 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">
                          <span className="font-semibold">Monthly Impact:</span> Your donation funds{' '}
                          <span className="font-bold">{Math.floor(donation.amount / 50)} counseling sessions</span>{' '}
                          each month for people in need.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Monthly Donations</h3>
                  <p className="text-gray-600 mb-4">
                    Consider setting up a monthly donation to provide ongoing support.
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                    Start Monthly Donation
                  </button>
                </div>
              )}
            </div>

            {/* Recent Completed Donations */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Donations</h2>
              
              {completedDonations.length > 0 ? (
                <div className="space-y-3">
                  {completedDonations.slice(0, 5).map((donation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(donation.status)}
                        <div>
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(donation.amount)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {donation.type === 'monthly' ? 'Monthly' : 'One-time'} • {formatDate(donation.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">
                          {Math.floor(donation.amount / 50)} sessions funded
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {(donation.id || donation._id).slice(-8)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {completedDonations.length > 5 && (
                    <button className="w-full text-blue-600 hover:text-blue-700 py-2 text-sm">
                      View all donations ({completedDonations.length})
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No completed donations found</p>
              )}
            </div>

            {/* Cancelled Donations */}
            {cancelledDonations.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Cancelled Donations</h2>
                
                <div className="space-y-3">
                  {cancelledDonations.map((donation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(donation.amount)} / month
                          </div>
                          <div className="text-sm text-gray-600">
                            Cancelled on {formatDate(donation.cancelledAt || donation.updatedAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-red-600 font-medium">Cancelled</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cancel Donation Modal */}
        {showCancelModal && selectedDonation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <h3 className="text-xl font-bold text-gray-900">Cancel Monthly Donation</h3>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to cancel your monthly donation of{' '}
                    <span className="font-semibold">{formatCurrency(selectedDonation.amount)}</span>?
                  </p>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Impact:</strong> This will stop funding{' '}
                      {Math.floor(selectedDonation.amount / 50)} counseling sessions per month.
                    </p>
                  </div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for cancellation (optional):
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Help us improve by sharing why you're cancelling..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setSelectedDonation(null);
                      setCancelReason('');
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                    disabled={isProcessing}
                  >
                    Keep Donation
                  </button>
                  <button
                    onClick={handleCancelDonation}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Cancelling...
                      </>
                    ) : (
                      'Cancel Donation'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationManagementPage;