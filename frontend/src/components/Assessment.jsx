import React, { useEffect, useState, useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';


// Constants for wellness levels
const WELLNESS_LEVELS = {
  EXCELLENT: { min: 80, max: 100, label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-600', bgColor: 'bg-green-50' },
  GOOD: { min: 60, max: 79, label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
  FAIR: { min: 40, max: 59, label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  NEEDS_ATTENTION: { min: 20, max: 39, label: 'Needs Attention', color: 'bg-orange-500', textColor: 'text-orange-600', bgColor: 'bg-orange-50' },
  POOR: { min: 0, max: 19, label: 'Poor', color: 'bg-red-500', textColor: 'text-red-600', bgColor: 'bg-red-50' }
};

const MAX_SCORE = 100; // Maximum possible score for the progress bar

// Helper function to get wellness level based on score
const getWellnessLevel = (score) => {
  if (score >= WELLNESS_LEVELS.EXCELLENT.min) return WELLNESS_LEVELS.EXCELLENT;
  if (score >= WELLNESS_LEVELS.GOOD.min) return WELLNESS_LEVELS.GOOD;
  if (score >= WELLNESS_LEVELS.FAIR.min) return WELLNESS_LEVELS.FAIR;
  if (score >= WELLNESS_LEVELS.NEEDS_ATTENTION.min) return WELLNESS_LEVELS.NEEDS_ATTENTION;
  return WELLNESS_LEVELS.POOR;
};

// Progress Bar Component
const ProgressBar = ({ score, maxScore = MAX_SCORE }) => {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const wellnessLevel = getWellnessLevel(score);
  
  return (
    <div className="mb-6">
      {/* Score Display */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-left">
          <p className="text-3xl font-bold text-gray-800">{score}</p>
          <p className="text-sm text-gray-500">Total Points</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-semibold ${wellnessLevel.textColor}`}>
            {wellnessLevel.label}
          </p>
          <p className="text-sm text-gray-500">Wellness Level</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
          <div
            className={`h-4 rounded-full transition-all duration-1000 ease-out ${wellnessLevel.color} relative overflow-hidden`}
            style={{ width: `${percentage}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>
        
        {/* Progress markers */}
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>0</span>
          <span>20</span>
          <span>40</span>
          <span>60</span>
          <span>80</span>
          <span>{maxScore}</span>
        </div>
      </div>
      
      {/* Wellness Level Indicators */}
      <div className="mt-4 grid grid-cols-5 gap-1">
        {Object.values(WELLNESS_LEVELS).map((level, index) => (
          <div
            key={index}
            className={`text-center p-2 rounded-lg transition-all duration-300 ${
              score >= level.min && score <= level.max 
                ? `${level.bgColor} ${level.textColor} border-2 border-current transform scale-105` 
                : 'bg-gray-50 text-gray-400'
            }`}
          >
            <div className={`h-2 w-full rounded-full mb-1 ${
              score >= level.min && score <= level.max ? level.color : 'bg-gray-200'
            }`}></div>
            <p className="text-xs font-medium">{level.label}</p>
          </div>
        ))}
      </div>
      
      {/* Motivational Message */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {score < 20 && "Every journey starts with a single step. Keep going!"}
          {score >= 20 && score < 40 && "You're making progress! Keep up the good work."}
          {score >= 40 && score < 60 && "Great momentum! You're on the right track."}
          {score >= 60 && score < 80 && "Excellent progress! You're doing really well."}
          {score >= 80 && "Outstanding! You're excelling in your wellness journey!"}
        </p>
      </div>
    </div>
  );
};

// Score History Item Component
const ScoreHistoryItem = ({ entry }) => {
  const getSourceIcon = (source) => {
    switch (source?.toLowerCase()) {
      case 'chatbotvisit':
        return '🤖';
      case 'manual':
        return '✍️';
      case 'appointment':
        return '📅';
      case 'assessment':
        return '📝';
      case 'activity':
        return '🏃';
      default:
        return '⭐';
    }
  };

  const getSourceColor = (source) => {
    switch (source?.toLowerCase()) {
      case 'chatbotvisit':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'manual':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'appointment':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'assessment':
        return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'activity':
        return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <li className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${getSourceColor(entry.source)}`}>
          <span className="text-lg">{getSourceIcon(entry.source)}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-green-600">+{entry.score}</span>
            <span className="text-sm text-gray-600">points from</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${getSourceColor(entry.source)}`}>
              {entry.source}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            {new Date(entry.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </li>
  );
};

// Main Component
const UserAssessmentProgress = () => {
  const { userData, fetchAssessment, assessment} = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  // Calculate additional statistics
  const statistics = useMemo(() => {
    if (!assessment?.scoreHistory) return null;
    
    const history = assessment.scoreHistory;
    const totalActivities = history.length;
    const averageScore = totalActivities > 0 ? (history.reduce((sum, entry) => sum + entry.score, 0) / totalActivities).toFixed(1) : 0;
    
    // Recent activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentActivities = history.filter(entry => new Date(entry.date) > weekAgo).length;
    
    return { totalActivities, averageScore, recentActivities };
  }, [assessment]);

  useEffect(() => {
    if (userData?._id) {
      fetchAssessment();
      setLoading(false)
    }
  }, [userData]);

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

  if (!assessment) {
    return (
      <div className="w-full h-full p-6 border border-gray-300 rounded-xl bg-white shadow-lg">
        <div className="text-center py-12">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <p className="text-gray-600 text-lg mb-2">No assessment data found</p>
            <p className="text-gray-500 text-sm">Start your wellness journey to see your progress here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 border border-gray-300 rounded-xl bg-white shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Mental Wellness Progress
        </h2>
        <p className="text-gray-600">Track your journey towards better mental health</p>
      </div>

      {/* Progress Bar Section */}
      <div className="mb-8">
        <ProgressBar score={assessment.totalScore} />
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{statistics.totalActivities}</p>
            <p className="text-sm text-blue-800">Total Activities</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200">
            <p className="text-2xl font-bold text-green-600">{statistics.averageScore}</p>
            <p className="text-sm text-green-800">Average Points</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center border border-purple-200">
            <p className="text-2xl font-bold text-purple-600">{statistics.recentActivities}</p>
            <p className="text-sm text-purple-800">This Week</p>
          </div>
        </div>
      )}

      {/* Score History */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Activity History</h3>
          <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
            {assessment.scoreHistory?.length || 0} activities
          </span>
        </div>
        
        {assessment.scoreHistory && assessment.scoreHistory.length > 0 ? (
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {assessment.scoreHistory.slice().reverse().map((entry, index) => (
              <ScoreHistoryItem key={index} entry={entry} index={index} />
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No activity history yet</p>
            <p className="text-sm text-gray-400">Complete activities to see your progress here</p>
          </div>
        )}
      </div>

      {/* Motivational Footer */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">Keep Going! 🌟</h4>
          <p className="text-blue-100 text-sm">
            Consistency is key to mental wellness. Every activity brings you closer to your goals!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAssessmentProgress;