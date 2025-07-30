import React, { useState, useContext } from 'react';
import { CounsellorContext } from '../../context/CounsellorContext';

const ManualAssessment = ({ selectedUserId }) => {
  const [score, setScore] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { assessUser } = useContext(CounsellorContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Basic validation
    const numericScore = parseFloat(score);
    if (!numericScore || numericScore < 1 || numericScore > 10) {
      setError('⚠️ Please enter a valid score between 1 and 10.');
      return;
    }

    setLoading(true);
    try {
      const result = await assessUser(selectedUserId, numericScore);

      if (result?.success) {
        setMessage('✅ Assessment submitted successfully.');
        setScore('');
      } else {
        setError(result?.message || '❌ Failed to submit assessment.');
      }
    } catch (error) {
      setError('An unexpected error occurred.');
      console.log(error)
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4 text-center">Manual User Assessment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User ID */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">User ID</label>
          <input
            type="text"
            value={selectedUserId}
            readOnly
            className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Score Input */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Score (1–10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter score"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit Assessment'}
        </button>

        {/* Message Display */}
        {message && <p className="mt-4 text-center text-green-600 font-medium">{message}</p>}
        {error && <p className="mt-4 text-center text-red-600 font-medium">{error}</p>}
      </form>
    </div>
  );
};

export default ManualAssessment;
