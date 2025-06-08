import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Info = () => {
  const {counsellors} = useContext(AppContext)
  return (
    <div className="bg-white">
      <div className="relative lg:h-90 w-full rounded-lg px-5 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
        <div>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight md:leading-tight lg:leading-tight pt-10">
            Our vision
            <hr className="border-t-2 border-blue-400 my-4 w-16" />
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our vision is to revolutionize mental health support by providing
            accessible, affordable, and compassionate care to individuals
            worldwide. We aim to bridge the gap to timely and effective support
            through our innovative web-based AI chatbot, offering empathetic
            listening, personalized coping strategies, and connections to local
            therapists. <br />
            <br />
            By harnessing the power of technology and human-centered design, we
            envision a future where mental wellness is within reach for all,
            empowering individuals to thrive and live healthier and happier
            lives.
          </p>
        </div>

        <div>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight md:leading-tight lg:leading-tight pt-10">
            What We Do
            <hr className="border-t-2 border-blue-400 my-4 w-16" />
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We provide a safe, supportive and non-judgmental space for
            individuals to access mental health support, whenever and wherever
            they need it.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>AI-Powered Chatbot:</strong> Our innovative chatbot uses natural language
                processing to offer empathetic listening, personalized coping
                strategies and emotional support.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Personalized Resources:</strong> We connect users with relevant resources,
                including local therapists and mental health professionals.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>
                <strong>Mental Health Tools:</strong> Our platform provides access to a range of
                mental health tools, including mood-tracking, mindfulness
                exercises and stress-management techniques.
              </span>
            </li>
          </ul>
        </div>
      </div>
            {/* Stats Bar */}
      <div className="bg-blue-100 py-12 px-5 mt-5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600 text-sm md:text-base">Users Supported</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600 text-sm md:text-base">Available Support</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-gray-600 text-sm md:text-base">User Satisfaction</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{counsellors.length}</div>
            <div className="text-gray-600 text-sm md:text-base">Partner Therapists</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;