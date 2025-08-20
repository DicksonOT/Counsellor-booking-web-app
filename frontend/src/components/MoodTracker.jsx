import React from 'react';
import { Calendar, Sparkles, Heart } from 'lucide-react';

const MoodTracker = ({ moods, selectedMood, setSelectedMood, note, setNote, handleMoodSubmit, isSubmitting }) => {
  const selectedMoodData = moods.find((m) => m.value === selectedMood);

  return (
    <div className="max-w-4xl mx-auto transform transition-all duration-700">
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="relative p-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500"></div>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <Calendar className="w-16 h-16 text-blue-500 mx-auto animate-bounce" />
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
            </div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent mb-4">
              How's Your Vibe Today?
            </h2>
            <p className="text-lg text-gray-700">Choose the energy that resonates with your current state</p>
          </div>

          {/* Mood Picker */}
          <div className="grid grid-cols-5 gap-6 mb-10">
            {moods.map((mood, index) => (
              <div key={mood.value} className="transform transition-all duration-300 hover:scale-110">
                <button
                  onClick={() => setSelectedMood(mood.value)}
                  className={`relative w-full p-6 rounded-2xl transition-all duration-300 group ${
                    selectedMood === mood.value
                      ? `bg-gradient-to-br ${mood.color} text-white shadow-2xl transform scale-105`
                      : 'bg-white/50 backdrop-blur-md hover:bg-white/70 border border-white/30 shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <span className="text-5xl">{mood.label}</span>
                    <span className={`font-bold text-sm ${selectedMood === mood.value ? 'text-white' : 'text-gray-700'}`}>
                      {mood.name}
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Selected Mood Summary */}
          {selectedMoodData && (
            <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-r ${selectedMoodData.color} animate-pulse text-white`}>
              <div className="flex items-center justify-center">
                <span className="text-3xl mr-4">{selectedMoodData.label}</span>
                <div>
                  <p className="font-bold text-lg">Feeling {selectedMoodData.name} Today!</p>
                  <p className="text-sm">Your emotional awareness is powerful ✨</p>
                </div>
              </div>
            </div>
          )}

          {/* Note Input */}
          <div className="mb-8">
            <label className="flex items-center text-lg font-bold text-blue-500 mb-4">
              <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
              Share Your Thoughts
            </label>
            <textarea
              placeholder="What's flowing through your mind right now?"
              className="w-full p-6 border-2 border-purple-200 rounded-2xl bg-white/50 h-32 text-gray-700 placeholder-gray-500"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleMoodSubmit}
            disabled={!selectedMood || isSubmitting}
            className={`relative w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 overflow-hidden ${
              selectedMood && !isSubmitting
                ? 'bg-gradient-to-r from-purple-400 to-blue-500 hover:from-blue-400 hover:to-blue-500 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                Capturing Your Vibe...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Heart className="w-6 h-6 mr-3" />
                Track My Energy
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
