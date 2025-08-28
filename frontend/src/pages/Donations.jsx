import React, { useState, useContext, useEffect } from 'react';
import { Heart, Users, Star, Check, ArrowRight, DollarSign, Loader2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const DonatePage = () => {
  const { 
    processDonationPayment, 
    getUserDonationHistory, 
    cancelMonthlyDonation,
    token,
    userData 
  } = useContext(AppContext);

  const [selectedAmount, setSelectedAmount] = useState('25');
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [donationType, setDonationType] = useState('one-time');
  const [isLoading, setIsLoading] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: ''
  });
  const [showDonorForm, setShowDonorForm] = useState(false);
  const [donationHistory, setDonationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const predefinedAmounts = ['10', '25', '50', '100', '250'];

  const successStories = [
    {
      name: "Sarah M.",
      age: "28",
      story: "After losing my job during the pandemic, I fell into deep depression. The free counseling sessions helped me rebuild my confidence and find purpose again.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      outcome: "Now working as a social worker, helping others in similar situations"
    },
    {
      name: "Marcus T.",
      age: "35",
      story: "Struggling with anxiety and panic attacks was destroying my relationships. Through our platform, I learned coping strategies that changed my life.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      outcome: "Anxiety reduced by 80%, stronger family relationships"
    },
    {
      name: "Elena R.",
      age: "22",
      story: "As a college student dealing with trauma, I couldn't afford therapy. The donated sessions helped me heal and graduate with honors.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      outcome: "Graduated summa cum laude, now pursuing her master's degree"
    }
  ];

  const impactStats = [
    { number: "2,547", label: "Lives Touched", icon: Users },
    { number: "89%", label: "Success Rate", icon: Star },
    { number: "$50", label: "Avg. Cost per Session", icon: DollarSign },
    { number: "156", label: "Counsellors", icon: Heart }
  ];

  // Initialize donor info from user data if available
  useEffect(() => {
    if (userData) {
      setDonorInfo({
        name: userData.name || '',
        email: userData.email || ''
      });
    }
  }, [userData]);

  // Fetch donation history when component mounts if user is logged in
  useEffect(() => {
    if (token) {
      fetchDonationHistory();
    }
  }, [token]);

  const fetchDonationHistory = async () => {
    if (!token) return;
    
    setIsLoadingHistory(true);
    try {
      const response = await getUserDonationHistory();
      console.log('Donation history response:', response); // Debug log
      
      if (response && response.success) {
        setDonationHistory(response.donations || []);
      } else {
        console.error('Failed to fetch donation history:', response);
        toast.error('Failed to load donation history');
      }
    } catch (error) {
      console.error('Error fetching donation history:', error);
      toast.error('Error loading donation history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setSelectedAmount('');
    setIsCustom(true);
  };

  const handleDonorInfoChange = (field, value) => {
    setDonorInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateDonation = () => {
    const amount = getCurrentAmount();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please select or enter a valid donation amount');
      return false;
    }

    if (parseFloat(amount) < 5) {
      toast.error('Minimum donation amount is $5');
      return false;
    }

    if (!donorInfo.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }

    if (!donorInfo.email.trim()) {
      toast.error('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(donorInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleDonate = async () => {
    if (!validateDonation()) {
      return;
    }

    setIsLoading(true);

    try {
      const amount = parseFloat(getCurrentAmount());
      
      await processDonationPayment(
        amount,
        donationType,
        donorInfo.email,
        donorInfo.name
      );
      
    } catch (error) {
      console.error('Donation error:', error);
      toast.error('Failed to process donation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (window.confirm('Are you sure you want to cancel this monthly donation subscription?')) {
      try {
        const response = await cancelMonthlyDonation(subscriptionId);
        if (response && response.success) {
          toast.success('Subscription cancelled successfully');
          // Refresh donation history
          fetchDonationHistory();
        } else {
          toast.error('Failed to cancel subscription');
        }
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        toast.error('Error cancelling subscription');
      }
    }
  };

  const getCurrentAmount = () => {
    return isCustom ? customAmount : selectedAmount;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDonationType = (donation) => {
    // Handle different ways the type might be stored
    const type = donation.donationType || donation.type;
    const isRecurring = donation.isRecurring;
    
    if (type === 'monthly' || isRecurring) {
      return 'Monthly Donation';
    }
    return 'One-time Donation';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative text-blue-500">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
          style={{
            backgroundImage: `url('https://donatestuff.com/wp-content/uploads/2023/01/donate-clothes-compressor.jpeg')`
          }}
        ></div>
        <div className="absolute inset-0 "></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Heart className="h-5 w-5 fill-current" />
            <span className="text-sm font-medium">Make a Difference Today</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Help Us Help Others
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Your donation provides free mental health support to those who need it most but can't afford it
          </p>
          
          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-2">
                  <stat.icon className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold">{stat.number}</div>
                </div>
                <div className="text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lives We've Transformed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real people whose lives were changed through your generosity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {successStories.map((story, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={story.image} 
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-600">Age {story.age}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">"{story.story}"</p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-800 font-medium">{story.outcome}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donation Form */}
      <div className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-16">

         {/* Show donation history button for logged-in users */}
          {token && (
            <div className="m-8 lg:ml-72">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-white/20 text-xl backdrop-blur-sm hover:bg-blue-500 hover:text-white text-blue-500 px-6 py-2 border border-blue-500 rounded-lg transition-colors duration-200"
              >
                {showHistory ? 'Hide' : 'View'} My Donation History
              </button>
            </div>
          )}


      {/* Donation History Section */}
      {showHistory && token && (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Donation History</h3>
            
            {isLoadingHistory ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                <p className="text-gray-600">Loading donation history...</p>
              </div>
            ) : donationHistory && donationHistory.length > 0 ? (
              <div className="space-y-4">
                {donationHistory.map((donation, index) => (
                  <div key={donation._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(donation.amount)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getDonationType(donation)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {formatDate(donation.createdAt)}
                      </div>
                      {donation.completedAt && (
                        <div className="text-xs text-gray-500">
                          Completed: {formatDate(donation.completedAt)}
                        </div>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        donation.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : donation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {donation.status}
                      </div>
                      {donation.stripeSubscriptionId && donation.status === 'completed' && (
                        <button
                          onClick={() => handleCancelSubscription(donation.stripeSubscriptionId)}
                          className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors"
                        >
                          Cancel Subscription
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No donations found. Make your first donation below!
              </p>
            )}
          </div>
        </div>
      )}

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Make Your Donation
            </h2>
            <p className="text-xl text-gray-600">
              Every dollar makes a difference in someone's mental health journey
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            {/* Donation Type */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDonationType('one-time')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    donationType === 'one-time'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">One-time</div>
                  <div className="text-sm text-gray-600">Make a single donation</div>
                </button>
                <button
                  onClick={() => setDonationType('monthly')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    donationType === 'monthly'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">Monthly</div>
                  <div className="text-sm text-gray-600">Recurring support</div>
                </button>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Amount</h3>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                {predefinedAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedAmount === amount && !isCustom
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="font-bold text-lg">${amount}</div>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Custom amount:</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32"
                    min="5"
                    step="1"
                  />
                </div>
              </div>
            </div>

            {/* Donor Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donor Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={donorInfo.name}
                    onChange={(e) => handleDonorInfoChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={donorInfo.email}
                    onChange={(e) => handleDonorInfoChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Impact Message */}
            {getCurrentAmount() && parseFloat(getCurrentAmount()) > 0 && (
              <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Your Impact</h4>
                <p className="text-blue-800">
                  ${getCurrentAmount()} can provide {Math.floor(parseFloat(getCurrentAmount()) / 50)} free counseling session{Math.floor(parseFloat(getCurrentAmount()) / 50) !== 1 ? 's' : ''} to someone in need.
                  {donationType === 'monthly' && (
                    <span className="block mt-1">
                      That's {Math.floor(parseFloat(getCurrentAmount()) / 50) * 12} sessions per year!
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Donate Button */}
            <button
              onClick={handleDonate}
              disabled={!getCurrentAmount() || isLoading || !donorInfo.name.trim() || !donorInfo.email.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5 fill-current" />
                  Donate ${getCurrentAmount()} {donationType === 'monthly' ? '/month' : 'now'}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Your donation is secure and tax-deductible. You'll receive a receipt via email.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Together, We Can Make Mental Health Care Accessible
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of donors who believe everyone deserves access to mental health support, regardless of their financial situation.
          </p>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-blue-200">Goes to Care</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-blue-200">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">Safe</div>
              <div className="text-sm text-blue-200">& Secure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;