import React, { useState, useEffect, useContext } from 'react';
import { CounsellorContext } from '../../context/CounsellorContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ActivityManager = () => {
    const { cToken, backendUrl } = useContext(CounsellorContext);
    const [activities, setActivities] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showParticipants, setShowParticipants] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [completions, setCompletions] = useState([]);
    const [useTemplate, setUseTemplate] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        activityType: 'meditation',
        duration: '',
        difficulty: 'beginner',
        instructions: [''],
        resources: [''],
        startDate: '',
        endDate: ''
    });

    // Activity type configurations
    const activityTypeConfig = {
        meditation: {
            name: 'Guided Meditation',
            icon: '🧘‍♂️',
            color: 'bg-blue-100 text-blue-800',
            description: 'Mindfulness and meditation exercises',
            maxDuration: 60
        },
        exercise: {
            name: 'Physical Exercise',
            icon: '🏃‍♂️',
            color: 'bg-blue-100 text-blue-800',
            description: 'Physical activities for wellbeing',
            maxDuration: 90
        },
        journaling: {
            name: 'Therapeutic Journaling',
            icon: '📝',
            color: 'bg-blue-100 text-blue-800',
            description: 'Writing exercises for self-reflection',
            maxDuration: 45
        },
        daily_reflection: {
            name: 'Daily Reflection',
            icon: '🤔',
            color: 'bg-blue-100 text-blue-800',
            description: 'Structured daily reflection practice',
            maxDuration: 30
        },
        mood_checking: {
            name: 'Mood Check-in',
            icon: '😊',
            color: 'bg-blue-100 text-blue-800',
            description: 'Track and understand emotions',
            maxDuration: 20
        },
        challenge: {
            name: 'Wellness Challenge',
            icon: '🎯',
            color: 'bg-blue-100 text-blue-800',
            description: 'Short-term wellness challenges',
            maxDuration: 120
        }
    };

    // Fetch activities
    const fetchActivities = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/counsellor/wellness/activities`, {
                headers: { cToken }
            });
            
            if (data.success) {
                setActivities(data.activities || []);
            } else {
                toast.error(data.message || 'Failed to fetch activities');
            }
        } catch (error) {
            console.error('Fetch activities error:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch activities');
        } finally {
            setLoading(false);
        }
    };

    // Fetch activity templates
    const fetchTemplates = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/counsellor/wellness/templates`, {
                headers: { cToken }
            });
            
            if (data.success) {
                setTemplates(data.templates || []);
            }
        } catch (error) {
            console.error('Fetch templates error:', error);
        }
    };

    // Get template details
    const getTemplateDetails = async (activityType) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/counsellor/wellness/templates/${activityType}`, {
                headers: { cToken }
            });
            
            if (data.success) {
                setSelectedTemplate(data.template);
                if (useTemplate) {
                    // Auto-fill form with template data
                    setFormData(prev => ({
                        ...prev,
                        duration: data.template.suggestedDuration.toString(),
                        instructions: data.template.defaultInstructions || [''],
                        resources: data.template.suggestedResources?.map(r => r.url) || ['']
                    }));
                }
            }
        } catch (error) {
            console.error('Get template details error:', error);
        }
    };

    // Create activity
    const createActivity = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error('Title and description are required');
            return;
        }

        // Validate duration against template max
        const config = activityTypeConfig[formData.activityType];
        if (formData.duration && parseInt(formData.duration) > config.maxDuration) {
            toast.error(`Duration cannot exceed ${config.maxDuration} minutes for ${config.name}`);
            return;
        }

        // Validate date range
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const diffInDays = (end - start) / (1000 * 60 * 60 * 24);
            
            if (diffInDays > 7) {
                toast.error('Activities cannot last more than 7 days');
                return;
            }
        }

        try {
            setLoading(true);
            const { data } = await axios.post(
                `${backendUrl}/api/counsellor/wellness/activities`,
                {
                    ...formData,
                    instructions: formData.instructions.filter(inst => inst && inst.trim()),
                    resources: formData.resources.filter(res => res && res.trim()),
                    duration: formData.duration ? parseInt(formData.duration) : undefined,
                    useTemplate
                },
                { headers: { cToken } }
            );

            if (data.success) {
                toast.success('Activity created successfully!');
                setShowCreateForm(false);
                resetForm();
                fetchActivities();
            } else {
                toast.error(data.message || 'Failed to create activity');
            }
        } catch (error) {
            console.error('Create activity error:', error);
            toast.error(error.response?.data?.message || 'Failed to create activity');
        } finally {
            setLoading(false);
        }
    };

    // Update activity
    const updateActivity = async (activityId, updates) => {
        try {
            setLoading(true);
            const { data } = await axios.put(
                `${backendUrl}/api/counsellor/wellness/activities/${activityId}`,
                updates,
                { headers: { cToken } }
            );

            if (data.success) {
                toast.success('Activity updated successfully!');
                fetchActivities();
                setSelectedActivity(null);
            } else {
                toast.error(data.message || 'Failed to update activity');
            }
        } catch (error) {
            console.error('Update activity error:', error);
            toast.error(error.response?.data?.message || 'Failed to update activity');
        } finally {
            setLoading(false);
        }
    };

    // Get activity participants
    const getActivityParticipants = async (activityId) => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${backendUrl}/api/counsellor/wellness/activities/${activityId}/participants`,
                { headers: { cToken } }
            );

            if (data.success) {
                setParticipants(data.participants || []);
                setCompletions(data.completions || []);
                setSelectedActivity(data.activity || null);
                setShowParticipants(true);
            } else {
                toast.error(data.message || 'Failed to fetch participants');
            }
        } catch (error) {
            console.error('Get participants error:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch participants');
        } finally {
            setLoading(false);
        }
    };

    const toggleActivityStatus = async (activityId, currentStatus) => {
        const newStatus = !currentStatus;
        await updateActivity(activityId, { isActive: newStatus });
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            activityType: 'meditation',
            duration: '',
            difficulty: 'beginner',
            instructions: [''],
            resources: [''],
            startDate: '',
            endDate: ''
        });
        setUseTemplate(false);
        setSelectedTemplate(null);
        setCurrentStep(1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleActivityTypeChange = (e) => {
        const activityType = e.target.value;
        setFormData(prev => ({
            ...prev,
            activityType
        }));
        
        if (useTemplate) {
            getTemplateDetails(activityType);
        }
    };

    const handleUseTemplateChange = (e) => {
        const checked = e.target.checked;
        setUseTemplate(checked);
        
        if (checked && formData.activityType) {
            getTemplateDetails(formData.activityType);
        } else {
            setSelectedTemplate(null);
            setFormData(prev => ({
                ...prev,
                duration: '',
                instructions: [''],
                resources: ['']
            }));
        }
    };

    const handleArrayInputChange = (index, value, field) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayField = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayField = (index, field) => {
        if (formData[field].length <= 1) return;
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    useEffect(() => {
        fetchActivities();
        fetchTemplates();
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Wellness Activities Management</h2>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Create New Activity
                </button>
            </div>

            {/* Activity Types Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {Object.entries(activityTypeConfig).map(([key, config]) => (
                    <div key={key} className="border border-blue-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{config.icon}</span>
                            <h3 className="font-semibold text-blue-800">{config.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{config.description}</p>
                        <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 rounded text-xs ${config.color}`}>
                                Max {config.maxDuration} min
                            </span>
                            <span className="text-sm text-gray-500">
                                {activities.filter(a => a.activityType === key).length} active
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Activity Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Create New Wellness Activity</h3>
                            <button
                                onClick={() => {
                                    setShowCreateForm(false);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center justify-center mb-6">
                            {[1, 2, 3].map((step) => (
                                <React.Fragment key={step}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {step}
                                    </div>
                                    {step < 3 && (
                                        <div className={`w-16 h-1 ${
                                            step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <form onSubmit={createActivity}>
                            {/* Step 1: Basic Information */}
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h4>
                                    
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Activity Title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />

                                    <textarea
                                        name="description"
                                        placeholder="Activity Description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Activity Type</label>
                                            <select
                                                name="activityType"
                                                value={formData.activityType}
                                                onChange={handleActivityTypeChange}
                                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                {Object.entries(activityTypeConfig).map(([key, config]) => (
                                                    <option key={key} value={key}>
                                                        {config.icon} {config.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                                            <select
                                                name="difficulty"
                                                value={formData.difficulty}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="beginner">🟢 Beginner</option>
                                                <option value="intermediate">🟡 Intermediate</option>
                                                <option value="advanced">🔴 Advanced</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Use Template Option */}
                                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                                        <input
                                            type="checkbox"
                                            id="useTemplate"
                                            checked={useTemplate}
                                            onChange={handleUseTemplateChange}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <label htmlFor="useTemplate" className="text-sm font-medium text-blue-800">
                                            Use pre-built template for this activity type
                                        </label>
                                    </div>

                                    {selectedTemplate && (
                                        <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                                            <h5 className="font-semibold text-green-800">Template: {selectedTemplate.name}</h5>
                                            <p className="text-sm text-green-700 mt-1">{selectedTemplate.description}</p>
                                            <p className="text-sm text-green-600 mt-2">
                                                Suggested duration: {selectedTemplate.suggestedDuration} minutes (max: {selectedTemplate.maxDuration})
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Next Step
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Activity Details */}
                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Activity Details</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Duration (minutes)
                                                {selectedTemplate && (
                                                    <span className="text-blue-600 text-xs ml-1">
                                                        (suggested: {selectedTemplate.suggestedDuration})
                                                    </span>
                                                )}
                                            </label>
                                            <input
                                                type="number"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="5"
                                                max={activityTypeConfig[formData.activityType]?.maxDuration || 60}
                                                placeholder={selectedTemplate?.suggestedDuration?.toString() || "30"}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Max: {activityTypeConfig[formData.activityType]?.maxDuration} minutes
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Start Date & Time</label>
                                            <input
                                                type="datetime-local"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">End Date & Time</label>
                                            <input
                                                type="datetime-local"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <p className="text-xs text-red-500 mt-1">Max 7 days duration</p>
                                        </div>
                                    </div>

                                    {/* Instructions */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Step-by-step Instructions
                                            {useTemplate && selectedTemplate?.defaultInstructions && (
                                                <span className="text-green-600 text-xs ml-1">(auto-filled from template)</span>
                                            )}
                                        </label>
                                        {formData.instructions.map((instruction, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <div className="flex-shrink-0 w-8 h-10 bg-blue-100 rounded flex items-center justify-center text-sm font-medium text-blue-600">
                                                    {index + 1}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={instruction}
                                                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'instructions')}
                                                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder={`Step ${index + 1}`}
                                                />
                                                {formData.instructions.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayField(index, 'instructions')}
                                                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addArrayField('instructions')}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            + Add Another Step
                                        </button>
                                    </div>

                                    <div className="flex justify-between">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Next Step
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Resources & Final Review */}
                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Resources & Review</h4>
                                    
                                    {/* Resources */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Supporting Resources (URLs)
                                            {useTemplate && selectedTemplate?.suggestedResources && (
                                                <span className="text-green-600 text-xs ml-1">(auto-filled from template)</span>
                                            )}
                                        </label>
                                        {formData.resources.map((resource, index) => (
                                            <div key={index} className="flex gap-2 mb-2">
                                                <input
                                                    type="url"
                                                    value={resource}
                                                    onChange={(e) => handleArrayInputChange(index, e.target.value, 'resources')}
                                                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="https://example.com/resource"
                                                />
                                                {formData.resources.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayField(index, 'resources')}
                                                        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addArrayField('resources')}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            + Add Resource
                                        </button>
                                    </div>

                                    {/* Activity Preview */}
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h5 className="font-semibold text-gray-800 mb-3">Activity Preview</h5>
                                        <div className="space-y-2 text-sm">
                                            <p><strong>Title:</strong> {formData.title || 'Untitled'}</p>
                                            <p><strong>Type:</strong> {activityTypeConfig[formData.activityType]?.name}</p>
                                            <p><strong>Duration:</strong> {formData.duration || 'Not set'} minutes</p>
                                            <p><strong>Difficulty:</strong> {formData.difficulty}</p>
                                            <p><strong>Instructions:</strong> {formData.instructions.filter(i => i.trim()).length} steps</p>
                                            <p><strong>Resources:</strong> {formData.resources.filter(r => r.trim()).length} links</p>
                                            {formData.startDate && (
                                                <p><strong>Schedule:</strong> {new Date(formData.startDate).toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Creating...
                                                </div>
                                            ) : 'Create Activity'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* Participants Modal */}
            {showParticipants && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">
                                Activity Analytics: {selectedActivity?.title}
                            </h3>
                            <button
                                onClick={() => setShowParticipants(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Analytics Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{participants.length}</div>
                                <div className="text-sm text-blue-800">Total Participants</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{completions.length}</div>
                                <div className="text-sm text-green-800">Completions</div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {participants.length > 0 ? Math.round((completions.length / participants.length) * 100) : 0}%
                                </div>
                                <div className="text-sm text-blue-800">Completion Rate</div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {completions.length > 0 ? 
                                        (completions.reduce((sum, c) => sum + c.rating, 0) / completions.length).toFixed(1) : 
                                        'N/A'
                                    }
                                </div>
                                <div className="text-sm text-blue-800">Avg Rating</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Participants */}
                            <div>
                                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <span>👥</span> Participants ({participants.length})
                                </h4>
                                {participants.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <div className="text-gray-400 mb-2">
                                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">No participants yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {participants.map((participant) => {
                                            const hasCompleted = completions.some(c => c.user?._id === participant._id);
                                            return (
                                                <div key={participant._id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 text-sm font-semibold">
                                                            {participant.name?.charAt(0).toUpperCase() || 'U'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{participant.name}</p>
                                                        <p className="text-sm text-gray-500">{participant.email}</p>
                                                    </div>
                                                    {hasCompleted && (
                                                        <span className="bg-blue-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                                            ✓ Completed
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Completions */}
                            <div>
                                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <span>📊</span> Recent Completions ({completions.length})
                                </h4>
                                {completions.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <div className="text-gray-400 mb-2">
                                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 00-2 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">No completions yet</p>
                                        <p className="text-xs text-gray-400 mt-1">Participants haven't finished the activity</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {completions.slice(0, 5).map((completion) => (
                                            <div key={completion._id} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-medium text-sm">
                                                        {completion.user?.name || 'Anonymous'}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                className={`w-4 h-4 ${
                                                                    i < completion.rating 
                                                                        ? 'text-blue-400 fill-current' 
                                                                        : 'text-gray-300'
                                                                }`}
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                        <span className="ml-1 text-sm text-gray-600">({completion.rating}/5)</span>
                                                    </div>
                                                </div>
                                                {completion.reflection && (
                                                    <p className="text-sm text-gray-600 mb-2 italic">
                                                        "{completion.reflection}"
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500">
                                                    Completed {new Date(completion.completedAt).toLocaleDateString()} at {new Date(completion.completedAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        ))}
                                        {completions.length > 5 && (
                                            <p className="text-center text-sm text-gray-500">
                                                + {completions.length - 5} more completions
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Activities List */}
            <div className="space-y-4">
                {loading && activities.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading activities...</p>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 text-lg">No activities created yet</p>
                        <p className="text-gray-500 text-sm mt-1">Create your first wellness activity to get started!</p>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Create First Activity
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Your Activities ({activities.length})</h3>
                            <div className="flex gap-2 text-sm">
                                <span className="bg-blue-100 text-green-800 px-2 py-1 rounded">
                                    {activities.filter(a => a.isActive).length} Active
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {activities.filter(a => !a.isActive).length} Inactive
                                </span>
                            </div>
                        </div>

                        {activities.map((activity) => {
                            const config = activityTypeConfig[activity.activityType];
                            const completionRate = activity.participantCount > 0 ? 
                                Math.round((activity.completions?.length || 0) / activity.participantCount * 100) : 0;

                            return (
                                <div key={activity._id} className="border border-blue-500 rounded-lg p-5 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-2xl">{config?.icon}</span>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">{activity.title}</h3>
                                                    <p className="text-sm text-gray-500">{config?.name}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    activity.isActive 
                                                        ? 'bg-blue-100 text-green-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {activity.isActive ? '✓ Active' : '✕ Inactive'}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-600 mb-4 leading-relaxed">{activity.description}</p>
                                            
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className={`px-3 py-1 rounded-full text-sm ${config?.color}`}>
                                                    {activity.activityType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </span>
                                                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                                    {activity.difficulty} level
                                                </span>
                                                {activity.duration && (
                                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                        {activity.duration} min
                                                    </span>
                                                )}
                                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                    {activity.participantCount || 0} participants
                                                </span>
                                                {completionRate > 0 && (
                                                    <span className="bg-blue-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                                        {completionRate}% completion
                                                    </span>
                                                )}
                                            </div>

                                            {activity.startDate && (
                                                <div className="text-sm text-gray-500 mb-3">
                                                    <span className="inline-flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Started: {new Date(activity.startDate).toLocaleDateString()}
                                                    </span>
                                                    {activity.endDate && (
                                                        <span className="ml-4 inline-flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Ends: {new Date(activity.endDate).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Instructions Preview */}
                                            {activity.instructions && activity.instructions.length > 0 && (
                                                <div className="text-sm text-gray-600">
                                                    <strong>Instructions:</strong> {activity.instructions.length} steps
                                                    <div className="ml-4 mt-1">
                                                        {activity.instructions.slice(0, 2).map((instruction, i) => (
                                                            <p key={i} className="text-xs text-gray-500">
                                                                {i + 1}. {instruction.length > 50 ? instruction.substring(0, 50) + '...' : instruction}
                                                            </p>
                                                        ))}
                                                        {activity.instructions.length > 2 && (
                                                            <p className="text-xs text-gray-400">+ {activity.instructions.length - 2} more steps</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-col gap-2 ml-6">
                                            <button
                                                onClick={() => getActivityParticipants(activity._id)}
                                                disabled={loading}
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 text-sm font-medium"
                                            >
                                                📊 View Analytics
                                            </button>
                                            <button
                                                onClick={() => toggleActivityStatus(activity._id, activity.isActive)}
                                                disabled={loading}
                                                className={`px-4 py-2 rounded-lg transition disabled:opacity-50 text-sm font-medium ${
                                                    activity.isActive
                                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                                        : 'bg-green-600 text-white hover:bg-green-700'
                                                }`}
                                            >
                                                {activity.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>

            {/* Activity Statistics */}
            {activities.length > 0 && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {activities.reduce((sum, a) => sum + (a.participantCount || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Participants</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {activities.reduce((sum, a) => sum + (a.completions?.length || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Completions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {activities.filter(a => a.isActive).length}
                            </div>
                            <div className="text-sm text-gray-600">Active Activities</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {activities.length > 0 ? 
                                    Math.round(
                                        activities.reduce((sum, a) => {
                                            const rate = a.participantCount > 0 ? 
                                                (a.completions?.length || 0) / a.participantCount * 100 : 0;
                                            return sum + rate;
                                        }, 0) / activities.length
                                    ) : 0
                                }%
                            </div>
                            <div className="text-sm text-gray-600">Avg Completion Rate</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            {activities.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        onClick={() => {
                            const activeCount = activities.filter(a => a.isActive).length;
                            toast.info(`You have ${activeCount} active activities`);
                        }}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition text-sm"
                    >
                        📈 Activity Summary
                    </button>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition text-sm"
                    >
                        ➕ Create Another
                    </button>
                    <button
                        onClick={() => {
                            const expiring = activities.filter(a => {
                                if (!a.endDate) return false;
                                const daysLeft = (new Date(a.endDate) - new Date()) / (1000 * 60 * 60 * 24);
                                return daysLeft <= 2 && daysLeft >= 0;
                            });
                            if (expiring.length > 0) {
                                toast.warning(`${expiring.length} activities expiring soon!`);
                            } else {
                                toast.info('No activities expiring soon');
                            }
                        }}
                        className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition text-sm"
                    >
                        ⏰ Check Expiring
                    </button>
                </div>
            )}

            {/* Tips and Guidelines */}
            <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Activity Creation Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Activities are limited to 7 days maximum - use wellness programs for longer durations</li>
                    <li>• Use templates to save time and ensure best practices</li>
                    <li>• Monitor completion rates to adjust difficulty levels</li>
                    <li>• Provide clear, step-by-step instructions for better engagement</li>
                    <li>• Include relevant resources to enhance the experience</li>
                </ul>
            </div>
        </div>
    );
};

export default ActivityManager;