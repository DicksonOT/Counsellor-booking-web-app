import React, { useState } from 'react';
import CommunityPosts from '../components/UserCommunityPosts';
import Communities from '../components/ UserCommunities';
import WellnessActivities from '../components/WellnessActivities';
import Progress from '../components/Progress';


const CommunitiesPage = () => {
    const [activeTab, setActiveTab] = useState('communities');
    const [selectedCommunity, setSelectedCommunity] = useState(null);

    const renderContent = () => {
        switch (activeTab) {
            case 'communities':
                return <Communities onSelectCommunity={setSelectedCommunity} />;
            case 'activities':
                return <WellnessActivities />;
            case 'progress':
                return <Progress />;
            default:
                return <Communities />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Your Wellness Dashboard</h1>
                    <p className="text-gray-600">Connect, grow, and track your mental health journey</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {[
                        { key: 'communities', label: 'Communities', icon: '👥' },
                        { key: 'activities', label: 'Wellness Activities', icon: '🧘' },
                        { key: 'progress', label: 'My Progress', icon: '📊' }
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                                activeTab === tab.key
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {selectedCommunity && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-800">
                                Selected Community: <strong>{selectedCommunity.name}</strong>
                            </span>
                            <button
                                onClick={() => setSelectedCommunity(null)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                                Clear Selection
                            </button>
                        </div>
                    </div>
                )}

                {renderContent()}
            </div>
        </div>
    );
};

export default CommunitiesPage;
