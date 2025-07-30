import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const UserAssessmentProgress = () => {
    const { userData, backendUrl, token } = useContext(AppContext);
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAssessment = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/user/get-assessment`, {
                headers: { token }
            });
            if (res.data.success) {
                setAssessment(res.data.assessment);
            } else {
                toast.error("Failed to load assessment.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error fetching assessment.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData?._id) {
            fetchAssessment();
        }
    }, [userData]);

    if (loading) return <p className="text-center">Loading assessment...</p>;
    if (!assessment) return <p className="text-center text-red-500">No assessment data found.</p>;

    return (
        <div className="max-w-3xl p-6 border border-gray-300 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">Your Mental Wellness Progress</h2>

            <div className="mb-6 text-center">
                <p className="text-xl font-bold text-blue-700">Total Score: <span className="text-black">{assessment.totalScore}</span></p>
                <p className="text-sm text-gray-500 mt-1">A higher score means more engagement with your wellness.</p>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Score History</h3>
                <ul className="space-y-3">
                    {assessment.scoreHistory?.slice().reverse().map((entry, index) => (
                        <li key={index} className="bg-gray-100 p-3 rounded shadow">
                            <p className="text-sm text-gray-800">
                                <strong>+{entry.score}</strong> points from <span className="capitalize font-medium">{entry.source}</span>
                            </p>
                            <p className="text-xs text-gray-500">{new Date(entry.date).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserAssessmentProgress;
