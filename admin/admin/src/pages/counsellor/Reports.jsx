import React, { useState, useEffect, useContext } from 'react';
import { CounsellorContext } from '../../context/CounsellorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Reports = () => {
    const { cToken, backendUrl } = useContext(CounsellorContext);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [reviewData, setReviewData] = useState({
        actionTaken: '',
        reviewNotes: ''
    });

    // Fetch reports
    const fetchReports = async (status = 'pending') => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/counsellor/reports?status=${status}`, {
                headers: { cToken }
            });
            
            if (data.success) {
                setReports(data.reports || []);
            }
        } catch (error) {
            toast.error('Failed to fetch reports');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Review report
    const reviewReport = async (reportId) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/counsellor/reports/${reportId}/review`,
                reviewData,
                { headers: { cToken } }
            );

            if (data.success) {
                toast.success('Report reviewed successfully!');
                setSelectedReport(null);
                setReviewData({ actionTaken: '', reviewNotes: '' });
                fetchReports();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to review report');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Content Reports Management</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => fetchReports('pending')}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                    >
                        Pending Reports
                    </button>
                    <button
                        onClick={() => fetchReports('reviewed')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        Reviewed Reports
                    </button>
                </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading reports...</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No reports found.</p>
                    </div>
                ) : (
                    reports.map((report) => (
                        <div key={report._id} className="border rounded-lg p-6 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            report.status === 'pending' 
                                                ? 'bg-yellow-100 text-yellow-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {report.status}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <h3 className="font-semibold text-lg text-gray-800 mb-1">
                                            Report Reason: {report.reason}
                                        </h3>
                                        <p className="text-gray-700 mb-2">{report.description}</p>
                                        <p className="text-sm text-gray-500">
                                            Reported by: {report.reporter?.name || 'Anonymous User'}
                                        </p>
                                    </div>

                                    {/* Content Preview */}
                                    {report.reportedContent && (
                                        <div className="bg-gray-50 p-4 rounded-lg mt-3">
                                            <h4 className="font-medium text-sm mb-2">Reported Content:</h4>
                                            <p className="text-sm text-gray-700 line-clamp-3">
                                                {report.reportedContent.title || report.reportedContent.content}
                                            </p>
                                        </div>
                                    )}

                                    {/* Review Details (if reviewed) */}
                                    {report.status === 'reviewed' && report.reviewedBy && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                            <div className="text-sm">
                                                <p><span className="font-medium">Reviewed by:</span> {report.reviewedBy.name}</p>
                                                <p><span className="font-medium">Action taken:</span> {report.actionTaken}</p>
                                                {report.reviewNotes && (
                                                    <p><span className="font-medium">Notes:</span> {report.reviewNotes}</p>
                                                )}
                                                <p><span className="font-medium">Review date:</span> {new Date(report.reviewedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {report.status === 'pending' && (
                                    <button
                                        onClick={() => setSelectedReport(report)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ml-4"
                                    >
                                        Review Report
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Review Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Review Report</h3>
                        
                        {/* Report Details */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">Report Details</h4>
                            <p><strong>Reason:</strong> {selectedReport.reason}</p>
                            <p><strong>Description:</strong> {selectedReport.description}</p>
                            <p><strong>Reporter:</strong> {selectedReport.reporter?.name || 'Anonymous'}</p>
                            <p><strong>Date:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
                            
                            {selectedReport.reportedContent && (
                                <div className="mt-3">
                                    <strong>Reported Content:</strong>
                                    <div className="bg-white p-3 rounded border mt-1">
                                        <p className="text-sm">
                                            {selectedReport.reportedContent.title || selectedReport.reportedContent.content}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Review Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Action Taken *</label>
                                <select
                                    value={reviewData.actionTaken}
                                    onChange={(e) => setReviewData({...reviewData, actionTaken: e.target.value})}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select appropriate action</option>
                                    <option value="no_action">No Action Required</option>
                                    <option value="warning_issued">Warning Issued to User</option>
                                    <option value="content_removed">Content Removed</option>
                                    <option value="user_suspended">User Suspended</option>
                                    <option value="further_investigation">Requires Further Investigation</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Review Notes</label>
                                <textarea
                                    value={reviewData.reviewNotes}
                                    onChange={(e) => setReviewData({...reviewData, reviewNotes: e.target.value})}
                                    className="w-full p-3 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add detailed notes about your review decision..."
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => reviewReport(selectedReport._id)}
                                    disabled={!reviewData.actionTaken}
                                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    Submit Review
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedReport(null);
                                        setReviewData({ actionTaken: '', reviewNotes: '' });
                                    }}
                                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;