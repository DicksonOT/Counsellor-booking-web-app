import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Send, 
  ArrowLeft, 
  Users, 
  Shield, 
  MoreVertical, 
  Smile,
  Phone,
  Video,
  Info,
  UserCheck,
  Clock,
  Heart,
  Star,
  AlertCircle,
  Loader,
  CheckCircle2,
  Paperclip,
  Reply,
  X,
  Menu
} from 'lucide-react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const ProgramChatRoom = () => {
  const { programId } = useParams();
  const { backendUrl, token, userData} = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [program, setProgram] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false); // Default false for mobile
  const [onlineUsers, setOnlineUsers] = useState(new Set()); 
  const [typing, setTyping] = useState(new Set());
  const [connected, setConnected] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const replyInputRef = useRef(null);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Configure axios defaults
  const axiosConfig = {
    headers: {
      'token': token,
      'Content-Type': 'application/json'
    }
  };

  const formatMessage = (msg) => {
    const messageId = msg._id || msg.id || `temp-${Date.now()}`;
    const userId = msg.user?._id || msg.user?.id || msg.sender?._id || msg.sender?.id || msg.senderId;
    const userName = msg.user?.name || msg.user?.username || msg.sender?.name || msg.senderName || 'Unknown User';
    const userRole = msg.user?.role || msg.sender?.role || msg.senderRole || 'participant';
    const userAvatar = msg.user?.avatar || msg.sender?.avatar || msg.user?.profileImage;
    const content = msg.content || msg.message || '';
    const timestamp = msg.timestamp || msg.createdAt || msg.created_at || Date.now();
    const messageType = msg.messageType || msg.type || 'text';

    return {
      _id: messageId,
      user: {
        _id: userId,
        name: userName,
        role: userRole,
        avatar: userAvatar
      },
      content: content,
      timestamp: new Date(timestamp),
      type: messageType,
      isEdited: msg.isEdited || false,
      reactions: msg.reactions || [],
      replyTo: msg.replyTo ? {
        _id: msg.replyTo._id || msg.replyTo.id,
        content: msg.replyTo.content || msg.replyTo.message || '',
        user: {
          name: msg.replyTo.user?.name || msg.replyTo.sender?.name || 'Unknown User'
        }
      } : null
    };
  };

  // Group messages by date and consecutive sender
  const groupMessages = (messages) => {
    const groups = [];
    let currentGroup = null;
    let currentDate = null;

    messages.forEach((message) => {
      const messageDate = new Date(message.timestamp);
      const messageDateString = messageDate.toDateString();
      
      if (messageDateString !== currentDate) {
        currentDate = messageDateString;
        groups.push({
          type: 'date',
          date: messageDate,
          id: `date-${messageDateString}`
        });
        currentGroup = null;
      }

      const shouldGroup = currentGroup && 
        currentGroup.sender._id === message.user._id &&
        (messageDate - currentGroup.lastMessageTime) < 5 * 60 * 1000 &&
        !message.replyTo;

      if (shouldGroup) {
        currentGroup.messages.push(message);
        currentGroup.lastMessageTime = messageDate;
      } else {
        currentGroup = {
          type: 'messages',
          sender: message.user,
          messages: [message],
          firstMessageTime: messageDate,
          lastMessageTime: messageDate,
          id: `group-${message._id}`
        };
        groups.push(currentGroup);
      }
    });

    return groups;
  };

  const fetchChatRoom = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${backendUrl}/api/user/${programId}`, axiosConfig);
      
      if (response.data.success) {
        setProgram(response.data.program || response.data.chatRoom?.program);
        
        if (response.data.messages && Array.isArray(response.data.messages)) {
          setMessages(response.data.messages.map(formatMessage));
        } else if (response.data.chatRoom?.messages && Array.isArray(response.data.chatRoom.messages)) {
          setMessages(response.data.chatRoom.messages.map(formatMessage));
        }
        
        setConnected(true);
      } else {
        throw new Error(response.data.message || 'Failed to load chat room');
      }
    } catch (error) {
      console.error('Error fetching chat room:', error);
      
      if (error.response) {
        if (error.response.status === 404) {
          setError('Chat room not found for this program');
        } else if (error.response.status === 403) {
          setError('You do not have access to this chat room');
        } else {
          setError(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        setError('Network error - please check your connection');
        setConnected(false);
      } else {
        setError(error.message || 'Failed to connect to chat room');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/program/${programId}/participants`, axiosConfig);
      
      if (response.data.success) {
        const participants = response.data.participants || [];
        const counselors = response.data.counselors || [];
        
        setParticipants(participants);
        setCounselors(counselors);
        
        if (response.data.stats && response.data.stats.onlineUsers) {
          setOnlineUsers(new Set(response.data.stats.onlineUsers));
        }
      } else {
        console.error('API returned success: false', response.data.message);
        setParticipants([]);
        setCounselors([]);
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      
      try {
        const programResponse = await axios.get(`${backendUrl}/api/user/${programId}`, axiosConfig);
        
        if (programResponse.data.success && programResponse.data.program) {
          const program = programResponse.data.program;
          const fallbackCounselors = [];
          
          if (program.assignedCounselor) {
            fallbackCounselors.push({
              _id: program.assignedCounselor._id,
              name: program.assignedCounselor.name,
              role: 'counselor',
              avatar: program.assignedCounselor.avatar,
              online: false,
              source: 'assigned_counselor'
            });
          }
          
          if (program.assignedModerator) {
            fallbackCounselors.push({
              _id: program.assignedModerator._id,
              name: program.assignedModerator.name,
              role: 'moderator',
              avatar: program.assignedModerator.avatar,
              online: false,
              source: 'assigned_moderator'
            });
          }
          
          setCounselors(fallbackCounselors);
        }
      } catch (fallbackError) {
        console.error('Fallback request also failed:', fallbackError);
      }
      
      setParticipants([]);
      if (counselors.length === 0) {
        setCounselors([]);
      }
    }
  };

  const fetchCurrentUser = async () => {
    try {
      if (userData) {
        setCurrentUser(userData);
        return;
      }
      
      const response = await axios.get(`${backendUrl}/api/user/info`, axiosConfig);
      
      if (response.data.success) {
        setCurrentUser(response.data.userData || response.data.user);
      } else {
        throw new Error(response.data.message || 'Failed to fetch user info');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setError('Failed to load user information');
    }
  };

  const fetchChatHistory = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await axios.get(
        `${backendUrl}/api/user/program/${programId}/messages?page=${pageNum}&limit=50`,
        {
          ...axiosConfig,
          timeout: 20000
        }
      );
      
      if (response.data.success) {
        const formattedMessages = response.data.messages?.map(formatMessage) || [];
        
        if (append) {
          setMessages(prev => [...formattedMessages, ...prev]);
        } else {
          setMessages(formattedMessages);
        }
        
        setHasMore(response.data.hasMore || false);
        setPage(pageNum);
      } else {
        throw new Error(response.data.message || 'Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      
      if (pageNum === 1) {
        let errorMessage = 'Failed to load chat history';
        
        if (error.response) {
          const status = error.response.status;
          if (status === 404) {
            errorMessage = 'Chat history not found';
          } else if (status === 403) {
            errorMessage = 'Access denied to chat history';
          } else if (status === 500) {
            errorMessage = 'Server error loading messages';
          }
        } else if (error.request) {
          errorMessage = 'Network error loading messages';
          setConnected(false);
        }
        
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending || !currentUser) return;

    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;
    
    setNewMessage('');
    setSending(true);

    const optimisticMessage = {
      _id: tempId,
      user: {
        _id: currentUser._id || currentUser.id,
        name: currentUser.name || currentUser.username || 'You',
        role: currentUser.role || 'participant',
        avatar: currentUser.image || currentUser.profileImage || currentUser.avatar
      },
      content: messageContent,
      timestamp: new Date(),
      type: 'text',
      sending: true,
      replyTo: replyingTo ? {
        _id: replyingTo._id,
        content: replyingTo.content,
        user: {
          name: replyingTo.user.name
        }
      } : null
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    scrollToBottom();

    const currentReply = replyingTo;
    setReplyingTo(null);

    try {
      const payload = {
        content: messageContent,
        messageType: 'text'
      };

      if (currentReply) {
        payload.replyTo = currentReply._id;
      }

      const response = await axios.post(
        `${backendUrl}/api/user/program/${programId}/send`,
        payload,
        axiosConfig
      );

      if (response.data.success && response.data.message) {
        setMessages(prev => 
          prev.map(msg => 
            msg._id === tempId 
              ? formatMessage(response.data.message)
              : msg
          )
        );
        setConnected(true);
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      setReplyingTo(currentReply);
      
      if (error.response) {
        const status = error.response.status;
        let errorMessage = 'Failed to send message';
        
        if (status === 403) {
          errorMessage = 'You do not have permission to send messages';
        } else if (status === 429) {
          errorMessage = 'You are sending messages too quickly. Please wait a moment.';
        } else if (status === 400) {
          errorMessage = 'Invalid message content';
        }
        
        setError(errorMessage);
      } else if (error.request) {
        setError('Network error - message not sent');
        setConnected(false);
      } else {
        setError(`Failed to send message: ${error.message}`);
      }
      
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  const handleReply = (message) => {
    setReplyingTo({
      _id: message._id,
      content: message.content,
      user: {
        name: message.user.name
      }
    });
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Load initial data
  useEffect(() => {
    if (!backendUrl || !token) {
      setError('Backend URL and token are required');
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        if (userData) {
          setCurrentUser(userData);
        } else {
          await fetchCurrentUser();
        }
        
        await Promise.all([
          fetchChatRoom(),
          fetchParticipants(),
          fetchChatHistory(1)
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
        if (!error) {
          setError('Failed to load chat room data');
        }
      }
    };

    loadData();
  }, [programId, backendUrl, token, userData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      
      if (scrollTop === 0 && hasMore && !loadingMore) {
        fetchChatHistory(page + 1, true);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape') {
      if (replyingTo) {
        cancelReply();
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDateSeparator = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const isOnline = (userId) => {
    if (!userId) return false;
    return onlineUsers.has(userId.toString());
  };

  const isCounselor = (userRole) => {
    if (!userRole) return false;
    return ['counselor', 'admin', 'moderator'].includes(userRole.toLowerCase());
  };

  const isCurrentUser = (userId) => {
    if (!userId || !currentUser) return false;
    const currentUserId = currentUser._id || currentUser.id;
    return userId.toString() === currentUserId.toString();
  };

  const truncateContent = (content, maxLength = 50) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Check if user is authenticated
  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4 text-lg">Please log in to access the chat room</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading chat room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4 text-center">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={() => window.history.back()}
              className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessages(messages);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col mt-30">
      {/* Mobile-First Header */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-blue-600 truncate">
              {program?.title || program?.name || 'Chat Room'}
            </h1>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{participants.length + counselors.length} members</span>
              {counselors.length > 0 && !isMobile && (
                <>
                  <span className="mx-1">•</span>
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                  <span>{counselors.length} counselor{counselors.length !== 1 ? 's' : ''}</span>
                </>
              )}
              {!isMobile && (
                <>
                  <span className="mx-1">•</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>{connected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button 
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-2 rounded-lg transition-colors ${showParticipants ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
          >
            {isMobile ? <Menu className="w-5 h-5" /> : <Users className="w-5 h-5" />}
          </button>
          {!isMobile && (
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Messages Container */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2"
            style={{ backgroundColor: '#f0f2f5' }}
          >
            {/* Load more indicator */}
            {loadingMore && (
              <div className="flex justify-center py-2">
                <Loader className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            )}

            {/* Welcome Message */}
            {messageGroups.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-6 mx-auto max-w-sm sm:max-w-md">
                <div className="flex items-center gap-2 mb-2 justify-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span className="font-medium text-blue-900 text-sm sm:text-base">Welcome to the Support Group</span>
                </div>
                <p className="text-blue-800 text-xs sm:text-sm text-center">
                  This is a safe, moderated space. Please be respectful, supportive, and maintain confidentiality.
                </p>
              </div>
            ) : null}

            {/* Message Groups */}
            {messageGroups.map((group) => {
              if (group.type === 'date') {
                return (
                  <div key={group.id} className="flex justify-center my-4">
                    <div className="bg-white bg-opacity-90 px-2 sm:px-3 py-1 rounded-lg shadow-sm">
                      <span className="text-xs font-medium text-gray-600">
                        {formatDateSeparator(group.date)}
                      </span>
                    </div>
                  </div>
                );
              }

              const isOwn = isCurrentUser(group.sender._id);
              const isCounselorMsg = isCounselor(group.sender.role);

              return (
                <div key={group.id} className={`flex gap-2 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar - smaller on mobile */}
                  {!isOwn && (
                    <div className="relative flex-shrink-0 self-end">
                      <img
                        src={group.sender.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.sender.name)}&background=3b82f6&color=fff`}
                        alt={group.sender.name}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(group.sender.name)}&background=3b82f6&color=fff`;
                        }}
                      />
                      {isOnline(group.sender._id) && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                      {isCounselorMsg && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <Shield className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[85%] sm:max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
                    {/* Sender name */}
                    {!isOwn && (
                      <div className="mb-1 px-2 sm:px-3">
                        <span className={`text-xs font-medium ${
                          isCounselorMsg ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {group.sender.name}
                          {isCounselorMsg && (
                            <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                              {group.sender.role === 'admin' ? 'Admin' : group.sender.role === 'moderator' ? 'Mod' : 'Counselor'}
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Messages in group */}
                    {group.messages.map((message, index) => (
                      <div
                        key={message._id}
                        className={`relative group ${isOwn ? 'self-end' : 'self-start'}`}
                        onMouseEnter={() => setHoveredMessage(message._id)}
                        onMouseLeave={() => setHoveredMessage(null)}
                      >
                        {/* Reply button - hidden on mobile touch */}
                        {hoveredMessage === message._id && !message.sending && !isMobile && (
                          <button
                            onClick={() => handleReply(message)}
                            className={`absolute top-1 ${isOwn ? '-left-6 sm:-left-8' : '-right-6 sm:-right-8'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 bg-white rounded-full shadow-md hover:shadow-lg z-10`}
                            title="Reply to this message"
                          >
                            <Reply className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                          </button>
                        )}

                        {/* Long press for mobile reply */}
                        <div
                          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg mb-1 shadow-sm max-w-full ${
                            isOwn
                              ? 'bg-blue-500 text-white rounded-br-sm'
                              : isCounselorMsg
                              ? 'bg-blue-50 border border-blue-200 text-gray-800 rounded-bl-sm'
                              : 'bg-white text-gray-800 rounded-bl-sm'
                          } ${
                            index === 0 && isOwn ? 'rounded-tr-lg' : 
                            index === 0 && !isOwn ? 'rounded-tl-lg' :
                            index === group.messages.length - 1 && isOwn ? 'rounded-br-lg' :
                            index === group.messages.length - 1 && !isOwn ? 'rounded-bl-lg' : ''
                          }`}
                          onTouchStart={isMobile ? () => {
                            const timer = setTimeout(() => handleReply(message), 500);
                            const cleanup = () => clearTimeout(timer);
                            document.addEventListener('touchend', cleanup, { once: true });
                            document.addEventListener('touchcancel', cleanup, { once: true });
                          } : undefined}
                        >
                          {/* Reply preview */}
                          {message.replyTo && (
                            <div className={`mb-2 p-1.5 sm:p-2 rounded border-l-4 ${
                              isOwn 
                                ? 'bg-blue-600 border-blue-300' 
                                : 'bg-gray-100 border-gray-300'
                            }`}>
                              <div className={`text-xs font-medium mb-1 ${
                                isOwn ? 'text-blue-200' : 'text-blue-600'
                              }`}>
                                {message.replyTo.user.name}
                              </div>
                              <div className={`text-xs ${
                                isOwn ? 'text-blue-100' : 'text-gray-600'
                              }`}>
                                {truncateContent(message.replyTo.content, isMobile ? 30 : 50)}
                              </div>
                            </div>
                          )}

                          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {message.content}
                          </p>
                          
                          {/* Show timestamp on last message of group */}
                          {index === group.messages.length - 1 && (
                            <div className={`flex items-center justify-end gap-1 mt-1 ${
                              isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              <span className="text-xs">
                                {formatTime(message.timestamp)}
                              </span>
                              {message.sending && (
                                <Loader className="w-3 h-3 animate-spin" />
                              )}
                              {isOwn && !message.sending && (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicators */}
            {typing.size > 0 && (
              <div className="flex items-center gap-2 px-2 sm:px-4 py-2">
                <div className="bg-white rounded-lg px-2 sm:px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Array.from(typing).slice(0, 2).join(', ')} 
                      {typing.size > 2 && ` and ${typing.size - 2} others`} typing...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Reply Bar - Mobile Optimized */}
          {replyingTo && (
            <div className="bg-blue-50 border-t border-blue-200 px-3 sm:px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Reply className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-blue-600 truncate">
                      Replying to {replyingTo.user.name}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {truncateContent(replyingTo.content, isMobile ? 40 : 60)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={cancelReply}
                  className="p-1 hover:bg-blue-200 rounded-full transition-colors flex-shrink-0 ml-2"
                >
                  <X className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          )}

          {/* Message Input - Mobile Optimized */}
          <div className="bg-white border-t border-gray-200 p-2 sm:p-4 pb-safe">
            <div className="flex items-end gap-2 sm:gap-3">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={replyingTo ? `Reply to ${replyingTo.user.name}...` : "Type a message..."}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    rows="1"
                    disabled={sending || !connected || !currentUser}
                    maxLength={1000}
                    style={{ minHeight: '40px', maxHeight: '100px' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                  <div className="absolute bottom-1 right-1 text-xs text-gray-400">
                    {newMessage.length}/1000
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending || !connected || !currentUser}
                className="p-2 sm:p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full transition-all duration-200 hover:transform hover:scale-105 disabled:transform-none flex items-center justify-center flex-shrink-0"
              >
                {sending ? (
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
            
            {/* Keyboard shortcuts hint - Hidden on mobile */}
            {replyingTo && !isMobile && (
              <div className="mt-2 text-xs text-gray-500">
                Press Escape to cancel reply • Enter to send
              </div>
            )}
            
            {/* Mobile hint */}
            {isMobile && (
              <div className="mt-2 text-xs text-gray-500 text-center">
                Long press a message to reply
              </div>
            )}
          </div>
        </div>

        {/* Participants Sidebar - Mobile Overlay */}
        {showParticipants && (
          <>
            {/* Mobile Overlay Background */}
            {isMobile && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-20"
                onClick={() => setShowParticipants(false)}
              />
            )}
            
            <div className={`${
              isMobile 
                ? 'fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-30 transform transition-transform duration-300'
                : 'w-80 relative'
            } bg-white border-l border-gray-200 flex flex-col`}>
              <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Chat Members</h3>
                  <p className="text-sm text-gray-600">
                    {participants.length + counselors.length} total members
                  </p>
                </div>
                {isMobile && (
                  <button
                    onClick={() => setShowParticipants(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Counselors */}
                {counselors.length > 0 && (
                  <div className="p-3 sm:p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      Counselors & Moderators ({counselors.length})
                    </h4>
                    <div className="space-y-2">
                      {counselors.map((counselor) => (
                        <div key={counselor._id || counselor.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 bg-blue-50 border border-blue-100">
                          <div className="relative">
                            <img
                              src={counselor.avatar || counselor.profileImage || counselor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(counselor.name || counselor.username)}&background=3b82f6&color=fff`}
                              alt={counselor.name || counselor.username}
                              className="w-8 h-8 rounded-full object-cover border-2 border-blue-300"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(counselor.name || counselor.username)}&background=3b82f6&color=fff`;
                              }}
                            />
                            {isOnline(counselor._id || counselor.id) && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <Shield className="w-2.5 h-2.5 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {counselor.name || counselor.username}
                              {isCurrentUser(counselor._id || counselor.id) && ' (You)'}
                            </p>
                            <p className="text-xs text-blue-500 truncate">
                              {counselor.role === 'admin' ? 'Administrator' : 
                               counselor.role === 'moderator' ? 'Moderator' : 
                               'Licensed Counselor'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {isOnline(counselor._id || counselor.id) ? (
                              <UserCheck className="w-3 h-3 text-green-500" />
                            ) : (
                              <Clock className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Counselors Message */}
                {counselors.length === 0 && (
                  <div className="p-3 sm:p-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">No Moderators Online</span>
                      </div>
                      <p className="text-xs text-yellow-700">
                        No counselors or moderators are currently assigned to this chat room.
                      </p>
                    </div>
                  </div>
                )}

                {/* Participants */}
                <div className="p-3 sm:p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    Participants ({participants.length})
                  </h4>
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant._id || participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <div className="relative">
                          <img
                            src={participant.avatar || participant.profileImage || participant.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name || participant.username)}&background=6b7280&color=fff`}
                            alt={participant.name || participant.username}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name || participant.username)}&background=6b7280&color=fff`;
                            }}
                          />
                          {isOnline(participant._id || participant.id) && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isCurrentUser(participant._id || participant.id) ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {isCurrentUser(participant._id || participant.id) ? 'You' : (participant.name || participant.username)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isOnline(participant._id || participant.id) ? 'Online' : 'Offline'}
                          </p>
                        </div>
                        {isCurrentUser(participant._id || participant.id) && (
                          <div className="text-blue-500">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* No Participants Message */}
                  {participants.length === 0 && (
                    <div className="text-center py-4">
                      <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No other participants yet</p>
                      <p className="text-xs text-gray-400">Be the first to start the conversation!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Info & Rules */}
              <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Chat Guidelines</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Be respectful and supportive</li>
                  <li>• Maintain confidentiality</li>
                  <li>• No medical advice</li>
                  <li>• Listen actively to others</li>
                  <li>• Report inappropriate behavior</li>
                </ul>
                
                {counselors.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield className="w-3 h-3" />
                      <span>Moderated by licensed counselors</span>
                    </div>
                  </div>
                )}
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    <strong>{isMobile ? 'Reply:' : 'Reply Feature:'}</strong> {isMobile ? 'Long press any message to reply' : 'Hover over any message and click the reply button to respond to specific messages.'}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Connection Status */}
      {!connected && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg flex items-center gap-2 z-50 max-w-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">Connection lost - trying to reconnect...</span>
        </div>
      )}

      {/* PWA-style bottom padding for mobile devices */}
      <div className="h-safe-area-inset-bottom"></div>
    </div>
  );
};

export default ProgramChatRoom;