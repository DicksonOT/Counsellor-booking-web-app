import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CommunityPosts = ({ communityId, communityName }) => {
    const { token, backendUrl } = useContext(AppContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState({});
    const [commentText, setCommentText] = useState({});
    const [submittingComment, setSubmittingComment] = useState({});
    const [loadingComments, setLoadingComments] = useState({});
    const [postComments, setPostComments] = useState({});
    
    // New states for post creation
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
        tags: '',
        isAnonymous: false,
        postType: 'discussion',
        moodTag: '',
        supportLevel: 'low'
    });
    const [creatingPost, setCreatingPost] = useState(false);

    // Debug: Log props to console
    console.log('CommunityPosts props:', { communityId, communityName });

    // Fetch community posts
    const fetchCommunityPosts = async () => {
        try {
            console.log('Fetching posts for community:', communityId);
            setLoading(true);
            setError(null);

            const { data } = await axios.get(
                `${backendUrl}/api/user/communities/${communityId}/posts`,
                { headers: { token } }
            );

            console.log('API Response:', data);

            if (data.success) {
                setPosts(data.posts || []);
                console.log('Posts loaded:', data.posts?.length || 0);
            } else {
                setError(data.message || 'Failed to fetch posts');
                console.error('API Error:', data.message);
            }
        } catch (error) {
            console.error('Fetch posts error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to fetch community posts';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle creating a new post
    const handleCreatePost = async () => {
        try {
            // Validation
            if (!newPost.title.trim()) {
                toast.error('Please enter a post title');
                return;
            }
            if (!newPost.content.trim()) {
                toast.error('Please enter post content');
                return;
            }
            if (newPost.title.length > 200) {
                toast.error('Title too long (max 200 characters)');
                return;
            }
            if (newPost.content.length > 5000) {
                toast.error('Content too long (max 5000 characters)');
                return;
            }

            setCreatingPost(true);

            const postData = {
                title: newPost.title.trim(),
                content: newPost.content.trim(),
                tags: newPost.tags ? newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
                isAnonymous: newPost.isAnonymous,
                postType: newPost.postType,
                moodTag: newPost.moodTag,
                supportLevel: newPost.supportLevel
            };

            const { data } = await axios.post(
                `${backendUrl}/api/user/communities/${communityId}/posts`,
                postData,
                { headers: { token } }
            );

            if (data.success) {
                // Add the new post to the beginning of the posts array
                setPosts(prevPosts => [data.post, ...prevPosts]);
                
                // Reset form
                setNewPost({
                    title: '',
                    content: '',
                    tags: '',
                    isAnonymous: false,
                    postType: 'discussion',
                    moodTag: '',
                    supportLevel: 'low'
                });
                setShowCreatePost(false);
                
                toast.success('Post created successfully!');
            } else {
                toast.error(data.message || 'Failed to create post');
            }
        } catch (error) {
            console.error('Create post error:', error);
            toast.error(error.response?.data?.message || 'Failed to create post');
        } finally {
            setCreatingPost(false);
        }
    };

    // Handle like/unlike post
    const handleLikePost = async (postId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/posts/${postId}/like`,
                {},
                { headers: { token } }
            );

            if (data.success) {
                // Update the post in the local state
                setPosts(prevPosts => 
                    prevPosts.map(post => 
                        post._id === postId 
                            ? { 
                                ...post, 
                                likeCount: data.likeCount,
                                isLiked: data.liked 
                              }
                            : post
                    )
                );
                
                toast.success(data.message);
            } else {
                toast.error(data.message || 'Failed to update like status');
            }
        } catch (error) {
            console.error('Like post error:', error);
            toast.error(error.response?.data?.message || 'Failed to update like status');
        }
    };

    // Fetch comments for a post
    const fetchComments = async (postId) => {
        if (loadingComments[postId]) return;
        
        try {
            setLoadingComments(prev => ({ ...prev, [postId]: true }));
            
            const { data } = await axios.get(
                `${backendUrl}/api/user/posts/${postId}/comments`,
                { headers: { token } }
            );

            if (data.success) {
                setPostComments(prev => ({ ...prev, [postId]: data.comments }));
            } else {
                toast.error(data.message || 'Failed to fetch comments');
            }
        } catch (error) {
            console.error('Fetch comments error:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch comments');
        } finally {
            setLoadingComments(prev => ({ ...prev, [postId]: false }));
        }
    };

    // Handle comment submission
    const handleSubmitComment = async (postId) => {
        const content = commentText[postId]?.trim();
        if (!content) {
            toast.error('Please enter a comment');
            return;
        }

        if (submittingComment[postId]) return;

        try {
            setSubmittingComment(prev => ({ ...prev, [postId]: true }));
            
            const { data } = await axios.post(
                `${backendUrl}/api/user/posts/${postId}/comments`,
                { content },
                { headers: { token } }
            );

            if (data.success) {
                // Add the new comment to the local state
                setPostComments(prev => ({
                    ...prev,
                    [postId]: [data.comment, ...(prev[postId] || [])]
                }));

                // Update post comment count
                setPosts(prevPosts => 
                    prevPosts.map(post => 
                        post._id === postId 
                            ? { ...post, commentCount: (post.commentCount || 0) + 1 }
                            : post
                    )
                );

                // Clear comment text
                setCommentText(prev => ({ ...prev, [postId]: '' }));
                toast.success('Comment added successfully');
            } else {
                toast.error(data.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Submit comment error:', error);
            toast.error(error.response?.data?.message || 'Failed to add comment');
        } finally {
            setSubmittingComment(prev => ({ ...prev, [postId]: false }));
        }
    };

    // Toggle comments visibility
    const toggleComments = async (postId) => {
        const isCurrentlyShown = showComments[postId];
        
        setShowComments(prev => ({ ...prev, [postId]: !isCurrentlyShown }));
        
        // If showing comments and we haven't loaded them yet, fetch them
        if (!isCurrentlyShown && !postComments[postId]) {
            await fetchComments(postId);
        }
    };

    useEffect(() => {
        if (communityId) {
            fetchCommunityPosts();
        } else {
            console.error('No communityId provided to CommunityPosts');
        }
    }, [communityId]);

    // Loading state
    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {communityName || 'Community'} Posts
                </h2>
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading posts...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {communityName || 'Community'} Posts
                </h2>
                <div className="text-center py-12">
                    <div className="text-red-400 mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-red-600 text-lg">Error loading posts</p>
                    <p className="text-gray-500 text-sm mt-1">{error}</p>
                    <button 
                        onClick={fetchCommunityPosts}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {communityName || 'Community'} Posts ({posts.length})
                </h2>
                <button 
                    onClick={() => setShowCreatePost(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Create Post
                </button>
            </div>

            {/* Create Post Modal */}
            {showCreatePost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Create New Post</h3>
                            <button 
                                onClick={() => setShowCreatePost(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Post Title *
                                </label>
                                <input
                                    type="text"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Enter post title..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    maxLength="200"
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {newPost.title.length}/200 characters
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content *
                                </label>
                                <textarea
                                    value={newPost.content}
                                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                                    placeholder="What's on your mind?"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    rows="6"
                                    maxLength="5000"
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {newPost.content.length}/5000 characters
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={newPost.tags}
                                    onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
                                    placeholder="anxiety, support, wellness..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Post Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Post Type
                                </label>
                                <select
                                    value={newPost.postType}
                                    onChange={(e) => setNewPost(prev => ({ ...prev, postType: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="discussion">Discussion</option>
                                    <option value="support">Support Request</option>
                                    <option value="share">Share Experience</option>
                                    <option value="question">Question</option>
                                </select>
                            </div>

                            {/* Anonymous Option */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="anonymous"
                                    checked={newPost.isAnonymous}
                                    onChange={(e) => setNewPost(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                                    Post anonymously
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setShowCreatePost(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreatePost}
                                    disabled={creatingPost || !newPost.title.trim() || !newPost.content.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {creatingPost ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Creating...
                                        </div>
                                    ) : 'Create Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {posts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    </div>
                    <p className="text-gray-600 text-lg">No posts yet</p>
                    <p className="text-gray-500 text-sm mt-1">Be the first to start a discussion!</p>
                </div>
            ) : (
                /* Posts display */
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">
                                            {post.author?.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            {post.isAnonymous ? 'Anonymous' : (post.author?.name || 'Anonymous')}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                        {post.postType}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                {post.title}
                            </h3>
                            
                            <div className="text-gray-700 mb-4 whitespace-pre-wrap">
                                {post.content}
                            </div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.map((tag, index) => (
                                        <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <button 
                                    onClick={() => handleLikePost(post._id)}
                                    className={`flex items-center gap-2 transition-colors ${
                                        post.isLiked ? 'text-red-500' : 'hover:text-red-500'
                                    }`}
                                >
                                    <svg 
                                        className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} 
                                        fill={post.isLiked ? 'currentColor' : 'none'} 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {post.likeCount || post.likes?.length || 0}
                                </button>
                                
                                <button 
                                    onClick={() => toggleComments(post._id)}
                                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    {post.commentCount || post.comments?.length || 0} Comments
                                </button>
                            </div>

                            {/* Comments section */}
                            {showComments[post._id] && (
                                <div className="mt-6 border-t pt-4">
                                    {/* Comment input */}
                                    <div className="mb-4">
                                        <div className="flex gap-3">
                                            <div className="flex-1">
                                                <textarea
                                                    value={commentText[post._id] || ''}
                                                    onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                                                    placeholder="Write a comment..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                    rows="3"
                                                    maxLength="1000"
                                                />
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {(commentText[post._id] || '').length}/1000 characters
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSubmitComment(post._id)}
                                                disabled={submittingComment[post._id] || !(commentText[post._id]?.trim())}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed self-start"
                                            >
                                                {submittingComment[post._id] ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        Posting...
                                                    </div>
                                                ) : 'Post'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Comments list */}
                                    <div className="space-y-4">
                                        {loadingComments[post._id] ? (
                                            <div className="text-center py-4">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                                <p className="text-sm text-gray-500 mt-2">Loading comments...</p>
                                            </div>
                                        ) : postComments[post._id]?.length > 0 ? (
                                            postComments[post._id].map((comment) => (
                                                <div key={comment._id} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-gray-600 text-sm font-semibold">
                                                            {comment.author?.name?.charAt(0).toUpperCase() || 'U'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-sm text-gray-800">
                                                                {comment.author?.name || 'Anonymous'}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                                                        
                                                        {/* Replies */}
                                                        {comment.replies && comment.replies.length > 0 && (
                                                            <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-2">
                                                                {comment.replies.map((reply) => (
                                                                    <div key={reply._id} className="flex gap-2">
                                                                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                                                            <span className="text-gray-600 text-xs">
                                                                                {reply.author?.name?.charAt(0).toUpperCase() || 'U'}
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <span className="font-semibold text-xs text-gray-800">
                                                                                    {reply.author?.name || 'Anonymous'}
                                                                                </span>
                                                                                <span className="text-xs text-gray-500">
                                                                                    {new Date(reply.createdAt).toLocaleDateString()}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-gray-700 text-xs whitespace-pre-wrap">{reply.content}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommunityPosts;