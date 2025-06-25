import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext'; 

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chatboxRef = useRef(null);
  const { token } = useContext(AppContext); 
  const navigate = useNavigate();

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]); 


  const sendMessage = async () => {
    const userMessage = inputValue.trim();
    if (userMessage === '') return;

    // Add user message to state
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: userMessage }]);
    setInputValue(''); // Clear input field immediately

    try {
      const formData = new FormData();
      formData.append('msg', userMessage);

      const response = await fetch('http://localhost:8080/get', {
        method: 'POST',
        body: formData,
      });

      const botResponse = await response.text(); // Flask returns plain text
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: botResponse }]);

    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Error: ${error.message || 'Could not get a response. Please try again.'}` }]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="flex flex-col w-full max-w-md h-[600px] border border-gray-300 rounded-lg shadow-lg overflow-hidden font-sans mx-auto my-5">
      <div className="bg-blue-500 text-white p-4 text-center text-lg font-semibold rounded-t-lg">
        Talk to QuietPlace Guide
      </div>
      <div ref={chatboxRef} className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-2xl max-w-[80%] break-words shadow-sm
              ${msg.sender === 'user' ? 'self-end bg-blue-100 text-gray-800' : 'self-start bg-gray-200 text-gray-800'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex p-4 border-t border-gray-300 bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about mental health..."
          className="flex-grow p-3 border border-gray-300 rounded-full mr-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white rounded-full px-5 py-2 cursor-pointer text-base font-medium transition-all duration-300 hover:bg-blue-700 shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
