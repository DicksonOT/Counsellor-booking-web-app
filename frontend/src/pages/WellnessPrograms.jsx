import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Users, Star, Filter, Search, BookOpen, CheckCircle, Loader, Shield, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgramChatIntegration from './ProgramChatIntegration';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const WellnessPrograms = () => {
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(AppContext);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [programs, setPrograms] = useState([]);
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);

  const categories = [
    { id: 'all', name: 'All Programs', color: 'bg-blue-500' },
    { id: 'Stress Relief', name: 'Stress Management', color: 'bg-blue-600' },
    { id: 'Anxiety Management', name: 'Anxiety Relief', color: 'bg-blue-700' },
    { id: 'Sleep Health', name: 'Sleep Improvement', color: 'bg-blue-800' },
    { id: 'Personal Growth', name: 'Personal Growth', color: 'bg-blue-400' },
    { id: 'Mindfulness', name: 'Mindfulness', color: 'bg-blue-500' },
    { id: 'Depression Support', name: 'Depression Support', color: 'bg-blue-600' }
  ];

  // Fetch programs from backend
  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/user/get-programs`);

      if (data.success) {
        setPrograms(data.programs);

        // If user is logged in, fetch their enrollments
        if (token) {
          await fetchUserEnrollments();
        }
      } else {
        toast.error('Failed to fetch programs');
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Error loading programs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user enrollments
  const fetchUserEnrollments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-enrollments`, {
        headers: { token }
      });

      if (data.success) {
        setEnrolledPrograms(data.enrollments.map(enrollment => enrollment.program._id));
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      // Don't show error toast for enrollments as it might not be critical
    }
  };

  // Enroll in program
  const handleEnroll = async (programId) => {
    if (!token) {
      toast.error('Please login to enroll in programs');
      navigate('/login');
      return;
    }

    if (enrolledPrograms.includes(programId)) {
      toast.info('You are already enrolled in this program');
      return;
    }

    try {
      setEnrolling(programId);
      const { data } = await axios.post(`${backendUrl}/api/user/enroll`,
        { programId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success('Successfully enrolled! You can now access the support group chat.');
        setEnrolledPrograms([...enrolledPrograms, programId]);

        // Update participant count in local state
        setPrograms(programs.map(program =>
          program._id === programId
            ? { ...program, participants: program.participants + 1 }
            : program
        ));
      } else {
        toast.error(data.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error(error.response?.data?.message || 'Failed to enroll in program');
    } finally {
      setEnrolling(null);
    }
  };

  // Handle joining chat for enrolled programs
  const handleJoinChat = (program) => {
    // Navigate to the program chat room
    navigate(`/chat/program/${program._id}`, {
      state: {
        programTitle: program.title,
        programId: program._id,
        programDescription: program.description
      }
    });
  };

  // Filter programs
  const filteredPrograms = programs.filter(program => {
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isEnrolled = (programId) => enrolledPrograms.includes(programId);

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-50 text-green-600';
      case 'intermediate': return 'bg-yellow-50 text-yellow-600';
      case 'advanced': return 'bg-red-50 text-red-600';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading wellness programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-[70vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://media.istockphoto.com/id/2194272544/photo/biscayne-national-park-florida-usa-boardwalk.webp?a=1&b=1&s=612x612&w=0&k=20&c=VHQk3inYlnAeHOywLeZk77qTcOtK1tB8LIVJGRl6XdE=')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-800/70 to-blue-900/90"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center text-white z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Your Path to
            <span className="block text-blue-300">Mental Wellness</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Transform your mental health with structured programs designed by experts. Track your progress, connect with peers in support groups, and build lasting habits for a healthier mind.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search wellness programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-sm ${selectedCategory === category.id
                    ? `${category.color} text-white transform scale-105 shadow-lg`
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-200'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <div
                key={program._id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:transform hover:scale-105 hover:border-blue-200 transition-all duration-300 hover:shadow-xl shadow-sm"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={program.thumbnail || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&crop=center`}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&crop=center`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                  {/* Price Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${program.price === 'Free' || program.price === 0
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white'
                    }`}>
                    {program.price === 'Free' || program.price === 0 ? 'Free' : `$${program.price}`}
                  </div>

                  {/* Enrollment Status */}
                  {isEnrolled(program._id) && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-green-500/90 backdrop-blur-sm rounded-full p-2">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(program.difficulty)}`}>
                      {program.difficulty || 'Beginner'}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Rating: {program.rating.average} out of 5 based on {program.rating.count} reviews.</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {program.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {program.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{program.duration?.value} {program.duration?.unit || 'days'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{program.totalModules || 'Multiple'} modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{(program.participants || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    Led by {program.instructor?.name || 'Expert Counselor'}
                  </div>

                  {/* Expected Outcome */}
                  {program.outcome && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-700 text-sm font-medium">Expected Outcome:</p>
                      <p className="text-blue-600 text-sm">{program.outcome}</p>
                    </div>
                  )}

                  {/* Dynamic Button - Enroll or Join Chat */}
                  {isEnrolled(program._id) ? (
                    <button
                      onClick={() => handleJoinChat(program)}
                      className="w-full font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:transform hover:translateY(-1px) hover:shadow-lg flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Join Support Chat
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEnroll(program._id)}
                      disabled={enrolling === program._id}
                      className="w-full font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:transform hover:translateY(-1px) hover:shadow-lg flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300"
                    >
                      {enrolling === program._id ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        'Enroll Now'
                      )}
                    </button>
                  )}
                  
                  {/* Chat Integration */}
                  <ProgramChatIntegration
                    program={program}
                    isEnrolled={isEnrolled(program._id)}
                  />
                </div>
              </div>
            ))}
          </div>

          {filteredPrograms.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Community Section - Updated */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Wellness Community
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Connect with others on similar journeys through program-specific support groups, share experiences, and get guidance from expert counsellors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Program Support Groups</h3>
              <p className="text-gray-600">Join dedicated chat rooms for each program where you can connect with fellow participants and get peer support.</p>
            </div>

            <div className="text-center bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Group Sessions</h3>
              <p className="text-gray-600">Participate in scheduled group therapy sessions led by licensed counsellors within your program chat rooms.</p>
            </div>

            <div className="text-center bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safe Moderated Environment</h3>
              <p className="text-gray-600">All chat rooms are moderated by professional counsellors to ensure a supportive and safe space for sharing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Take the first step towards better mental health with our expert-guided programs, supportive community chat rooms, and professional counsellor support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { navigate('/community'); scrollTo(0, 0) }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:transform hover:scale-105 hover:shadow-xl"
            >
              Join Our Community
            </button>
            <button
              onClick={() => { navigate('/counsellors'); scrollTo(0, 0) }}
              className="bg-white hover:bg-gray-50 text-blue-500 font-semibold py-4 px-8 rounded-xl border-2 border-blue-500 transition-all duration-200 hover:transform hover:scale-105"
            >
              Talk to a Counselor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WellnessPrograms;