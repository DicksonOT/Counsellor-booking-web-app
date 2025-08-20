import React, { useState } from 'react';
import { Play, Pause, Clock, Users, Star, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MeditationCenter = () => {
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const meditationSessions = [
    {
      id: 1,
      title: "Deep Breathing Fundamentals",
      description: "Learn the foundation of mindful breathing with guided techniques for instant calm and stress relief.",
      duration: "15 min",
      difficulty: "Beginner",
      category: "breathing",
      instructor: "Dr. Sarah Chen",
      rating: 4.9,
      participants: 12400,
      thumbnail: "https://youtu.be/vj0JDwQLof4?si=uFNKb_mXrDrxd4Q_",
      videoUrl: "https://www.youtube.com/embed/vj0JDwQLof4"
    },
    {
      id: 2,
      title: "Body Scan Relaxation",
      description: "Progressive muscle relaxation technique to release tension and promote deep physical and mental rest.",
      duration: "25 min",
      difficulty: "Intermediate",
      category: "relaxation",
      instructor: "Michael Torres",
      rating: 4.8,
      participants: 8900,
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=250&fit=crop&crop=center",
      videoUrl: "https://www.youtube.com/embed/15q17jbBWU0"
    },
    {
      id: 3,
      title: "Mindful Morning Routine",
      description: "Start your day with intention and clarity through this energizing morning meditation practice.",
      duration: "10 min",
      difficulty: "Beginner",
      category: "morning",
      instructor: "Emma Rodriguez",
      rating: 4.7,
      participants: 15200,
      thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center",
      videoUrl: "https://www.youtube.com/embed/ZToicYcHIOU"
    },
    {
      id: 4,
      title: "Anxiety Relief Session",
      description: "Specialized techniques to calm racing thoughts and reduce anxiety through mindful awareness.",
      duration: "20 min",
      difficulty: "Intermediate",
      category: "anxiety",
      instructor: "Dr. James Liu",
      rating: 4.9,
      participants: 9800,
      thumbnail: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=400&h=250&fit=crop&crop=center",
      videoUrl: "https://www.youtube.com/embed/O-6f5wQXSu8"
    },
    {
      id: 5,
      title: "Sleep Preparation",
      description: "Wind down with gentle meditation designed to prepare your mind and body for restful sleep.",
      duration: "30 min",
      difficulty: "Beginner",
      category: "sleep",
      instructor: "Luna Martinez",
      rating: 4.8,
      participants: 11600,
      thumbnail: "https://images.unsplash.com/photo-1497551060073-4c5ab6435f12?w=400&h=250&fit=crop&crop=center",
      videoUrl: "https://www.youtube.com/embed/aEqlQvczMJQ"
    },
    {
      id: 6,
      title: "Focus Enhancement",
      description: "Sharpen your concentration and mental clarity with advanced mindfulness techniques.",
      duration: "18 min",
      difficulty: "Advanced",
      category: "focus",
      instructor: "Alex Thompson",
      rating: 4.7,
      participants: 7300,
      thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop&crop=center",
      videoUrl: "https://www.youtube.com/embed/inpok4MKVLM"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Sessions', color: 'bg-blue-500' },
    { id: 'breathing', name: 'Breathing', color: 'bg-blue-400' },
    { id: 'relaxation', name: 'Relaxation', color: 'bg-blue-600' },
    { id: 'morning', name: 'Morning', color: 'bg-blue-300' },
    { id: 'anxiety', name: 'Anxiety Relief', color: 'bg-blue-700' },
    { id: 'sleep', name: 'Sleep', color: 'bg-blue-800' },
    { id: 'focus', name: 'Focus', color: 'bg-blue-900' }
  ];

  const filteredSessions = meditationSessions.filter(session => {
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePlayVideo = (sessionId) => {
    setActiveVideo(activeVideo === sessionId ? null : sessionId);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
            Find Your
            <span className="block text-blue-500">Inner Peace</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover guided meditation sessions designed to reduce stress, improve focus, and enhance your mental well-being.
          </p>
          
          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search meditations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
            </div>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-sm ${
                  selectedCategory === category.id
                    ? `${category.color} text-white transform scale-105`
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Meditation Sessions Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:transform hover:scale-105 hover:border-blue-200 transition-all duration-300 hover:shadow-xl shadow-sm"
              >
                {/* Video Thumbnail */}
                <div className="relative h-48 bg-blue-500 overflow-hidden">
                  {activeVideo === session.id ? (
                    <iframe
                      src={session.videoUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={session.title}
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => handlePlayVideo(session.id)}
                          className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-200"
                        >
                          <Play className="w-8 h-8 text-white ml-1" />
                        </button>
                      </div>
                      
                      {/* Floating elements animation */}
                      <div className="absolute top-4 left-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                      <div className="absolute top-8 right-8 w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute bottom-6 left-8 w-4 h-4 bg-white/20 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                      {session.difficulty}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm text-gray-600">{session.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {session.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {session.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{session.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{session.participants.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    by {session.instructor}
                  </div>

                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:transform hover:translateY(-1px) hover:shadow-lg">
                    Start Session
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-blue-50 border-t border-blue-100 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Mind?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Join thousands of users who have found peace and clarity through our guided meditation programs.
          </p>
          <button onClick={navigate('/community')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:transform hover:scale-105 hover:shadow-xl">
            Start Your Journey Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default MeditationCenter;