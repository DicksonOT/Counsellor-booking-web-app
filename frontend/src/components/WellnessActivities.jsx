import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const WellnessActivities = () => {
    const navigate = useNavigate()
    const { token, backendUrl } = useContext(AppContext);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        activityType: '',
        difficulty: '',
        status: 'all' 
    });
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [completionData, setCompletionData] = useState({
        reflection: '',
        rating: 5
    });

    // Check authentication and redirect if not logged in
    useEffect(() => {
        if (!token || !backendUrl) {
            toast.info('Please log in to view wellness activities');
            navigate('/login');
            return;
        }
    }, [token, backendUrl, navigate]);

    // Fetch wellness activities
    const fetchActivities = async () => {
        if (!token || !backendUrl) {
            console.log('Missing token or backendUrl');
            return;
        }

        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.activityType) params.append('activityType', filters.activityType);
            if (filters.difficulty) params.append('difficulty', filters.difficulty);
            if (filters.status !== 'all') params.append('status', filters.status);

            const { data } = await axios.get(
                `${backendUrl}/api/user/wellness/activities?${params.toString()}`,
                { headers: { token } }
            );
            
            if (data.success) {
                setActivities(data.activities || []);
            } else {
                toast.error(data.message || 'Failed to fetch activities');
            }
        } catch (error) {
            console.error('Fetch activities error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch activities';
            toast.error(errorMessage);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    // Join activity
    const joinActivity = async (activityId) => {
        if (!token || !backendUrl) {
            toast.error('Authentication required');
            return;
        }

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/wellness/activities/${activityId}/join`,
                {},
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message || 'Successfully joined activity!');
                await fetchActivities(); // Refresh the list
            } else {
                toast.error(data.message || 'Failed to join activity');
            }
        } catch (error) {
            console.error('Join activity error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to join activity';
            toast.error(errorMessage);
        }
    };

    // Complete activity
    const completeActivity = async (activityId) => {
        if (!token || !backendUrl) {
            toast.error('Authentication required');
            return;
        }

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/wellness/activities/${activityId}/complete`,
                {
                    reflection: completionData.reflection.trim(),
                    rating: completionData.rating
                },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message || `Activity completed! You earned ${data.pointsEarned} points!`);
                setSelectedActivity(null);
                setCompletionData({ reflection: '', rating: 5 });
                await fetchActivities(); // Refresh the list
            } else {
                toast.error(data.message || 'Failed to complete activity');
            }
        } catch (error) {
            console.error('Complete activity error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to complete activity';
            toast.error(errorMessage);
        }
    };

    const getActivityIcon = (type) => {
        const icons = {
            daily_reflection: '💭',
            mood_checking: '😊',
            challenge: '🏆',
            meditation: '🧘',
            exercise: '💪',
            journaling: '📝'
        };
        return icons[type] || '🌟';
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            beginner: 'bg-green-100 text-green-800',
            intermediate: 'bg-yellow-100 text-yellow-800',
            advanced: 'bg-red-100 text-red-800'
        };
        return colors[difficulty] || 'bg-gray-100 text-gray-800';
    };

    useEffect(() => {
        if (token && backendUrl) {
            fetchActivities();
        }
    }, [filters, token, backendUrl]);

    // Don't render the component if not authenticated
    if (!token || !backendUrl) {
        return null;
    }

    return (
        <div className="p-6 rounded-lg shadow-lg mt-35">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">Wellness Activities</h2>
                <p className="text-gray-600">Discover activities to enhance your mental well-being</p>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                    <select
                        value={filters.activityType}
                        onChange={(e) => setFilters({...filters, activityType: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="daily_reflection">💭 Daily Reflection</option>
                        <option value="mood_checking">😊 Mood Checking</option>
                        <option value="challenge">🏆 Challenge</option>
                        <option value="meditation">🧘 Meditation</option>
                        <option value="exercise">💪 Exercise</option>
                        <option value="journaling">📝 Journaling</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                        value={filters.difficulty}
                        onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Activities</option>
                        <option value="available">Available to Join</option>
                        <option value="joined">My Activities</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading activities...</p>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-lg">No activities found</p>
                        <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <ActivityCard
                            key={activity._id}
                            activity={activity}
                            onJoin={() => joinActivity(activity._id)}
                            onComplete={() => setSelectedActivity(activity)}
                            getActivityIcon={getActivityIcon}
                            getDifficultyColor={getDifficultyColor}
                        />
                    ))
                )}
            </div>

            {/* Activity Completion Modal */}
            {selectedActivity && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">
                            Complete Activity: {selectedActivity.title}
                        </h3>
                        
                        {/* Activity Summary */}
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{getActivityIcon(selectedActivity.activityType)}</span>
                                <div>
                                    <h4 className="font-semibold text-gray-800">{selectedActivity.title}</h4>
                                    <p className="text-sm text-gray-600">{selectedActivity.duration} minutes</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700">{selectedActivity.description}</p>
                        </div>

                        {/* Activity Instructions */}
                        {selectedActivity.instructions && selectedActivity.instructions.length > 0 && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-3 text-gray-800">Instructions:</h4>
                                <ol className="space-y-2 text-sm text-gray-700">
                                    {selectedActivity.instructions.map((instruction, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="mr-3 mt-0.5 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                                                {index + 1}
                                            </span>
                                            <span>{instruction}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {/* Resources */}
                        {selectedActivity.resources && selectedActivity.resources.length > 0 && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-2 text-gray-800">Additional Resources:</h4>
                                <div className="space-y-1">
                                    {selectedActivity.resources.map((resource, index) => (
                                        <a
                                            key={index}
                                            href={resource}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-blue-600 hover:text-blue-800 text-sm flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            Resource {index + 1}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Completion Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    How was your experience? (Optional reflection)
                                </label>
                                <textarea
                                    value={completionData.reflection}
                                    onChange={(e) => setCompletionData({...completionData, reflection: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Share your thoughts, feelings, or insights from this activity..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Rate this activity (1-5 stars)
                                </label>
                                <div className="flex gap-1 items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setCompletionData({...completionData, rating: star})}
                                            className={`text-2xl transition-colors ${
                                                star <= completionData.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                                            }`}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600">
                                        {completionData.rating} out of 5
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => completeActivity(selectedActivity._id)}
                                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
                                >
                                    Mark as Completed
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedActivity(null);
                                        setCompletionData({ reflection: '', rating: 5 });
                                    }}
                                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 font-medium transition-colors"
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

// Activity Card Component
const ActivityCard = ({ activity, onJoin, onComplete, getActivityIcon, getDifficultyColor }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 bg-white">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{getActivityIcon(activity.activityType)}</span>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {activity.title}
                        </h3>
                        <p className="text-sm text-gray-500">{activity.duration} minutes</p>
                    </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ml-2 ${getDifficultyColor(activity.difficulty)}`}>
                    {activity.difficulty}
                </span>
            </div>
            
            <p className={`text-gray-600 text-sm mb-4 ${expanded ? '' : 'line-clamp-2'}`}>
                {activity.description}
            </p>

            {activity.description && activity.description.length > 100 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-600 text-xs mb-4 hover:text-blue-800 transition-colors"
                >
                    {expanded ? 'Show less' : 'Read more'}
                </button>
            )}

            {/* Activity Preview */}
            {expanded && activity.instructions && activity.instructions.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Preview Instructions:</h4>
                    <ol className="text-xs text-gray-600 space-y-1">
                        {activity.instructions.slice(0, 3).map((instruction, index) => (
                            <li key={index} className="flex items-start">
                                <span className="mr-2 text-blue-600 font-medium">{index + 1}.</span>
                                <span>{instruction}</span>
                            </li>
                        ))}
                        {activity.instructions.length > 3 && (
                            <li className="text-blue-600 text-xs">+ {activity.instructions.length - 3} more steps...</li>
                        )}
                    </ol>
                </div>
            )}

            {/* Status and Actions */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {activity.participantCount || 0}
                    </span>
                    <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {activity.activityType}
                    </span>
                </div>
            </div>

            {/* Action Button */}
            <div className="space-y-2">
                {!activity.isParticipant ? (
                    <button
                        onClick={onJoin}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Join Activity
                    </button>
                ) : !activity.isCompleted ? (
                    <button
                        onClick={onComplete}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        Complete Activity
                    </button>
                ) : (
                    <div className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-center font-medium">
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Completed
                        </span>
                    </div>
                )}

                {/* Progress indicator for joined activities */}
                {activity.isParticipant && !activity.isCompleted && (
                    <div className="text-xs text-center text-gray-500">
                        Ready to complete • Earn wellness points
                    </div>
                )}
            </div>
        </div>
    );
};

export default WellnessActivities;