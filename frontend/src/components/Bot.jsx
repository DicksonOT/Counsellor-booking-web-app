import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { AppContext } from '../context/AppContext';

const Chatbot = () => {
  const {chatbotAssessment, userData} = useContext(AppContext)
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const chatboxRef = useRef(null);
  const { token } = useContext(AppContext);
  const navigate = useNavigate(); 

  // Initialize welcome message
  useEffect(() => {
    const userName = userData?.name || 'there';
    const welcomeMessage = {
      sender: 'bot',
      text: `Hello ${userName}! 👋 I'm QuietPlace Guide, your compassionate virtual companion here to support you on your mental wellness journey. This is a safe space where you can share your thoughts, ask questions about mental health, or simply talk about what's on your mind. I'm here to listen and help however I can. What would you like to talk about today?`,
      isWelcome: true
    };
    
    // Only set welcome message if messages array is empty
    setMessages(prevMessages => {
      if (prevMessages.length === 0) {
        return [welcomeMessage];
      }
      return prevMessages;
    });
  }, [userData]);

  // Auto-scroll to the bottom of the chatbox when messages update
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      chatbotAssessment();
    }, 180000); // 3 mins

    return () => clearTimeout(timer); 
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]); 

  const sendMessage = async () => {
    const userMessage = inputValue.trim();
    if (userMessage === '') return;

    // Add user message to state and clear input
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('msg', userMessage);

      const response = await fetch('http://localhost:8080/get', {
        method: 'POST',
        body: formData});

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const botResponse = await response.text(); // Flask returns plain text
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: botResponse }]);

    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      let errorMessage = 'An internal error occurred. Please try again later.';

      // Check for specific error messages from the backend (as defined in app.py)
      if (error.message.includes("quota") || error.message.includes("resourceexhausted")) {
        errorMessage = "Apologies, the chatbot is currently experiencing high demand. Please try again later.";
      } else if (error.message.includes("Failed to set up Pinecone")) {
        errorMessage = "Chatbot is facing issues connecting to the knowledge base. Please try again later.";
      } else if (error.message.includes("Failed to initialize Gemini LLM")) {
        errorMessage = "Chatbot is unable to connect to the AI model. Please try again later.";
      } else if (error.message.includes("Failed to create RAG chains")) {
        errorMessage = "Chatbot's internal processing is misconfigured. Please try again later.";
      } else if (error.message.includes("Server error")) {
        errorMessage = `Chatbot server responded with an error: ${error.message.split(' - ')[0].replace('Server error: ', '')}.`;
      }

      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !isLoading) { // Prevent sending multiple messages while loading
      sendMessage();
    }
  };

  // Render nothing if token is not present, letting the useEffect handle navigation
  if (!token) {
    return null;
  }

  return (
    <div className="flex flex-col w-full h-[590px] lg:h-[790px] shadow-lg overflow-hidden lg:mt-28">
      <div className="bg-blue-500 text-white p-4 text-center text-lg font-semibold rounded-t-lg">
        Talk to QuietPlace Guide
      </div>
      <div ref={chatboxRef} className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 mx-7">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${msg.isWelcome ? 'flex justify-center items-center' : 'flex'} ${
              !msg.isWelcome && msg.sender === 'user' ? 'justify-end' : !msg.isWelcome ? 'justify-start' : ''
            }`}
          >
            <div
              className={`p-3 rounded-2xl break-words shadow-sm inline-block max-w-[50%] ${
                msg.isWelcome 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border border-blue-200 text-center' 
                  : msg.sender === 'user' 
                    ? 'bg-blue-500 text-white border border-blue-500' 
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 border border-blue-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 p-3 rounded-2xl shadow-sm border border-blue-200 inline-block max-w-[50%]">
              Typing...
            </div>
          </div>
        )}
      </div>
      <div className="flex p-4 border-t border-gray-300 bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Share your thoughts or ask about mental wellness..."
          className="flex-grow p-3 border border-gray-300 rounded-full mr-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading} // Disable input while loading
        />
        <button
          onClick={sendMessage}
          className={`rounded-full px-5 py-2 cursor-pointer text-base font-medium transition-all duration-300 shadow-md
            ${isLoading ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;