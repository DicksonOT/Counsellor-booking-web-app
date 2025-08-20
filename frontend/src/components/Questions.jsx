import React from 'react';
import { BookOpen, Lock, CheckCircle2, Sparkles } from 'lucide-react';

const MentalAssessment = ({ questions, answers, handleAnswerChange, isAssessmentComplete, handleAssessmentSubmit, isSubmitting }) => {
  return (
    <div className="max-w-5xl mx-auto transform transition-all duration-700">
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="relative p-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <BookOpen className="w-16 h-16 text-blue-600 mx-auto animate-bounce" />
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
            </div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Mind Wellness Check
            </h2>
            <p className="text-lg text-gray-700">Reflect on how you're feeling in these key areas.</p>
            <div className="flex justify-center mt-2 text-purple-600">
              <Lock className="w-5 h-5 mr-2" />
              <span>Protected & Private</span>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-10">
            {questions.map((q, idx) => {
              const Icon = q.icon;
              const isAnswered = answers[q.id] !== undefined;

              return (
                <div key={q.id} className="bg-white/30 p-6 rounded-2xl">
                  <div className="flex items-start space-x-6 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isAnswered ? 'bg-green-500 text-white' : 'bg-white text-gray-600 border'
                    }`}>
                      {isAnswered ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{q.text}</h3>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = answers[q.id] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleAnswerChange(q.id, val)}
                          className={`p-3 rounded-xl font-semibold text-left transition ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                              : 'bg-white/50 text-gray-800 hover:bg-white'
                          }`}
                        >
                          {val} - {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"][val - 1]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div className="mt-10 text-center">
            <button
              onClick={handleAssessmentSubmit}
              disabled={!isAssessmentComplete || isSubmitting}
              className={`px-10 py-4 rounded-2xl font-black text-lg ${
                isAssessmentComplete
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="inline w-5 h-5 mr-2" />
                  Complete My Assessment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalAssessment;
