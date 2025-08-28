import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const Progress = () => {
    const { token, backendUrl } = useContext(AppContext);
    const [progress, setProgress] = useState(null);
    const [monthlyHistory, setMonthlyHistory] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [userCommunities, setUserCommunities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState('all');

    // Fetch user progress with time range
    const fetchProgress = async () => {
        try {
            setLoading(true);
            
            const { data } = await axios.get(`${backendUrl}/api/user/wellness/progress?timeRange=${timeRange}`, {
                headers: { token }
            });
            
            if (data.success) {
                setProgress(data.progress);
            } else {
                toast.error(data.message || 'Failed to fetch progress');
                setProgress(getDefaultProgress());
            }
        } catch (error) {
            console.error('Fetch progress error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch progress';
            toast.error(errorMessage);
            setProgress(getDefaultProgress());
        } finally {
            setLoading(false);
        }
    };

    // Fetch user posts with time range
    const fetchUserPosts = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/wellness/posts?timeRange=${timeRange}`, {
                headers: { token }
            });
            
            if (data.success) {
                setUserPosts(data.posts || []);
                
                // Update today's post count in progress
                if (progress && timeRange === 'today') {
                    const updatedProgress = { ...progress };
                    updatedProgress.todayStats.postsCreated = data.posts.length;
                    setProgress(updatedProgress);
                }
            }
        } catch (error) {
            console.error('Fetch posts error:', error);
            setUserPosts([]);
        }
    };

    // Fetch user communities with time range
    const fetchUserCommunities = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/wellness/communities?timeRange=${timeRange}`, {
                headers: { token }
            });
            
            if (data.success) {
                setUserCommunities(data.communities || []);
            }
        } catch (error) {
            console.error('Fetch communities error:', error);
            setUserCommunities([]);
        }
    };

    // Fetch monthly history
    const fetchMonthlyHistory = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/wellness/monthly-history`, {
                headers: { token }
            });
            
            if (data.success) {
                setMonthlyHistory(data.monthlyHistory || []);
            }
        } catch (error) {
            console.error('Fetch monthly history error:', error);
        }
    };

    const getDefaultProgress = () => ({
        wellnessPoints: 0,
        completedActivities: [],
        joinedCommunities: [],
        supportGiven: 0,
        streaks: {
            communityEngagement: { current: 0, longest: 0 },
            activityCompletion: { current: 0, longest: 0 }
        },
        monthlyStats: {
            pointsThisMonth: 0,
            activitiesThisMonth: 0,
            postsThisMonth: 0,
            supportGivenThisMonth: 0
        },
        weeklyStats: {
            activitiesCompleted: 0,
            postsCreated: 0,
            pointsEarned: 0,
            lastWeekActivities: 0,
            lastWeekPosts: 0,
            lastWeekPoints: 0
        },
        todayStats: {
            activitiesCompleted: 0,
            pointsEarned: 0,
            postsCreated: 0
        },
        achievements: [],
        badges: []
    });

    const getProgressLevel = (points) => {
        if (points < 100) return { level: 1, name: 'Beginner', nextLevel: 100, color: 'text-green-600' };
        if (points < 500) return { level: 2, name: 'Explorer', nextLevel: 500, color: 'text-blue-600' };
        if (points < 1000) return { level: 3, name: 'Practitioner', nextLevel: 1000, color: 'text-purple-600' };
        if (points < 2000) return { level: 4, name: 'Advocate', nextLevel: 2000, color: 'text-orange-600' };
        return { level: 5, name: 'Wellness Champion', nextLevel: null, color: 'text-yellow-600' };
    };

    const getStreakIcon = (days) => {
        if (days >= 30) return '🔥';
        if (days >= 7) return '⚡';
        if (days >= 3) return '✨';
        return '🌟';
    };

    const getMonthName = (monthIndex) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthIndex];
    };

    const getTimeRangeLabel = () => {
        switch(timeRange) {
            case 'today': return 'Today';
            case 'week': return 'This Week';
            case 'month': return 'This Month (August)';
            case 'year': return 'This Year';
            default: return 'All Time';
        }
    };

    const getCurrentPeriodStats = () => {
        if (!progress) return { activities: 0, posts: 0, points: 0 };
        
        switch(timeRange) {
            case 'today':
                return {
                    activities: progress.todayStats?.activitiesCompleted || 0,
                    posts: progress.todayStats?.postsCreated || userPosts.length || 0,
                    points: progress.todayStats?.pointsEarned || 0
                };
            case 'week':
                return {
                    activities: progress.weeklyStats?.activitiesCompleted || 0,
                    posts: progress.weeklyStats?.postsCreated || userPosts.length || 0,
                    points: progress.weeklyStats?.pointsEarned || 0
                };
            case 'month':
                return {
                    activities: progress.monthlyStats?.activitiesThisMonth || 0,
                    posts: progress.monthlyStats?.postsThisMonth || userPosts.length || 0,
                    points: progress.monthlyStats?.pointsThisMonth || 0
                };
            default:
                return {
                    activities: progress.completedActivities?.length || 0,
                    posts: userPosts.length || 0,
                    points: progress.wellnessPoints || 0
                };
        }
    };

    useEffect(() => {
        fetchProgress();
        fetchUserPosts();
        fetchUserCommunities();
    }, [timeRange]);

    useEffect(() => {
        fetchMonthlyHistory();
    }, []);

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your progress...</p>
                </div>
            </div>
        );
    }

    const progressData = progress || getDefaultProgress();
    const levelInfo = getProgressLevel(progressData.wellnessPoints || 0);
    const currentStats = getCurrentPeriodStats();

    return (
        <div className="space-y-6">
            {/* Header with Time Range Filter */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Your Wellness Journey</h2>
                        <p className="text-gray-600">Track your progress and celebrate achievements • {getTimeRangeLabel()}</p>
                    </div>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Time</option>
                        <option value="year">This Year</option>
                        <option value="month">This Month</option>
                        <option value="week">This Week</option>
                        <option value="today">Today</option>
                    </select>
                </div>

                {/* Level and Points Overview */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className={`text-2xl font-bold ${levelInfo.color}`}>
                                {timeRange === 'all' ? `Level ${levelInfo.level}: ${levelInfo.name}` : `${getTimeRangeLabel()} Progress`}
                            </h3>
                            <p className="text-gray-600 mt-1">
                                {currentStats.points} wellness points
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl mb-2">🏆</div>
                            {levelInfo.nextLevel && timeRange === 'all' && (
                                <p className="text-sm text-gray-600">
                                    {levelInfo.nextLevel - (progressData.wellnessPoints || 0)} points to next level
                                </p>
                            )}
                        </div>
                    </div>
                    
                    {/* Progress Bar - Only show for all time */}
                    {levelInfo.nextLevel && timeRange === 'all' && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                    style={{ 
                                        width: `${Math.min(((progressData.wellnessPoints || 0) / levelInfo.nextLevel) * 100, 100)}%` 
                                    }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Current Period Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{currentStats.points}</div>
                        <div className="text-sm text-gray-600">Wellness Points</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{currentStats.activities}</div>
                        <div className="text-sm text-gray-600">Activities Completed</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{currentStats.posts}</div>
                        <div className="text-sm text-gray-600">Posts Created</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{userCommunities.length}</div>
                        <div className="text-sm text-gray-600">Communities {timeRange === 'all' ? 'Joined' : 'Active'}</div>
                    </div>
                </div>
            </div>

            {/* Today's Progress - Show when timeRange is today */}
            {timeRange === 'today' && (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        📅 Today's Progress
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{progressData.todayStats?.pointsEarned || 0}</div>
                            <div className="text-sm text-gray-600">Points Earned</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{progressData.todayStats?.activitiesCompleted || 0}</div>
                            <div className="text-sm text-gray-600">Activities Done</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{currentStats.posts}</div>
                            <div className="text-sm text-gray-600">Posts Created</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Monthly Progress Display */}
            {timeRange === 'month' && (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        📊 This Month's Progress (August)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{progressData.monthlyStats?.pointsThisMonth || 0}</div>
                            <div className="text-sm text-gray-600">Points This Month</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{progressData.monthlyStats?.activitiesThisMonth || 0}</div>
                            <div className="text-sm text-gray-600">Activities This Month</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{progressData.monthlyStats?.postsThisMonth || 0}</div>
                            <div className="text-sm text-gray-600">Posts This Month</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{progressData.monthlyStats?.supportGivenThisMonth || 0}</div>
                            <div className="text-sm text-gray-600">Support Given</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Weekly Summary */}
            {timeRange === 'week' && (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        This Week's Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Activities</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                                {progressData.weeklyStats?.activitiesCompleted || 0}
                            </div>
                            <div className="text-xs text-gray-500">
                                {((progressData.weeklyStats?.activitiesCompleted || 0) >= (progressData.weeklyStats?.lastWeekActivities || 0)) ? '↗️' : '↘️'} 
                                vs last week ({progressData.weeklyStats?.lastWeekActivities || 0})
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Community Posts</span>
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                                {progressData.weeklyStats?.postsCreated || 0}
                            </div>
                            <div className="text-xs text-gray-500">
                                {((progressData.weeklyStats?.postsCreated || 0) >= (progressData.weeklyStats?.lastWeekPosts || 0)) ? '↗️' : '↘️'} 
                                vs last week ({progressData.weeklyStats?.lastWeekPosts || 0})
                            </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Points Earned</span>
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                                {progressData.weeklyStats?.pointsEarned || 0}
                            </div>
                            <div className="text-xs text-gray-500">
                                {((progressData.weeklyStats?.pointsEarned || 0) >= (progressData.weeklyStats?.lastWeekPoints || 0)) ? '↗️' : '↘️'} 
                                vs last week ({progressData.weeklyStats?.lastWeekPoints || 0})
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Monthly History Chart */}
            {monthlyHistory.length > 0 && timeRange === 'all' && (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        Monthly Progress History
                    </h3>
                    <div className="overflow-x-auto">
                        <div className="flex gap-4 min-w-full pb-4">
                            {monthlyHistory.slice(-6).map((month, index) => (
                                <div key={`${month.year}-${month.month}`} className="flex-shrink-0 w-32">
                                    <div className={`p-4 rounded-lg border-2 ${month.isCurrentMonth ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                                        <div className="text-center">
                                            <div className="text-sm font-medium text-gray-700 mb-2">
                                                {getMonthName(month.month)} {month.year}
                                                {month.isCurrentMonth && <span className="text-blue-600 text-xs block">Current</span>}
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <div className="text-lg font-bold text-blue-600">{month.pointsEarned}</div>
                                                    <div className="text-xs text-gray-500">Points</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-green-600">{month.activitiesCompleted}</div>
                                                    <div className="text-xs text-gray-500">Activities</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-purple-600">{month.postsCreated}</div>
                                                    <div className="text-xs text-gray-500">Posts</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Streaks Section - Only show for all time */}
            {timeRange === 'all' && (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        Current Streaks
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-800">Community Engagement</span>
                                <span className="text-2xl">
                                    {getStreakIcon(progressData.streaks?.communityEngagement?.current || 0)}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {progressData.streaks?.communityEngagement?.current || 0} days
                            </div>
                            <div className="text-sm text-gray-500">
                                Personal best: {progressData.streaks?.communityEngagement?.longest || 0} days
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                                <div 
                                    className="bg-blue-500 h-1 rounded-full"
                                    style={{ 
                                        width: `${Math.min(((progressData.streaks?.communityEngagement?.current || 0) / Math.max(progressData.streaks?.communityEngagement?.longest || 1, 1)) * 100, 100)}%` 
                                    }}
                                ></div>
                            </div>
                        </div>
                        
                        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-800">Activity Completion</span>
                                <span className="text-2xl">
                                    {getStreakIcon(progressData.streaks?.activityCompletion?.current || 0)}
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {progressData.streaks?.activityCompletion?.current || 0} days
                            </div>
                            <div className="text-sm text-gray-500">
                                Personal best: {progressData.streaks?.activityCompletion?.longest || 0} days
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                                <div 
                                    className="bg-green-500 h-1 rounded-full"
                                    style={{ 
                                        width: `${Math.min(((progressData.streaks?.activityCompletion?.current || 0) / Math.max(progressData.streaks?.activityCompletion?.longest || 1, 1)) * 100, 100)}%` 
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Activities */}
            {progressData.completedActivities && progressData.completedActivities.length > 0 && (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        Recent Completed Activities ({getTimeRangeLabel()})
                    </h3>
                    <div className="space-y-3">
                        {progressData.completedActivities.slice(0, 5).map((activity, index) => (
                            <div key={activity._id || index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-800">{activity.title}</span>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="capitalize">{activity.activityType}</span>
                                            <span>•</span>
                                            <span>{activity.duration} min</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-green-600">
                                        +{activity.pointsEarned || 10} pts
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {activity.completedAt ? new Date(activity.completedAt).toLocaleDateString() : 'Recently'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {progressData.completedActivities.length > 5 && (
                        <div className="text-center mt-4">
                            <span className="text-sm text-gray-500">
                                And {progressData.completedActivities.length - 5} more activities completed
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Recent Posts */}
            {userPosts.length > 0 && (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        Your Recent Posts ({getTimeRangeLabel()})
                    </h3>
                    <div className="space-y-3">
                        {userPosts.slice(0, 5).map((post, index) => (
                            <div key={post._id || index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-gray-800 line-clamp-1">{post.title || 'Untitled Post'}</h4>
                                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                        {post.community?.name || 'Community'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.content}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>Posted: {new Date(post.createdAt).toLocaleDateString()}</span>
                                    <span>Likes: {post.likeCount || 0} • Comments: {post.commentCount || 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {userPosts.length > 5 && (
                        <div className="text-center mt-4">
                            <span className="text-sm text-gray-500">
                                And {userPosts.length - 5} more posts
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Community Engagement */}
            {userCommunities.length > 0 && (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        Your Communities ({getTimeRangeLabel()})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userCommunities.slice(0, 6).map((community) => (
                            <div key={community._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-gray-800 line-clamp-1">{community.name}</h4>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {community.memberCount} members
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{community.description}</p>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>Your posts: {community.userPostCount || 0}</span>
                                    <span>Joined: {community.joinedAt ? new Date(community.joinedAt).toLocaleDateString() : 'Recently'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {userCommunities.length > 6 && (
                        <div className="text-center mt-4">
                            <span className="text-sm text-gray-500">
                                And {userCommunities.length - 6} more communities
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Achievement Badges - Only show for all time */}
            {timeRange === 'all' && progressData.achievements && progressData.achievements.length > 0 && (
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        Achievements
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {progressData.achievements.map((achievement, index) => (
                            <div key={index} className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div className="text-2xl mb-2">{achievement.icon || '🏆'}</div>
                                <div className="font-medium text-sm text-gray-800">{achievement.name}</div>
                                <div className="text-xs text-gray-600 mt-1">{achievement.description}</div>
                                <div className="text-xs text-yellow-600 mt-1">
                                    {achievement.earnedAt ? new Date(achievement.earnedAt).toLocaleDateString() : 'Recently earned'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Motivational Message */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg">
                <div className="text-center">
                    <div className="text-2xl mb-2">⭐</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Keep Going!</h3>
                    <p className="text-gray-600">
                        {timeRange === 'all' ? (
                            progressData.wellnessPoints < 100 
                                ? "You're just getting started on your wellness journey. Every small step counts!"
                                : progressData.wellnessPoints < 500
                                ? "Great progress! You're building healthy habits that will last a lifetime."
                                : progressData.wellnessPoints < 1000
                                ? "Amazing work! You're becoming a wellness practitioner and inspiring others."
                                : "Incredible dedication! You're a true wellness champion and role model for others."
                        ) : (
                            `Great work ${getTimeRangeLabel().toLowerCase()}! Stay consistent with your wellness journey.`
                        )}
                    </p>
                </div>
            </div>

            {/* Getting Started Message for new users */}
            {progressData.wellnessPoints === 0 && currentStats.activities === 0 && currentStats.posts === 0 && (
                <div className="p-6 bg-blue-50 rounded-lg shadow-lg border border-blue-200">
                    <div className="text-center">
                        <div className="text-2xl mb-2">🚀</div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Ready to Begin?</h3>
                        <p className="text-blue-700 mb-4">
                            Start your wellness journey by joining communities, completing activities, and connecting with others!
                        </p>
                        <div className="flex justify-center gap-3">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Join Communities
                            </button>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                Browse Activities
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Progress;