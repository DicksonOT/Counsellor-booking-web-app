import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PostComments = ({ postId }) => {
    const { token, backendUrl } = useContext(AppContext);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [sortBy, setSortBy] = useState('recent'); // recent, oldest, most_liked

    // Fetch comments
    const fetchComments = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${backendUrl}/api/user/posts/${postId}/comments?sortBy=${sortBy}`,
                { headers: { token } }
            );
            
            if (data.success) {
                setComments(data.comments || []);
            }
        } catch (error) {
            toast.error('Failed to fetch comments');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Create comment
    const createComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/posts/${postId}/comments`,
                {
                    content: newComment.trim(),
                    isAnonymous
                },
                { headers: { token } }
            );

            if (data.success) {
                setComments([data.comment, ...comments]);
                setNewComment('');
                setIsAnonymous(false);
                toast.success('Comment added successfully!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to add comment');
            console.error(error);
        }
    };

    // Create reply
    const createReply = async (parentCommentId, content, anonymous = false) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/posts/${postId}/comments`,
                {
                    content: content.trim(),
                    isAnonymous: anonymous,
                    parentCommentId
                },
                { headers: { token } }
            );

            if (data.success) {
                fetchComments(); // Refresh to show new reply
                toast.success('Reply added successfully!');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to add reply');
            console.error(error);
        }
    };

    // Like comment
    const likeComment = async (commentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/comments/${commentId}/like`,
                {},
                { headers: { token } }
            );

            if (data.success) {
                setComments(comments.map(comment => {
                    if (comment._id === commentId) {
                        return { ...comment, likeCount: data.likeCount, isLiked: data.liked };
                    }
                    // Check replies too
                    if (comment.replies) {
                        comment.replies = comment.replies.map(reply => 
                            reply._id === commentId 
                                ? { ...reply, likeCount: data.likeCount, isLiked: data.liked }
                                : reply
                        );
                    }
                    return comment;
                }));
            }
        } catch (error) {
            toast.error('Failed to like comment');
            console.error(error);
        }
    };

    // Report comment
    const reportComment = async (commentId, reason, description) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/comments/${commentId}/report`,
                { reason, description },
                { headers: { token } }
            );

            if (data.success) {
                toast.success('Comment reported successfully. Thank you for helping keep our community safe.');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to report comment');
            console.error(error);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId, sortBy]);

    return (
        <div className="p-6">
            {/* Comments Header */}
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800">
                    Comments ({comments.length})
                </h4>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                    <option value="most_liked">Most Liked</option>
                </select>
            </div>

            {/* Add Comment Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <form onSubmit={createComment}>
                    <div className="mb-3">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your thoughts and support..."
                            className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            maxLength={1000}
                        />
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <span>{newComment.length}/1000 characters</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <label className="flex items-center text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                className="mr-2 rounded"
                            />
                            Comment anonymously
                        </label>
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            Add Comment
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading comments...</p>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-gray-600">No comments yet</p>
                        <p className="text-gray-500 text-sm mt-1">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            onReply={createReply}
                            onLike={likeComment}
                            onReport={reportComment}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

// Comment Item Component
const CommentItem = ({ comment, onReply, onLike, onReport }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [replyAnonymous, setReplyAnonymous] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportData, setReportData] = useState({ reason: '', description: '' });

    const handleReply = (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        onReply(comment._id, replyContent, replyAnonymous);
        setReplyContent('');
        setReplyAnonymous(false);
        setShowReplyForm(false);
        setShowReplies(true); // Show replies after adding one
    };

    const handleReport = (e) => {
        e.preventDefault();
        onReport(comment._id, reportData.reason, reportData.description);
        setShowReportModal(false);
        setReportData({ reason: '', description: '' });
    };

    const timeAgo = (date) => {
        const now = new Date();
        const commentDate = new Date(date);
        const diff = now - commentDate;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return commentDate.toLocaleDateString();
    };

    return (
        <div className="border-l-2 border-gray-200 pl-4 pb-4">
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {comment.isAnonymous ? '?' : comment.author?.name?.charAt(0)?.toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                    {/* Comment Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">
                                {comment.isAnonymous ? 'Anonymous' : comment.author?.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {timeAgo(comment.createdAt)}
                            </span>
                        </div>
                        
                        {/* Report Button */}
                        <button
                            onClick={() => setShowReportModal(true)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded"
                            title="Report comment"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Comment Content */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{comment.content}</p>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 text-xs">
                        <button
                            onClick={() => onLike(comment._id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
                                comment.isLiked 
                                    ? 'bg-red-50 text-red-600' 
                                    : 'hover:bg-gray-100 text-gray-500'
                            }`}
                        >
                            <svg className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {comment.likeCount || 0}
                        </button>
                        
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                        >
                            Reply
                        </button>
                        
                        {comment.replies && comment.replies.length > 0 && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                            </button>
                        )}
                    </div>
                    
                    {/* Reply Form */}
                    {showReplyForm && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <form onSubmit={handleReply}>
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Write a thoughtful reply..."
                                    className="w-full p-2 border border-gray-300 rounded text-sm h-16 resize-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <label className="flex items-center text-xs text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={replyAnonymous}
                                            onChange={(e) => setReplyAnonymous(e.target.checked)}
                                            className="mr-1 text-xs"
                                        />
                                        Reply anonymously
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowReplyForm(false)}
                                            className="text-gray-500 text-xs hover:text-gray-700 px-2 py-1"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                    
                    {/* Nested Replies */}
                    {showReplies && comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {comment.replies.map((reply) => (
                                <div key={reply._id} className="flex items-start gap-2 pl-4 border-l border-gray-100">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-300 to-green-300 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                        {reply.isAnonymous ? '?' : reply.author?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm text-gray-800">
                                                {reply.isAnonymous ? 'Anonymous' : reply.author?.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {timeAgo(reply.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-xs leading-relaxed mb-2">{reply.content}</p>
                                        
                                        {/* Reply Actions */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => onLike(reply._id)}
                                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                                                    reply.isLiked 
                                                        ? 'bg-red-50 text-red-600' 
                                                        : 'hover:bg-gray-100 text-gray-500'
                                                }`}
                                            >
                                                <svg className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                {reply.likeCount || 0}
                                            </button>
                                            
                                            <button
                                                onClick={() => onReport(reply._id, 'inappropriate_content', 'Inappropriate reply content')}
                                                className="text-gray-400 hover:text-red-500 text-xs"
                                                title="Report reply"
                                            >
                                                Report
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold mb-4">Report Comment</h3>
                        <form onSubmit={handleReport}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for reporting *
                                </label>
                                <select
                                    value={reportData.reason}
                                    onChange={(e) => setReportData({...reportData, reason: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select a reason</option>
                                    <option value="inappropriate_content">Inappropriate Content</option>
                                    <option value="harassment">Harassment or Bullying</option>
                                    <option value="spam">Spam</option>
                                    <option value="misinformation">Misinformation</option>
                                    <option value="hate_speech">Hate Speech</option>
                                    <option value="off_topic">Off Topic</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional details (optional)
                                </label>
                                <textarea
                                    value={reportData.description}
                                    onChange={(e) => setReportData({...reportData, description: e.target.value})}
                                    className="w-full p-3 border border-gray-300 rounded-lg h-20 resize-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Please provide more details about why you're reporting this comment..."
                                />
                            </div>
                            
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium"
                                >
                                    Submit Report
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReportModal(false)}
                                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostComments;