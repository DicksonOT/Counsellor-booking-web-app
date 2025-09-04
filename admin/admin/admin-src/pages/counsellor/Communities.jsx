import React from 'react';
import { useState } from 'react';
import ActivityManager from './ActivityManager';
import Reports from './Reports';

const Communities = () => {
    const [activeTab, setActiveTab] = useState('activities');

    return (
        <div className="min-h-screen bg-blue-50">
            <div className="container mx-auto py-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-blue-600">Counsellor Dashboard</h1>
                    <p className="text-gray-600">Manage wellness activities and review community content</p>
                </div>

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('activities')}
                        className={`px-6 py-2 rounded-lg font-medium ${
                            activeTab === 'activities' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Activity Management
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`px-6 py-2 rounded-lg font-medium ${
                            activeTab === 'reports' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Content Reports
                    </button>
                </div>

                {activeTab === 'activities' && <ActivityManager />}
                {activeTab === 'reports' && <Reports />}
            </div>
        </div>
    );
};

export default Communities;

