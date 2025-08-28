// import React, { useState } from 'react';
// import { Calendar, Clock, Users, Star, Filter, Search, BookOpen, Award, TrendingUp, Heart, Brain, Moon, Focus, Smile, Shield } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const WellnessPrograms = () => {
//   const navigate = useNavigate()
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [enrolledPrograms, setEnrolledPrograms] = useState([1, 3]); // Mock enrolled programs

//   const wellnessPrograms = [
//     {
//       id: 1,
//       title: "21-Day Stress Reset Challenge",
//       description: "Transform your relationship with stress through daily practices, breathing techniques, and mindfulness exercises.",
//       duration: "21 days",
//       difficulty: "Beginner",
//       category: "stress",
//       instructor: "Dr. Sarah Chen",
//       rating: 4.9,
//       participants: 12400,
//       modules: 21,
//       progress: 65, // For enrolled users
//       thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&crop=center",
//       outcome: "Build resilience and develop healthy stress management habits",
//       features: ["Daily guided meditations", "Stress tracking journal", "Weekly group sessions", "Personalized action plans"],
//       price: "Free"
//     },
//     {
//       id: 2,
//       title: "7-Day Better Sleep Challenge",
//       description: "Establish healthy sleep patterns and overcome insomnia with proven sleep hygiene techniques and bedtime routines.",
//       duration: "7 days",
//       difficulty: "Beginner",
//       category: "sleep",
//       instructor: "Luna Martinez",
//       rating: 4.8,
//       participants: 8900,
//       modules: 7,
//       progress: 0,
//       thumbnail: "https://images.unsplash.com/photo-1497551060073-4c5ab6435f12?w=400&h=250&fit=crop&crop=center",
//       outcome: "Achieve consistent, restful sleep and wake up refreshed",
//       features: ["Evening wind-down routines", "Sleep environment optimization", "Relaxation techniques", "Sleep diary tracking"],
//       price: "Free"
//     },
//     {
//       id: 3,
//       title: "Managing Anxiety in 21 Days",
//       description: "Learn evidence-based techniques to manage anxiety, including CBT strategies, grounding exercises, and coping mechanisms.",
//       duration: "21 days",
//       difficulty: "Intermediate",
//       category: "anxiety",
//       instructor: "Dr. James Liu",
//       rating: 4.9,
//       participants: 15200,
//       modules: 21,
//       progress: 28,
//       thumbnail: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=400&h=250&fit=crop&crop=center",
//       outcome: "Develop confidence in managing anxiety and reduce daily worry",
//       features: ["CBT-based exercises", "Anxiety tracking tools", "Crisis management plans", "Peer support groups"],
//       price: "Premium"
//     },
//     {
//       id: 4,
//       title: "30 Days of Gratitude & Self-Esteem",
//       description: "Build lasting self-confidence and positive thinking patterns through daily gratitude practice and affirmations.",
//       duration: "30 days",
//       difficulty: "Beginner",
//       category: "growth",
//       instructor: "Emma Rodriguez",
//       rating: 4.7,
//       participants: 9800,
//       modules: 30,
//       progress: 0,
//       thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop&crop=center",
//       outcome: "Cultivate self-love and develop unshakeable confidence",
//       features: ["Daily gratitude journaling", "Self-esteem building exercises", "Positive affirmation library", "Progress celebrations"],
//       price: "Free"
//     },
//     {
//       id: 5,
//       title: "Mindfulness for Beginners",
//       description: "A comprehensive 14-day introduction to mindfulness meditation and present-moment awareness practices.",
//       duration: "14 days",
//       difficulty: "Beginner",
//       category: "mindfulness",
//       instructor: "Michael Torres",
//       rating: 4.8,
//       participants: 11600,
//       modules: 14,
//       progress: 0,
//       thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center",
//       outcome: "Establish a sustainable daily mindfulness practice",
//       features: ["Step-by-step meditation guide", "Mindful living tips", "Progress tracking", "Community support"],
//       price: "Free"
//     },
//     {
//       id: 6,
//       title: "Focus & Productivity Mastery",
//       description: "Enhance concentration, overcome distractions, and boost productivity through mindfulness and cognitive training.",
//       duration: "28 days",
//       difficulty: "Intermediate",
//       category: "focus",
//       instructor: "Alex Thompson",
//       rating: 4.7,
//       participants: 7300,
//       modules: 28,
//       progress: 0,
//       thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop&crop=center",
//       outcome: "Master your attention and achieve peak productivity",
//       features: ["Focus training exercises", "Distraction management", "Time blocking techniques", "Performance tracking"],
//       price: "Premium"
//     },
//     {
//       id: 7,
//       title: "Overcoming Depression - 6 Week Journey",
//       description: "A comprehensive program combining therapy techniques, mood tracking, and peer support for depression recovery.",
//       duration: "6 weeks",
//       difficulty: "Advanced",
//       category: "depression",
//       instructor: "Dr. Maya Singh",
//       rating: 4.9,
//       participants: 5400,
//       modules: 42,
//       progress: 0,
//       thumbnail: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=400&h=250&fit=crop&crop=center",
//       outcome: "Develop tools for managing depression and building resilience",
//       features: ["Cognitive behavioral therapy", "Mood tracking dashboard", "Weekly counselor check-ins", "Support group access"],
//       price: "Premium"
//     },
//     {
//       id: 8,
//       title: "Building Resilience - 21 Day Program",
//       description: "Strengthen your mental resilience and develop the ability to bounce back from life's challenges.",
//       duration: "21 days",
//       difficulty: "Intermediate",
//       category: "resilience",
//       instructor: "Daniel Kim",
//       rating: 4.8,
//       participants: 9200,
//       modules: 21,
//       progress: 0,
//       thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&crop=center",
//       outcome: "Build unshakeable mental strength and adaptability",
//       features: ["Resilience assessment", "Challenge reframing", "Stress inoculation", "Recovery strategies"],
//       price: "Premium"
//     }
//   ];

