import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { Loader2 } from 'lucide-react';

const MoodHistory = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMoodHistory = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/mood-history`, {
        headers: { token },
      });

      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Error fetching mood history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="animate-spin text-blue-500 w-6 h-6" />
      </div>
    );
  }

  if (!history.length) {
    return <p className="text-center text-gray-500">No mood history found.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Mood History</h2>
      <ul className="space-y-4">
        {history.map((entry, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="text-lg font-semibold capitalize">{entry.mood}</p>
              {entry.note && <p className="text-sm text-gray-600">{entry.note}</p>}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(entry.date).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodHistory;
