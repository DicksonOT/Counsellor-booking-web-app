import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, User, Mail, BookOpen, Calendar, Award } from 'lucide-react';
import axios from "axios";

const ApproveCounsellors = () => {
  const { aToken, backendUrl, fetchPendingCounsellors, pendingCounsellors, setPendingCounsellors, loading, error } = useContext(AdminContext);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

const handleApproval = async (id, status, counsellorName) => {
  if (processingIds.has(id)) return;

  try {
    setProcessingIds(prev => new Set(prev).add(id));

    const { data } = await axios.patch(
      `${backendUrl}/api/admin/approve/${id}`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
          aToken: aToken
        }
      }
    );

    if (!data) {
      throw new Error('No response data received');
    }

    if (data.success) {
      setPendingCounsellors(prev => prev.filter(c => c._id !== id));
      showNotification(
        `${counsellorName} has been ${status} successfully`,
        'success'
      );
    } else {
      throw new Error(data.message || 'Approval failed');
    }
  } catch (err) {
    console.error('Error approving:', err);
    showNotification(
      err.message || `Failed to ${status.toLowerCase()} application`,
      'error'
    );
  } finally {
    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }
};

  const handleRetry = () => {
    fetchPendingCounsellors();
  };

  useEffect(() => {
    if (aToken && backendUrl) {
      fetchPendingCounsellors();
    }
  }, [fetchPendingCounsellors, aToken, backendUrl]);

  // Notification Component
  const Notification = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
    const Icon = type === 'success' ? CheckCircle : AlertCircle;

    return (
      <div className={`fixed top-4 right-4 p-4 rounded-lg border ${bgColor} ${textColor} shadow-lg z-50 max-w-md`}>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600"
            aria-label="Close notification"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading pending applications...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Applications</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pending Counselor Applications</h1>
            <p className="text-gray-600 mt-1">
              Review and approve counselor registration requests
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Refresh applications"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Applications Count */}
      {pendingCounsellors.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium">
            {pendingCounsellors.length} application{pendingCounsellors.length !== 1 ? 's' : ''} pending review
          </p>
        </div>
      )}

      {/* Applications List */}
      {pendingCounsellors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">All Caught Up!</h2>
          <p className="text-gray-600">No pending counselor applications at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingCounsellors.map((counsellor) => {
            const isProcessing = processingIds.has(counsellor._id);

            return (
              <div
                key={counsellor._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {counsellor.image ? (
                        <img
                          src={counsellor.image}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {counsellor.name}
                        </h2>
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{counsellor.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">GPC Number</p>
                        <p className="text-sm font-medium text-gray-900">{counsellor.gpcNumber || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Degree</p>
                        <p className="text-sm font-medium text-gray-900">{counsellor.degree}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Experience</p>
                        <p className="text-sm font-medium text-gray-900">{counsellor.experienceYears} years</p>
                      </div>
                    </div>

                    <div className="md:col-span-2 lg:col-span-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Specialty</p>
                      <div className="flex flex-wrap gap-1">
                        {counsellor.specialty}
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {counsellor.cvPath && (
                      <a
                        href={counsellor.cvPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm hover:text-blue-800"
                        download
                      >
                        Download CV
                      </a>
                    )}
                    {counsellor.licensePath && (
                      <a
                        href={counsellor.licensePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm hover:text-blue-800"
                        download
                      >
                        Download License
                      </a>
                    )}
                    {counsellor.certificatePaths?.length > 0 && counsellor.certificatePaths.map((cert, i) => (
                      <a
                        key={i}
                        href={cert}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm hover:text-blue-800"
                        download
                      >
                        Download Certificate {i + 1}
                      </a>
                    ))}
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 text-sm text-gray-700 space-y-2">
                    <p><strong>About:</strong> {counsellor.about || 'Not provided'}</p>
                    <p><strong>Fees:</strong> ${counsellor.fees || 'Not specified'}</p>
                    <p><strong>Location:</strong> {counsellor.location || 'Not specified'}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleApproval(counsellor._id, 'approved', counsellor.name)}
                      disabled={isProcessing}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
                      aria-label={`Approve ${counsellor.name}`}
                    >
                      {isProcessing ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      {isProcessing ? 'Processing...' : 'Approve'}
                    </button>

                    <button
                      onClick={() => handleApproval(counsellor._id, 'rejected', counsellor.name)}
                      disabled={isProcessing}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
                      aria-label={`Reject ${counsellor.name}`}
                    >
                      {isProcessing ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {isProcessing ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApproveCounsellors;