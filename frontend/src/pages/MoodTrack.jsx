import React, { useContext, useState } from 'react';
import { Brain, ChevronRight, CheckCircle2 } from 'lucide-react';
import MoodTracker from '../components/MoodTracker'
import MentalAssessment from '../components/Questions';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const moods = [
  { label: '😄', value: 'happy', name: 'Happy', color: 'from-yellow-400 to-orange-500' },
  { label: '🙂', value: 'content', name: 'Content', color: 'from-green-400 to-blue-500' },
  { label: '😐', value: 'neutral', name: 'Neutral', color: 'from-gray-400 to-gray-600' },
  { label: '😟', value: 'anxious', name: 'Anxious', color: 'from-orange-400 to-red-500' },
  { label: '😢', value: 'sad', name: 'Sad', color: 'from-blue-400 to-purple-600' },
];

const questions = [
  { id: 1, text: "I feel overwhelmed with daily tasks.", type: "negative", icon: Brain },
  { id: 2, text: "I find it hard to sleep or concentrate.", type: "negative", icon: Brain },
  { id: 3, text: "I feel hopeful about the future.", type: "positive", icon: Brain },
  { id: 4, text: "I feel connected to people around me.", type: "positive", icon: Brain },
  { id: 5, text: "I enjoy the things I used to enjoy.", type: "positive", icon: Brain },
];

const MoodTrackerApp = () => {
  const {backendUrl, token} = useContext(AppContext)
  const [currentView, setCurrentView] = useState('mood');
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({ mood: false, assessment: false });

const handleAssessmentSubmit = async () => {
  if (!isAssessmentComplete) return alert("Please answer all questions.");
  setIsSubmitting(true);

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);

  try {
    const {data} = await axios.post(`${backendUrl}/api/user/submit-assessment`, { answers, totalScore, timestamp: new Date()}, {headers: {token}});

    if (data.success                                                           ) {
      console.log('worked')
      toast.success(data.message)
      setCompletedSteps(prev => ({ ...prev, assessment: true }));
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    console.error(error);
    alert("Error submitting assessment.");
  } finally {
    setIsSubmitting(false);
  }
};

const handleMoodSubmit = async () => {
  if (!selectedMood) return alert("Select a mood first!");
  setIsSubmitting(true);

  try {
    const {data}= await axios.post(`${backendUrl}/api/user/add-mood`, { mood: selectedMood, note, timestamp: new Date()}, {headers: {token}});

    if (data.success) {
      toast.success(data.message)
      setCompletedSteps(prev => ({ ...prev, mood: true }));
      setSelectedMood('');
      setNote('');
      setTimeout(() => setCurrentView('assessment'), 1000);
    }
  } catch (error) {
    console.error(error);
    alert("Error tracking mood.");
  } finally {
    setIsSubmitting(false);
  }
};

const handleAnswerChange = (questionId, value) => {
  setAnswers(prevAnswers => ({
    ...prevAnswers,
    [questionId]: value,
  }));
};

  const isAssessmentComplete = Object.keys(answers).length === questions.length;

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r bg-blue-500 shadow-xl">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r bg-blue-500 mt-4">You're HOME</h1>
        <p className="text-gray-600 mt-2">Your mental health matters. Start your check-in below.</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mb-10">
        <button onClick={() => setCurrentView('mood')} className={`px-4 py-2 rounded-xl font-bold ${
          currentView === 'mood' ? 'bg-gradient-to-r bg-blue-500 text-white' : 'bg-white'
        }`}>
          Mood Tracker
        </button>
        <button onClick={() => setCurrentView('assessment')} className={`px-4 py-2 rounded-xl font-bold ${
          currentView === 'assessment' ? 'bg-gradient-to-r from-blue-600 to-blue-500  text-white' : 'bg-white'
        }`}>
          Assessment
        </button>
      </div>

      {/* Render Components */}
      {currentView === 'mood' && (
        <MoodTracker
          moods={moods}
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
          note={note}
          setNote={setNote}
          handleMoodSubmit={handleMoodSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {currentView === 'assessment' && (
        <MentalAssessment
          questions={questions}
          answers={answers}
          handleAnswerChange={handleAnswerChange}
          isAssessmentComplete={isAssessmentComplete}
          handleAssessmentSubmit={handleAssessmentSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default MoodTrackerApp;
