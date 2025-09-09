import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import CommunityPosts from './UserCommunityPosts';

const Communities = () => {
    const { token, backendUrl } = useContext(AppContext);
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState({});
    const [selectedCommunity, setSelectedCommunity] = useState(null); 
    const [filters, setFilters] = useState({
        category: '',
        theme: '',
        search: ''
    });

    const fetchCommunities = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.theme) params.append('theme', filters.theme);
            if (filters.search) params.append('search', filters.search);

            const { data } = await axios.get(`${backendUrl}/api/user/communities?${params.toString()}`,  { headers: { token } } );
            
            if (data.success) {
                setCommunities(data.communities || []);
            } else {
                toast.error('Failed to fetch communities');
            }
        } catch (error) {
            toast.error('Failed to fetch communities');
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    // Update a specific community's membership status locally
    const updateCommunityMembership = (communityId, newMemberStatus, newMemberCount) => {
        setCommunities(prevCommunities => 
            prevCommunities.map(community => 
                community._id === communityId 
                    ? { 
                        ...community, 
                        isMember: newMemberStatus, 
                        memberCount: newMemberCount 
                    }
                    : community
            )
        );

        if (selectedCommunity && selectedCommunity._id === communityId) {
            setSelectedCommunity(prev => ({
                ...prev,
                isMember: newMemberStatus,
                memberCount: newMemberCount
            }));
        }
    };

    // Join community
    const joinCommunity = async (communityId) => {
        try {
            setActionLoading(prev => ({ ...prev, [communityId]: true }));

            const { data } = await axios.post(
                `${backendUrl}/api/user/communities/${communityId}/join`,
                {},
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                // Use the member count from backend response
                const newMemberCount = data.data?.memberCount || (communities.find(c => c._id === communityId)?.memberCount || 0) + 1;
                
                updateCommunityMembership(communityId, true, newMemberCount);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to join community');
            }
            console.error('Join community error:', error);
        } finally {
            setActionLoading(prev => ({ ...prev, [communityId]: false }));
        }
    };

    // Leave community
    const leaveCommunity = async (communityId) => {
        if (!window.confirm('Are you sure you want to leave this community?')) {
            return;
        }
        
        try {
            setActionLoading(prev => ({ ...prev, [communityId]: true }));

            const { data } = await axios.post(
                `${backendUrl}/api/user/communities/${communityId}/leave`,
                {},
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                // Use the member count from backend response
                const newMemberCount = data.data?.memberCount || Math.max((communities.find(c => c._id === communityId)?.memberCount || 1) - 1, 0);
                
                updateCommunityMembership(communityId, false, newMemberCount);
                
                // If user is viewing posts of the community they're leaving, go back to community list
                if (selectedCommunity && selectedCommunity._id === communityId) {
                    setSelectedCommunity(null);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to leave community');
            }
            console.error('Leave community error:', error);
        } finally {
            setActionLoading(prev => ({ ...prev, [communityId]: false }));
        }
    };

    // View community posts
    const viewCommunityPosts = (community) => {
        setSelectedCommunity(community);
    };

    // Handle image error
    const handleImageError = (e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
    };

    // Get image URL - handles both relative and absolute URLs
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        
        // If it's a relative path, prepend the backend URL
        return `${backendUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    useEffect(() => {
        fetchCommunities();
    }, [filters]);

    // If a community is selected, show its posts
    if (selectedCommunity) {
        return (
            <div>
                {/* Back to communities button */}
                <div className="mb-4">
                    <button
                        onClick={() => setSelectedCommunity(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Communities
                    </button>
                </div>
                
                {/* Community Posts Component */}
                <CommunityPosts
                    communityId={selectedCommunity._id} 
                    communityName={selectedCommunity.name}
                />
            </div>
        );
    }

    // Default view - community list
    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">Support Communities</h2>
                <p className="text-gray-600">Find and join communities that align with your wellness journey</p>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Communities</label>
                    <input
                        type="text"
                        placeholder="Search by name or description..."
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                        className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        <option value="peer_support">Peer Support</option>
                        <option value="counselor_led">Counselor Led</option>
                        <option value="wellness_activities">Wellness Activities</option>
                        <option value="resource_sharing">Resource Sharing</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                    <select
                        value={filters.theme}
                        onChange={(e) => setFilters({...filters, theme: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Themes</option>
                        <option value="anxiety">Anxiety Support</option>
                        <option value="depression">Depression Support</option>
                        <option value="mindfulness">Mindfulness</option>
                        <option value="trauma">Trauma Healing</option>
                        <option value="stress">Stress Management</option>
                        <option value="general">General Wellness</option>
                    </select>
                </div>
            </div>

            {/* Communities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading communities...</p>
                    </div>
                ) : communities.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-lg">No communities found</p>
                        <p className="text-gray-500 text-sm mt-1">Try adjusting your search filters</p>
                    </div>
                ) : (
                    communities.map((community) => (
                        <div key={community._id} className="border border-blue-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 bg-white">
                            {/* Community Image */}
                            <div className="relative h-48 bg-gradient-to-r from-blue-100 to-blue-200">
                                {community.image && getImageUrl(community.image) ? (
                                    <>
                                        <img
                                            src={getImageUrl(community.image)}
                                            alt={community.name}
                                            onError={handleImageError}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Fallback placeholder - hidden by default, shown on image error */}
                                        <div 
                                            className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200"
                                            style={{ display: 'none' }}
                                        >
                                            <div className="text-center">
                                                <svg className="w-16 h-16 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <p className="text-blue-600 text-sm font-medium">Community Image</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // Default placeholder when no image
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <svg className="w-16 h-16 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p className="text-blue-600 text-sm font-medium">Community Image</p>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Member Status Overlay */}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                                        community.isMember 
                                            ? 'bg-green-100/90 text-green-800 border border-green-200' 
                                            : 'bg-blue-100/90 text-blue-800 border border-blue-200'
                                    }`}>
                                        {community.isMember ? 'Member' : 'Open'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="mb-3">
                                    <h3 className="text-lg font-semibold text-blue-700 line-clamp-2">{community.name}</h3>
                                </div>
                                
                                <p className="text-gray-600 mb-4 text-sm line-clamp-3 leading-relaxed">
                                    {community.description}
                                </p>
                                
                                {/* Tags */}
                                {community.tags && community.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {community.tags.slice(0, 3).map((tag, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                                #{tag}
                                            </span>
                                        ))}
                                        {community.tags.length > 3 && (
                                            <span className="text-gray-500 text-xs px-2 py-1">
                                                +{community.tags.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Community Stats */}
                                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                            {community.memberCount || 0} members
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                            {community.postCount || 0} posts
                                        </span>
                                    </div>
                                    <span className="capitalize bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                        {community.category?.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    {/* View Posts Button (only for members) */}
                                    {community.isMember && (
                                        <button
                                            onClick={() => viewCommunityPosts(community)}
                                            className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                            View Posts & Discussions
                                        </button>
                                    )}

                                    {/* Join/Leave Button */}
                                    <button
                                        onClick={() => community.isMember ? 
                                            leaveCommunity(community._id) : 
                                            joinCommunity(community._id)
                                        }
                                        disabled={actionLoading[community._id]}
                                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                            community.isMember ?
                                            'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300' :
                                            'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md'
                                        }`}
                                    >
                                        {actionLoading[community._id] ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                {community.isMember ? 'Leaving...' : 'Joining...'}
                                            </span>
                                        ) : community.isMember ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Leave Community
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                </svg>
                                                Join Community
                                            </span>
                                        )}
                                    </button>
                                </div>

                                {/* Quick Stats for Members */}
                                {community.isMember && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Last active: {community.lastActivity ? new Date(community.lastActivity).toLocaleDateString() : 'Recently'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Communities;