//   const categories = [
//     { id: 'all', name: 'All Programs', color: 'bg-blue-500', icon: BookOpen },
//     { id: 'stress', name: 'Stress Management', color: 'bg-blue-600', icon: Shield },
//     { id: 'anxiety', name: 'Anxiety Relief', color: 'bg-blue-700', icon: Heart },
//     { id: 'sleep', name: 'Sleep Improvement', color: 'bg-blue-800', icon: Moon },
//     { id: 'growth', name: 'Personal Growth', color: 'bg-blue-400', icon: TrendingUp },
//     { id: 'mindfulness', name: 'Mindfulness', color: 'bg-blue-500', icon: Brain },
//     { id: 'focus', name: 'Focus & Productivity', color: 'bg-blue-900', icon: Focus },
//     { id: 'depression', name: 'Depression Support', color: 'bg-blue-600', icon: Smile },
//     { id: 'resilience', name: 'Resilience Building', color: 'bg-blue-700', icon: Award }
//   ];

//   const filteredPrograms = wellnessPrograms.filter(program => {
//     const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
//     const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          program.description.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   const handleEnroll = (programId) => {
//     if (enrolledPrograms.includes(programId)) {
//       // Continue program
//       alert('Continuing your program...');
//     } else {
//       // Enroll in program
//       setEnrolledPrograms([...enrolledPrograms, programId]);
//       alert('Successfully enrolled! Your journey begins now.');
//     }
//   };

//   const isEnrolled = (programId) => enrolledPrograms.includes(programId);

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero Section */}
//       <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
//         <div className="max-w-4xl mx-auto text-center">
//           <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
//             Your Path to
//             <span className="block text-blue-500">Mental Wellness</span>
//           </h1>
//           <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
//             Transform your mental health with structured programs designed by experts. Track your progress, connect with peers, and build lasting habits for a healthier mind.
//           </p>
          
//           {/* Stats */}
//           <div className="flex flex-wrap justify-center gap-8 mb-12">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-blue-500">50,000+</div>
//               <div className="text-gray-600">Active Participants</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-blue-500">92%</div>
//               <div className="text-gray-600">Success Rate</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-blue-500">8</div>
//               <div className="text-gray-600">Expert-Led Programs</div>
//             </div>
//           </div>
          
//           {/* Search and Filter */}
//           <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search wellness programs..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
//               />
//             </div>
//             <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm">
//               <Filter className="w-5 h-5" />
//               Filter
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Categories */}
//       <section className="px-4 sm:px-6 lg:px-8 mb-12">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-wrap gap-3 justify-center">
//             {categories.map((category) => {
//               const IconComponent = category.icon;
//               return (
//                 <button
//                   key={category.id}
//                   onClick={() => setSelectedCategory(category.id)}
//                   className={`px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-sm flex items-center gap-2 ${
//                     selectedCategory === category.id
//                       ? `${category.color} text-white transform scale-105`
//                       : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
//                   }`}
//                 >
//                   <IconComponent className="w-4 h-4" />
//                   {category.name}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Programs Grid */}
//       <section className="px-4 sm:px-6 lg:px-8 pb-20">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredPrograms.map((program) => (
//               <div
//                 key={program.id}
//                 className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:transform hover:scale-105 hover:border-blue-200 transition-all duration-300 hover:shadow-xl shadow-sm"
//               >
//                 {/* Thumbnail */}
//                 <div className="relative h-48 overflow-hidden">
//                   <img
//                     src={program.thumbnail}
//                     alt={program.title}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
//                   {/* Price Badge */}
//                   <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
//                     program.price === 'Free' 
//                       ? 'bg-green-500 text-white' 
//                       : 'bg-yellow-500 text-white'
//                   }`}>
//                     {program.price}
//                   </div>
                  
//                   {/* Progress Bar (for enrolled users) */}
//                   {isEnrolled(program.id) && program.progress > 0 && (
//                     <div className="absolute bottom-4 left-4 right-4">
//                       <div className="bg-black/20 backdrop-blur-sm rounded-full p-2">
//                         <div className="flex items-center justify-between text-white text-sm mb-1">
//                           <span>Progress</span>
//                           <span>{program.progress}%</span>
//                         </div>
//                         <div className="w-full bg-white/20 rounded-full h-2">
//                           <div 
//                             className="bg-blue-400 h-2 rounded-full transition-all duration-300"
//                             style={{ width: `${program.progress}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Content */}
//                 <div className="p-6">
//                   <div className="flex items-center justify-between mb-3">
//                     <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
//                       {program.difficulty}
//                     </span>
//                     <div className="flex items-center gap-1 text-yellow-400">
//                       <Star className="w-4 h-4 fill-current" />
//                       <span className="text-sm text-gray-600">{program.rating}</span>
//                     </div>
//                   </div>

//                   <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
//                     {program.title}
//                   </h3>
                  
//                   <p className="text-gray-600 text-sm mb-4 leading-relaxed">
//                     {program.description}
//                   </p>

//                   <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//                     <div className="flex items-center gap-1">
//                       <Calendar className="w-4 h-4" />
//                       <span>{program.duration}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <BookOpen className="w-4 h-4" />
//                       <span>{program.modules} modules</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Users className="w-4 h-4" />
//                       <span>{program.participants.toLocaleString()}</span>
//                     </div>
//                   </div>

//                   <div className="text-sm text-gray-500 mb-4">
//                     Led by {program.instructor}
//                   </div>

//                   {/* Outcome */}
//                   <div className="bg-blue-50 p-3 rounded-lg mb-4">
//                     <p className="text-blue-700 text-sm font-medium">Expected Outcome:</p>
//                     <p className="text-blue-600 text-sm">{program.outcome}</p>
//                   </div>

