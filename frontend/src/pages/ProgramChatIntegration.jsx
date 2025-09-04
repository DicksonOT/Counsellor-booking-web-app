import React, { useState, useContext } from 'react';
import { MessageCircle, Users, X, Crown, Shield, Lock } from 'lucide-react';
import ChatRoom from '../components/ChatRoom';
import { AppContext } from '../context/AppContext';

const ProgramChatIntegration = ({ program, isEnrolled }) => {
  const { userData } = useContext(AppContext);
  const [showChat, setShowChat] = useState(false);
  
  const isCounsellor = userData?.role === 'counsellor';
  const isAdmin = userData?.role === 'admin';
  const hasAccess = isEnrolled || isCounsellor || isAdmin;

  if (!hasAccess) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-gray-400" />
          <MessageCircle className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-gray-600 text-sm">
          Enroll in this program to join the support group chat
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Chat Access Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Support Group Chat</h3>
              <p className="text-sm text-gray-600">
                Connect with fellow participants and get guidance
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            {showChat ? 'Close' : 'Join Chat'}
          </button>
        </div>

        {/* Chat Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 text-blue-700">
            <Users className="w-4 h-4" />
            <span>Peer Support</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700">
            <Crown className="w-4 h-4" />
            <span>Expert Moderation</span>
          </div>
          <div className="flex items-center gap-2 text-blue-700">
            <Shield className="w-4 h-4" />
            <span>Safe Environment</span>
          </div>
        </div>

        {/* User Role Badge */}
        {(isCounsellor || isAdmin) && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center gap-2">
              {isCounsellor && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Moderator Access
                </span>
              )}
              {isAdmin && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Admin Access
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat Interface Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl h-[80vh] bg-white rounded-2xl overflow-hidden shadow-xl">
            <ChatRoom 
              programId={program._id} 
              onClose={() => setShowChat(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramChatIntegration;