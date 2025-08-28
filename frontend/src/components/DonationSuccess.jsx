import React, { useEffect, useState, useContext } from 'react';
import { CheckCircle, Heart, Share2, Download, ArrowRight, Loader2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const DonationSuccessPage = ({ sessionId, onNavigate }) => {
  const { verifyDonationPayment } = useContext(AppContext);
  
  const [donation, setDonation] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState(null);

  // Get session ID from URL params if not passed as prop
  const getSessionId = () => {
    if (sessionId) return sessionId;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('session_id');
  };

  useEffect(() => {
    const currentSessionId = getSessionId();
    if (currentSessionId) {
      verifyDonation(currentSessionId);
    } else {
      setVerificationError('No session ID found');
      setIsVerifying(false);
    }
  }, [sessionId]);

  const verifyDonation = async (sessionId) => {
    try {
      setIsVerifying(true);
      const response = await verifyDonationPayment(sessionId);
      
      if (response.success) {
        setDonation(response.donation);
        toast.success('Donation verified successfully!');
      } else {
        setVerificationError(response.message || 'Failed to verify donation');
        toast.error('Failed to verify donation');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationError('An error occurred while verifying your donation');
      toast.error('An error occurred while verifying your donation');
    } finally {
      setIsVerifying(false);
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'I just donated to mental health support!',
          text: `I donated ${formatCurrency(donation?.amount)} to help provide free mental health counseling to those in need.`,
          url: window.location.origin
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `I just donated ${formatCurrency(donation?.amount)} to help provide free mental health counseling! Join me in making a difference: ${window.location.origin}`
      );
      toast.success('Message copied to clipboard!');
    }
  };

  const downloadReceipt = () => {
    if (!donation) return;
    
    // Create a simple receipt content
    const receiptContent = `
DONATION RECEIPT
================

Thank you for your generous donation!

Donation ID: ${donation.id || donation._id}
Amount: ${formatCurrency(donation.amount)}
Type: ${donation.type === 'monthly' ? 'Monthly Recurring' : 'One-time'}
Date: ${formatDate(donation.createdAt)}
Donor: ${donation.donorName}
Email: ${donation.donorEmail}

This donation is tax-deductible.
Tax ID: 12-3456789

Impact: Your donation can provide ${Math.floor(donation.amount / 50)} free counseling sessions.

Thank you for supporting mental health care accessibility!
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([receiptContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `donation-receipt-${donation.id || donation._id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Your Donation</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">✗</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{verificationError}</p>
          <div className="space-y-3">
            <button
              onClick={() => verifyDonation(getSessionId())}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => handleNavigation('/donate')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
            >
              Back to Donations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Thank You for Your Generosity!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your donation has been successfully processed and will make a real difference in someone's mental health journey.
          </p>
        </div>

        {/* Donation Details Card */}
        {donation && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Donation Confirmation</h2>
                <p className="text-green-100">Receipt ID: {donation.id || donation._id}</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Donation Amount</h3>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(donation.amount)}
                      {donation.type === 'monthly' && <span className="text-lg text-gray-600">/month</span>}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Donation Type</h3>
                    <p className="text-xl text-gray-700">
                      {donation.type === 'monthly' ? 'Monthly Recurring' : 'One-time Donation'}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Donor Information</h3>
                      <p className="text-gray-700">{donation.donorName}</p>
                      <p className="text-gray-600">{donation.donorEmail}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Date & Time</h3>
                      <p className="text-gray-700">{formatDate(donation.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Impact Section */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Heart className="h-5 w-5 fill-current" />
                    Your Impact
                  </h3>
                  <p className="text-blue-800 mb-2">
                    Your donation of {formatCurrency(donation.amount)} can provide{' '}
                    <span className="font-bold">{Math.floor(donation.amount / 50)} free counseling sessions</span>{' '}
                    to people who need mental health support but can't afford it.
                  </p>
                  {donation.type === 'monthly' && (
                    <p className="text-blue-700 text-sm">
                      As a monthly donor, you'll help provide {Math.floor(donation.amount / 50) * 12} sessions annually!
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={downloadReceipt}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Receipt
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Your Impact
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">What Happens Next?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Immediate Impact</h3>
              <p className="text-gray-600">
                Your donation is immediately allocated to our free counseling fund, helping someone in need today.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tax Receipt</h3>
              <p className="text-gray-600">
                You'll receive a tax-deductible receipt via email within 24 hours for your records.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Impact Updates</h3>
              <p className="text-gray-600">
                We'll keep you informed about how your donation is making a difference in our community.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Continue Making a Difference</h2>
          <p className="text-gray-600 mb-8">
            Explore more ways to support mental health in your community
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleNavigation('/volunteer')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              Volunteer With Us
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleNavigation('/donate')}
              className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Donate Again
            </button>
            <button
              onClick={() => handleNavigation('/')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSuccessPage;