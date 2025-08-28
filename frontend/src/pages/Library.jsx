import React, { useState} from 'react';
import { Search, BookOpen, Video, Headphones, Download, Heart, Clock, Star, Filter, ChevronRight, Play, FileText, Image } from 'lucide-react';
import { resources } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const MentalHealthLibrary = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [savedResources, setSavedResources] = useState(new Set());
//   const [recentlyViewed, setRecentlyViewed] = useState([]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📚', color: 'bg-blue-500' },
    { id: 'depression', name: 'Depression', icon: '🧠', color: 'bg-purple-500' },
    { id: 'anxiety', name: 'Anxiety & Stress', icon: '😰', color: 'bg-orange-500' },
    { id: 'sleep', name: 'Sleep Health', icon: '🛌', color: 'bg-indigo-500' },
    { id: 'relationships', name: 'Relationships', icon: '💬', color: 'bg-pink-500' },
    { id: 'mindfulness', name: 'Mindfulness & Growth', icon: '✨', color: 'bg-green-500' },
    { id: 'workplace', name: 'Workplace Mental Health', icon: '👩‍💻', color: 'bg-blue-600' },
    { id: 'youth', name: 'For Students / Youth', icon: '🧑‍🎓', color: 'bg-yellow-500' }
  ];

  const resourceTypes = [
    { id: 'all', name: 'All Types', icon: BookOpen },
    { id: 'article', name: 'Articles', icon: FileText },
    { id: 'video', name: 'Videos', icon: Video },
    { id: 'audio', name: 'Audio/Podcasts', icon: Headphones },
    { id: 'download', name: 'Downloads', icon: Download },
    { id: 'infographic', name: 'Infographics', icon: Image }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const featuredResources = resources.filter(r => r.featured);
  const trendingResources = resources.filter(r => r.trending);
  const newResources = resources.filter(r => r.new);

  const toggleSaveResource = (resourceId) => {
    const newSaved = new Set(savedResources);
    if (newSaved.has(resourceId)) {
      newSaved.delete(resourceId);
    } else {
      newSaved.add(resourceId);
    }
    setSavedResources(newSaved);
  };

  const getTypeIcon = (type) => {
    const typeObj = resourceTypes.find(t => t.id === type);
    return typeObj ? typeObj.icon : BookOpen;
  };

  const ResourceCard = ({ resource, compact = false }) => {
    const TypeIcon = getTypeIcon(resource.type);
    
    return (
      <div className={`bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 ${compact ? 'p-4' : 'p-6'}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TypeIcon className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {resource.type}
            </span>
          </div>
          <button
            onClick={() => toggleSaveResource(resource.id)}
            className={`p-2 rounded-full transition-colors ${
              savedResources.has(resource.id)
                ? 'text-red-500 bg-red-50'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${savedResources.has(resource.id) ? 'fill-current' : ''}`} />
          </button>
        </div>

        <h3 className={`font-semibold text-gray-900 mb-2 ${compact ? 'text-sm' : 'text-lg'}`}>
          {resource.title}
        </h3>
        
        {!compact && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {resource.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {resource.duration}
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
              {resource.rating}
            </span>
            <span>{resource.views} views</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <button 
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            onClick={() => window.open(resource.viewLink, '_blank')}
          >
            {resource.type === 'video' || resource.type === 'audio' ? (
              <>
                <Play className="w-4 h-4 mr-1" />
                Play
              </>
            ) : (
              <>
                View
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

        {/* Download Link */}
        {resource.downloadLink && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => window.open(resource.downloadLink, '_blank')}
              className="flex items-center text-green-600 hover:text-green-700 font-medium text-sm w-full justify-center py-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download {resource.type === 'download' ? 'PDF' : 'Resource'}
            </button>
          </div>
        )}

        {(resource.featured || resource.trending || resource.new) && (
          <div className="mt-3 flex space-x-2">
            {resource.featured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                Featured
              </span>
            )}
            {resource.trending && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Trending
              </span>
            )}
            {resource.new && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                New
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Your Mental Health Library
            </h1>
            <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto drop-shadow-md">
              Explore resources, guides, and tools designed to help you understand and improve your mental well-being.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for anxiety, sleep, stress management..."
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white/90 backdrop-blur-sm rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-blue-300 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-xl text-center transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white border border-gray-200 hover:shadow-md hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filter by type:</span>
          </div>
          {resourceTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  selectedType === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{type.name}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Section */}
        {!searchTerm && selectedCategory === 'all' && selectedType === 'all' && (
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Resources</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Trending Now</h3>
                <div className="space-y-4">
                  {trendingResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} compact />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">New Additions</h3>
                <div className="space-y-4">
                  {newResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} compact />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* All Resources */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm || selectedCategory !== 'all' || selectedType !== 'all' 
                ? 'Search Results' 
                : 'All Resources'
              }
            </h2>
            <span className="text-gray-500">
              {filteredResources.length} resources found
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-500 mb-2">No resources found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Want Personalized Help?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get tailored recommendations and professional support based on your unique needs and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button  onClick={()=> {navigate('/screening'); scrollTo(0,0)}}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Take Self-Assessment
            </button>
            <button onClick={()=> {navigate('/counsellors'); scrollTo(0,0)}} 
            className="border-2 border-white text-white px-8 py-3 rounded-xl font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Book a Counselor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthLibrary;