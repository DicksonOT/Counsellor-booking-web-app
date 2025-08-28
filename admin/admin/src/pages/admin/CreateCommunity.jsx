import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Plus,
  X,
  Users,
  Lock,
  Globe,
  Tag,
  BookOpen,
  Palette,
  ClipboardList,
  Heart,
  Shield,
  Camera,
  Info
} from 'lucide-react';
import { AdminContext } from '../../context/AdminContext';


const CreateCommunityForm = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    theme: 'general',
    rules: [''],
    tags: [],
    isPrivate: false,
    image: null
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { 
      value: 'peer_support', 
      label: 'Peer Support',
      description: 'Member-driven support groups where people help each other',
      icon: '🤝'
    },
    { 
      value: 'counselor_led', 
      label: 'Counselor Led',
      description: 'Professional guidance with trained mental health counselors',
      icon: '👨‍⚕️'
    },
    { 
      value: 'wellness_activities', 
      label: 'Wellness Activities',
      description: 'Interactive activities focused on mental health and wellbeing',
      icon: '🧘‍♀️'
    },
    { 
      value: 'resource_sharing', 
      label: 'Resource Sharing',
      description: 'Share helpful tools, articles, and resources',
      icon: '📚'
    }
  ];

  const themes = [
    { 
      value: 'anxiety', 
      label: 'Anxiety Support',
      description: 'For managing anxiety, panic attacks, and worry',
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-blue-600'
    },
    { 
      value: 'depression', 
      label: 'Depression Recovery',
      description: 'Support for depression and mood-related challenges',
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-purple-600'
    },
    { 
      value: 'stress', 
      label: 'Stress Management',
      description: 'Techniques and support for managing daily stress',
      color: 'bg-orange-500',
      gradient: 'from-orange-400 to-orange-600'
    },
    { 
      value: 'trauma', 
      label: 'Trauma Healing',
      description: 'Safe space for trauma survivors and healing',
      color: 'bg-red-500',
      gradient: 'from-red-400 to-red-600'
    },
    { 
      value: 'mindfulness', 
      label: 'Mindfulness & Meditation',
      description: 'Mindfulness practices and meditation techniques',
      color: 'bg-green-500',
      gradient: 'from-green-400 to-green-600'
    },
    { 
      value: 'general', 
      label: 'General Wellness',
      description: 'Overall mental health and wellbeing discussions',
      color: 'bg-gray-500',
      gradient: 'from-gray-400 to-gray-600'
    }
  ];

  const sampleDescriptions = {
    peer_support: "A safe space where community members support each other through shared experiences, encouragement, and understanding. Together we navigate challenges and celebrate victories.",
    counselor_led: "Professional mental health counselors guide discussions and provide expert insights while fostering a supportive community environment for growth and healing.",
    wellness_activities: "Engage in interactive wellness activities, challenges, and exercises designed to promote mental health, build healthy habits, and connect with others on similar journeys.",
    resource_sharing: "Discover and share valuable mental health resources including articles, books, apps, tools, and research to support your wellbeing journey."
  };

  const sampleRules = [
    "Be respectful and kind to all community members",
    "No medical advice - share personal experiences only", 
    "Use content warnings for potentially triggering topics",
    "Maintain confidentiality and respect privacy",
    "Focus on supportive and constructive conversations"
  ];

  // Input handlers
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Auto-fill description based on category
    if (name === 'category' && sampleDescriptions[value] && !formData.description) {
      setFormData(prev => ({
        ...prev,
        description: sampleDescriptions[value]
      }));
    }
  };

  // Rule management
  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData(prev => ({ ...prev, rules: newRules }));
  };

  const addRule = () => {
    setFormData(prev => ({ ...prev, rules: [...prev.rules, ''] }));
  };

  const removeRule = (index) => {
    if (formData.rules.length > 1) {
      setFormData(prev => ({
        ...prev,
        rules: prev.rules.filter((_, i) => i !== index)
      }));
    }
  };

  const useSampleRules = () => {
    setFormData(prev => ({ ...prev, rules: [...sampleRules] }));
  };

  // Tag management
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Submit handler
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!formData.name.trim()) {
    toast.error('Community name is required');
    return;
  }
  if (!formData.description.trim()) {
    toast.error('Description is required');
    return;
  }
  if (!formData.category) {
    toast.error('Please select a category');
    return;
  }

  setLoading(true);

  try {
    // Filter out empty rules
    const filteredData = {
      ...formData,
      rules: formData.rules.filter(rule => rule.trim() !== '')
    };

    const formDataToSend = new FormData();
    
    // Add all form fields to FormData
    Object.keys(filteredData).forEach(key => {
      if (key === 'rules' || key === 'tags') {
        formDataToSend.append(key, JSON.stringify(filteredData[key]));
      } else if (key === 'image' && filteredData[key]) {
        formDataToSend.append(key, filteredData[key]);
      } else if (key !== 'image') {
        formDataToSend.append(key, filteredData[key]);
      }
    });

    // Debug: Log what we're sending
    console.log('FormData contents:');
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    // IMPORTANT: Don't set Content-Type header for FormData
    // Let the browser set it automatically with the correct boundary
    const { data } = await axios.post(
      `${backendUrl}/api/admin/create-community`, 
      formDataToSend, 
      {
        headers: { 
          aToken
        }
      }
    );

    if (data.success) {
      toast.success('🎉 Community created successfully!');
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        theme: 'general',
        rules: [''],
        tags: [],
        isPrivate: false,
        image: null
      });
      setTagInput('');
      // Navigate to communities list or dashboard
      // navigate('/admin/communities');
    } else {
      toast.error(data.message || 'Failed to create community');
    }
  } catch (error) {
    console.error('Error creating community:', error);
    console.error('Error response:', error.response?.data);
    toast.error(error.response?.data?.message || 'An error occurred while creating the community');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-8xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600 bg-opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold flex items-center gap-4 mb-3">
                <div className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
                  <Users size={32} />
                </div>
                Create New Community
              </h2>
              <p className="text-blue-100 text-lg">Build a supportive space where people can connect, heal and grow together</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full -ml-12 -mb-12"></div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Basic Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-lg">
                    <BookOpen size={24} />
                  </div>
                  Basic Information
                </h3>

                <div className="space-y-6">
                  {/* Community Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Community Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Anxiety Support Circle, Depression Recovery Journey, Mindful Living Practice"
                      className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">Choose a welcoming, clear name that reflects your community's purpose</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your community's purpose, who it's for, and what members can expect. Be welcoming and specific about the type of support or activities you'll offer."
                      rows={5}
                      className="w-full px-5 py-4 border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md resize-none"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">Help people understand what makes your community special and how it can help them</p>
                  </div>
                </div>
              </div>

              {/* Category Selection */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-purple-600 text-white rounded-lg">
                    <Heart size={24} />
                  </div>
                  Community Category
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <label key={category.value} className={`flex items-start gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      formData.category === category.value 
                        ? 'border-purple-500 bg-purple-50 shadow-lg' 
                        : 'border-gray-200 hover:border-purple-300 hover:bg-white hover:shadow-md'
                    }`}>
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={formData.category === category.value}
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{category.icon}</span>
                          <span className="font-bold text-gray-800">{category.label}</span>
                        </div>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Theme Selection */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-8 rounded-xl border border-green-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-green-600 text-white rounded-lg">
                    <Palette size={24} />
                  </div>
                  Community Theme
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <label key={theme.value} className={`flex items-start gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      formData.theme === theme.value 
                        ? 'border-green-500 bg-green-50 shadow-lg' 
                        : 'border-gray-200 hover:border-green-300 hover:bg-white hover:shadow-md'
                    }`}>
                      <input
                        type="radio"
                        name="theme"
                        value={theme.value}
                        checked={formData.theme === theme.value}
                        onChange={handleChange}
                        className="mt-1 w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-4 h-4 rounded-full ${theme.color}`}></div>
                          <span className="font-bold text-gray-800">{theme.label}</span>
                        </div>
                        <p className="text-sm text-gray-600">{theme.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-xl border border-amber-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-amber-600 text-white rounded-lg">
                    <Shield size={24} />
                  </div>
                  Privacy Settings
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <label className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    !formData.isPrivate 
                      ? 'border-green-500 bg-green-50 shadow-lg' 
                      : 'border-gray-200 hover:border-amber-300 hover:bg-white hover:shadow-md'
                  }`}>
                    <input
                      type="radio"
                      name="isPrivate"
                      value={false}
                      checked={!formData.isPrivate}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: false }))}
                      className="w-6 h-6 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 text-green-600 rounded-full">
                        <Globe size={20} />
                      </div>
                      <div>
                        <span className="block font-bold text-gray-800">Public Community</span>
                        <span className="block text-sm text-gray-600">Anyone can discover and join</span>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    formData.isPrivate 
                      ? 'border-red-500 bg-red-50 shadow-lg' 
                      : 'border-gray-200 hover:border-amber-300 hover:bg-white hover:shadow-md'
                  }`}>
                    <input
                      type="radio"
                      name="isPrivate"
                      value={true}
                      checked={formData.isPrivate}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: true }))}
                      className="w-6 h-6 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-100 text-red-600 rounded-full">
                        <Lock size={20} />
                      </div>
                      <div>
                        <span className="block font-bold text-gray-800">Private Community</span>
                        <span className="block text-sm text-gray-600">Invitation or approval required</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Community Rules */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-8 rounded-xl border border-red-200 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="p-2 bg-red-600 text-white rounded-lg">
                      <ClipboardList size={24} />
                    </div>
                    Community Rules
                  </h3>
                  <button
                    type="button"
                    onClick={useSampleRules}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-300"
                  >
                    <Info size={16} />
                    Use Sample Rules
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">Set clear, positive guidelines to create a safe and supportive environment for all members.</p>
                
                <div className="space-y-4">
                  {formData.rules.map((rule, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center text-lg font-bold mt-2 shadow-lg">
                        {index + 1}
                      </div>
                      <textarea
                        value={rule}
                        onChange={(e) => handleRuleChange(index, e.target.value)}
                        placeholder={`Rule ${index + 1}: e.g., Be respectful and kind to all community members`}
                        rows={2}
                        className="flex-1 px-5 py-4 border-2 border-red-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md resize-none"
                      />
                      {formData.rules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRule(index)}
                          className="p-3 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-300 border-2 border-red-200 hover:border-red-300 mt-2"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addRule}
                    className="flex items-center gap-3 px-6 py-4 text-red-700 hover:bg-red-100 rounded-xl transition-all duration-300 border-2 border-red-300 hover:border-red-400 font-semibold"
                  >
                    <Plus size={20} />
                    Add Another Rule
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-xl border border-indigo-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg">
                    <Tag size={24} />
                  </div>
                  Community Tags
                </h3>
                
                <p className="text-gray-600 mb-6">Add tags to help people discover your community. Use keywords that describe your focus areas.</p>
                
                <div className="space-y-4">
                  {/* Current Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="p-1 hover:bg-indigo-200 rounded-full transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Add Tag Input */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="e.g., anxiety, mindfulness, support, recovery, wellness..."
                      className="flex-1 px-5 py-4 border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md"
                      maxLength={20}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      disabled={!tagInput.trim() || formData.tags.length >= 10}
                      className="px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
                    >
                      Add Tag
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    {formData.tags.length}/10 tags • Press Enter or click "Add Tag" to add
                  </p>
                </div>
              </div>

              {/* Community Image */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-8 rounded-xl border border-cyan-200 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-cyan-600 text-white rounded-lg">
                    <Camera size={24} />
                  </div>
                  Community Image (Optional)
                </h3>
                
                <p className="text-gray-600 mb-6">Upload an image that represents your community's spirit and values.</p>
                
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full px-5 py-4 border-2 border-cyan-200 rounded-xl focus:ring-4 focus:ring-cyan-100 focus:border-cyan-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-100 file:text-cyan-700 hover:file:bg-cyan-200"
                />
                
                <p className="text-sm text-gray-500 mt-2">Recommended: Square image, at least 400x400px, under 5MB</p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-16 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white font-bold text-xl rounded-2xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Community...
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Users size={24} />
                      Create Community
                    </div>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityForm;