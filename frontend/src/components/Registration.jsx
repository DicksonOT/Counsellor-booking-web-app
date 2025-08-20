import React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Shield, Star, Award, CheckCircle, ArrowRight } from 'lucide-react';

const RegisterCounsellor = () => {
  const navigate = useNavigate()
  const { stats, benefits, counsellors } = useContext(AppContext)

  const handleGetStarted = () => {
    navigate('/signup/step-1')
    window.scrollTo(0, 0)
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 lg:py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Trusted by Mental Health Professionals
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Join <span className="text-transparent bg-clip-text bg-blue-500">Quiet Place</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Help people on their mental wellness journey while enjoying professional freedom,
              meaningful work, and comprehensive support from our platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleGetStarted}
                className="group  bg-blue-500 hover:from-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-gray-600">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-r  bg-blue-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm">Join 500+ counsellors</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {counsellors.length } +
              </div>
              <div className="text-gray-600 font-medium">
                Active Counsellors
              </div>
            </div>

            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>


          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r  bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Why Mental Health Professionals Choose Us
              </h2>
              <p className="text-gray-600">
                Join a platform designed with counsellors, for counsellors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Certified Platform</h3>
                <p className="text-sm text-gray-600">HIPAA compliant and professionally accredited</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-blue-600 fill-current" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Top Rated</h3>
                <p className="text-sm text-gray-600">4.9/5 rating from our counsellor community</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-600">End-to-end encryption for all sessions</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r bg-blue-500 rounded-2xl p-8 text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Start your journey with Quiet Place today. Our simple onboarding process
              will have you helping clients within days.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="group bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
              >
                Begin Application
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-blue-100">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">Free to join • No setup fees</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">
              Questions? Contact our team at{' '}
              <a href="thequietplace.contact@gmail.com" className="text-blue-600 hover:underline">
                thequietplace.contact@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCounsellor;