//                   <button 
//                     onClick={() => handleEnroll(program.id)}
//                     className={`w-full font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:transform hover:translateY(-1px) hover:shadow-lg ${
//                       isEnrolled(program.id)
//                         ? 'bg-green-500 hover:bg-green-600 text-white'
//                         : 'bg-blue-500 hover:bg-blue-600 text-white'
//                     }`}
//                   >
//                     {isEnrolled(program.id) 
//                       ? (program.progress > 0 ? 'Continue Program' : 'Start Program')
//                       : 'Enroll Now'
//                     }
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {filteredPrograms.length === 0 && (
//             <div className="text-center py-12">
//               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Search className="w-8 h-8 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
//               <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Community Section */}
//       <section className="bg-blue-50 border-t border-blue-100 py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">
//               Join Our Wellness Community
//             </h2>
//             <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//               Connect with others on similar journeys, share experiences, and get support when you need it most.
//             </p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Users className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Peer Support Groups</h3>
//               <p className="text-gray-600">Connect with others in your program for mutual encouragement and shared experiences.</p>
//             </div>
            
//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Award className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Achievement Tracking</h3>
//               <p className="text-gray-600">Earn badges, maintain streaks, and celebrate milestones as you progress through your wellness journey.</p>
//             </div>
            
//             <div className="text-center">
//               <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Heart className="w-8 h-8 text-white" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Support</h3>
//               <p className="text-gray-600">Get guidance from licensed counselors and mental health professionals throughout your program.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Bottom CTA */}
//       <section className="bg-white py-16">
//         <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">
//             Ready to Start Your Wellness Journey?
//           </h2>
//           <p className="text-gray-600 text-lg mb-8">
//             Take the first step towards better mental health with our expert-guided programs and supportive community.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button onClick={()=> {navigate('/community'); scrollTo(0,0)}} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:transform hover:scale-105 hover:shadow-xl">
//               Join Our Community
//             </button>
//             <button onClick={()=> {navigate('/counsellors'); scrollTo(0,0)}} className="bg-white hover:bg-gray-50 text-blue-500 font-semibold py-4 px-8 rounded-xl border-2 border-blue-500 transition-all duration-200 hover:transform hover:scale-105">
//               Talk to a Counselor
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default WellnessPrograms;

import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, Users, Star, Filter, Search, BookOpen, Award, TrendingUp, Heart, Brain, Moon, Focus, Smile, Shield, Loader, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    { id: 'all', name: 'All Programs', color: 'bg-blue-500', icon: BookOpen },
    { id: 'stress', name: 'Stress Management', color: 'bg-blue-600', icon: Shield },
    { id: 'anxiety', name: 'Anxiety Relief', color: 'bg-blue-700', icon: Heart },
    { id: 'sleep', name: 'Sleep Improvement', color: 'bg-blue-800', icon: Moon },
    { id: 'growth', name: 'Personal Growth', color: 'bg-blue-400', icon: TrendingUp },
    { id: 'mindfulness', name: 'Mindfulness', color: 'bg-blue-500', icon: Brain },
    { id: 'focus', name: 'Focus & Productivity', color: 'bg-blue-900', icon: Focus },
    { id: 'depression', name: 'Depression Support', color: 'bg-blue-600', icon: Smile },
    { id: 'resilience', name: 'Resilience Building', color: 'bg-blue-700', icon: Award }
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
        toast.success('Successfully enrolled in the program!');
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

  // Format duration
  const formatDuration = (duration) => {
    if (!duration) return 'Flexible';
    return duration;
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
      {/* Hero Section with Background Image */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center')`
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-800/70 to-blue-900/90"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center text-white z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Your Path to
            <span className="block text-blue-300">Mental Wellness</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Transform your mental health with structured programs designed by experts. Track your progress, connect with peers, and build lasting habits for a healthier mind.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300">{programs.reduce((sum, p) => sum + (p.participants || 0), 0).toLocaleString()}+</div>
              <div className="text-blue-100">Active Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300">92%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300">{programs.length}</div>
              <div className="text-blue-100">Expert-Led Programs</div>
            </div>
          </div>
          
          {/* Search and Filter */}
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
            <button className="px-6 py-3 bg-blue-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-blue-500 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm border border-white/20">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-sm flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? `${category.color} text-white transform scale-105 shadow-lg`
                      : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
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
                    src={program.image || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&crop=center`}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&crop=center`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  {/* Price Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                    program.price === 0 || program.price === 'Free'
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {program.price === 0 || program.price === 'Free' ? 'Free' : `$${program.price}`}
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
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(program.difficulty)}`}>
                      {program.difficulty || 'Beginner'}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm text-gray-600">{program.rating || '4.8'}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {program.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {program.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDuration(program.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{program.modules || program.sessions || 'Multiple'} sessions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{(program.participants || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mb-4">
                    Led by {program.instructor || 'Expert Counselor'}
                  </div>

                  {/* Expected Outcome */}
                  {program.outcome && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <p className="text-blue-700 text-sm font-medium">Expected Outcome:</p>
                      <p className="text-blue-600 text-sm">{program.outcome}</p>
                    </div>
                  )}

                  <button 
                    onClick={() => handleEnroll(program._id)}
                    disabled={enrolling === program._id}
                    className={`w-full font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:transform hover:translateY(-1px) hover:shadow-lg flex items-center justify-center gap-2 ${
                      isEnrolled(program._id)
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300'
                    }`}
                  >
                    {enrolling === program._id ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Enrolling...
                      </>
                    ) : isEnrolled(program._id) ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Enrolled
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </button>
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

      {/* Community Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Wellness Community
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Connect with others on similar journeys, share experiences, and get support when you need it most.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Peer Support Groups</h3>
              <p className="text-gray-600">Connect with others in your program for mutual encouragement and shared experiences.</p>
            </div>
            
            <div className="text-center bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Achievement Tracking</h3>
              <p className="text-gray-600">Earn badges, maintain streaks, and celebrate milestones as you progress through your wellness journey.</p>
            </div>
            
            <div className="text-center bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600">Get guidance from licensed counselors and mental health professionals throughout your program.</p>
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
            Take the first step towards better mental health with our expert-guided programs and supportive community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {navigate('/community'); scrollTo(0,0)}} 
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:transform hover:scale-105 hover:shadow-xl"
            >
              Join Our Community
            </button>
            <button 
              onClick={() => {navigate('/counsellors'); scrollTo(0,0)}} 
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