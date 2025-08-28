import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

// Badge Modal Component
const BadgeModal = ({ badge, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative animate-bounce-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>
        
        <div className="text-center">
          <div className="text-6xl mb-4">{badge.icon}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Badge Earned!</h3>
          <h4 className="text-lg font-semibold text-blue-600 mb-3">{badge.name}</h4>
          <p className="text-gray-600 mb-6">{badge.description}</p>
          <button 
            onClick={onClose}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};

// Badge Grid Component
const BadgeGrid = ({ badges, totalScore, nextBadgeAt }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);
  
  const progressToNext = nextBadgeAt ? ((totalScore % 50) / 50) * 100 : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Achievements</h3>
      
      {/* Progress to Next Badge */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Next Badge Progress</span>
          <span className="text-sm text-gray-500">{totalScore}/{nextBadgeAt} points</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressToNext}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {nextBadgeAt - totalScore} points until your next badge!
        </p>
      </div>
      
      {/* Badge Grid */}
      {badges.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              onClick={() => setSelectedBadge(badge)}
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-lg p-4 text-center cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-md"
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">
                {badge.name}
              </h4>
              <p className="text-xs text-gray-600">
                {new Date(badge.earnedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏆</div>
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Badges Yet</h4>
          <p className="text-gray-500 text-sm">
            Start your wellness journey to earn your first badge at 100 points!
          </p>
        </div>
      )}
      
      {/* Badge Details Modal */}
      <BadgeModal 
        badge={selectedBadge}
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  );
};

// New Badge Notification Component
const NewBadgeNotification = ({ badges, onClose }) => {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  
  useEffect(() => {
    if (badges.length === 0) return;
    
    // Auto close after showing all badges
    const timer = setTimeout(() => {
      if (currentBadgeIndex < badges.length - 1) {
        setCurrentBadgeIndex(currentBadgeIndex + 1);
      } else {
        onClose();
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [currentBadgeIndex, badges.length, onClose]);

  if (!badges || badges.length === 0) return null;

  const currentBadge = badges[currentBadgeIndex];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4 shadow-xl max-w-sm">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{currentBadge.icon}</div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">New Badge Earned!</h4>
            <p className="text-xs opacity-90">{currentBadge.name}</p>
            {badges.length > 1 && (
              <p className="text-xs opacity-75 mt-1">
                {currentBadgeIndex + 1} of {badges.length}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center text-sm"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component - Integrate into existing progress component
const UserAssessmentProgress = () => {
  const { userData, fetchAssessment, assessment, token, backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [selectedSources, setSelectedSources] = useState([]);
  const [badges, setBadges] = useState([]);
  const [newBadges, setNewBadges] = useState([]);
  const [showBadges, setShowBadges] = useState(false);

  // Fetch badges
  const fetchBadges = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user/badges`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBadges(data.badges || []);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  // Listen for new badges from other actions
  const checkForNewBadges = async () => {
    // This would be called after any action that might award badges
    await fetchBadges();
  };

  // Show new badge notification
  const showNewBadgeNotification = (newBadgesList) => {
    if (newBadgesList && newBadgesList.length > 0) {
      setNewBadges(newBadgesList);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      fetchAssessment();
      fetchBadges();
      setLoading(false);
    }
  }, [userData]);

  const filteredScoreHistory = assessment?.scoreHistory || [];
  const totalScore = assessment?.totalScore || assessment?.wellnessPoints || 0;
  const nextBadgeAt = Math.ceil(totalScore / 50) * 50;

  if (loading) {
    return (
      <div className="w-full h-full p-6 border border-gray-300 rounded-xl bg-white shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your wellness progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Badge Notification */}
      <NewBadgeNotification 
        badges={newBadges}
        onClose={() => setNewBadges([])}
      />
      
      {/* Main Progress Component */}
      <div className="w-full p-6 border border-gray-300 rounded-xl bg-white shadow-lg">
        {/* Header with Badge Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Mental Wellness Progress
            </h2>
            <p className="text-gray-600">Track your journey towards better mental health</p>
          </div>
          <button
            onClick={() => setShowBadges(!showBadges)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            🏆 {badges.length} Badges
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-left">
              <p className="text-3xl font-bold text-gray-800">{totalScore}</p>
              <p className="text-sm text-gray-500">Total Points</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-green-600">
                {totalScore >= 80 ? 'Excellent' : 
                 totalScore >= 60 ? 'Good' : 
                 totalScore >= 40 ? 'Fair' : 
                 totalScore >= 20 ? 'Needs Attention' : 'Getting Started'}
              </p>
              <p className="text-sm text-gray-500">Wellness Level</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
            <div
              className="h-4 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden"
              style={{ width: `${Math.min((totalScore / 100) * 100, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{filteredScoreHistory.length}</p>
            <p className="text-sm text-blue-800">Total Activities</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200">
            <p className="text-2xl font-bold text-green-600">{badges.length}</p>
            <p className="text-sm text-green-800">Badges Earned</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center border border-purple-200">
            <p className="text-2xl font-bold text-purple-600">{nextBadgeAt - totalScore}</p>
            <p className="text-sm text-purple-800">Points to Next Badge</p>
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Keep Going! 🌟</h4>
            <p className="text-blue-100 text-sm">
              Consistency is key to mental wellness. Every activity brings you closer to your goals!
            </p>
          </div>
        </div>
      </div>

      {/* Badge Section */}
      {showBadges && (
        <BadgeGrid 
          badges={badges} 
          totalScore={totalScore}
          nextBadgeAt={nextBadgeAt}
        />
      )}
    </div>
  );
};

export default UserAssessmentProgress;