import React, { useContext, useEffect, useState } from "react";
import { CounsellorContext } from "../../context/CounsellorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const CounsellorProfile = () => {
  const { profileData, counsellorInfo, cToken, setCounsellorInfo, backendUrl } =
    useContext(CounsellorContext);
  const { currency } = useContext(AppContext);
  
  const [isEdit, setIsEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Session type options
  const sessionTypes = [
    { value: 'online', label: 'Online Only', icon: '💻', description: 'Video/Phone sessions' },
    { value: 'physical', label: 'In-Person Only', icon: '🏢', description: 'Office visits only' },
    { value: 'hybrid', label: 'Hybrid', icon: '🔄', description: 'Both online & in-person' }
  ];

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!counsellorInfo.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!counsellorInfo.degree?.trim()) {
      newErrors.degree = "Degree is required";
    }

    if (!counsellorInfo.specialty?.trim()) {
      newErrors.specialty = "Specialty is required";
    }

    if (!counsellorInfo.experience?.trim()) {
      newErrors.experience = "Experience is required";
    }

    if (!counsellorInfo.about?.trim()) {
      newErrors.about = "About section is required";
    }

    if (!counsellorInfo.fees || counsellorInfo.fees <= 0) {
      newErrors.fees = "Valid fees amount is required";
    }

    if (!counsellorInfo.location?.trim()) {
      newErrors.location = "Location is required";
    }

    if (!counsellorInfo.sessionType) {
      newErrors.sessionType = "Session type is required";
    }

    // Validate preferred slots
    if (counsellorInfo.preferredSlots?.length > 0) {
      const slotErrors = [];
      counsellorInfo.preferredSlots.forEach((slot, index) => {
        const slotError = {};
        if (!slot.start) slotError.start = "Start time is required";
        if (!slot.end) slotError.end = "End time is required";
        
        // Validate that end time is after start time
        if (slot.start && slot.end && slot.start >= slot.end) {
          slotError.time = "End time must be after start time";
        }

        if (Object.keys(slotError).length > 0) {
          slotErrors[index] = slotError;
        }
      });
      if (slotErrors.length > 0) {
        newErrors.preferredSlots = slotErrors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", counsellorInfo.name.trim());
      formData.append("degree", counsellorInfo.degree.trim());
      formData.append("specialty", counsellorInfo.specialty.trim());
      formData.append("experience", counsellorInfo.experience.trim());
      formData.append("about", counsellorInfo.about.trim());
      formData.append("fees", counsellorInfo.fees);
      formData.append("location", counsellorInfo.location.trim());
      formData.append("available", counsellorInfo.available);
      formData.append("sessionType", counsellorInfo.sessionType || "online");
      formData.append("preferredSlots", JSON.stringify(counsellorInfo.preferredSlots || []));
      
      // Only append image if a new one was selected
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/counsellor/update-profile`,
        formData,
        { 
          headers: { 
            cToken,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully");
        await profileData(); // Refresh profile data
        setIsEdit(false);
        setImageFile(null);
        setImagePreview("");
        setErrors({});
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while updating profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setImageFile(null);
    setImagePreview("");
    setErrors({});
    // Reset form data to original values
    profileData();
  };

  const addPreferredSlot = () => {
    const newSlots = [...(counsellorInfo.preferredSlots || [])];
    newSlots.push({ start: "", end: "", note: "" });
    setCounsellorInfo(prev => ({ ...prev, preferredSlots: newSlots }));
  };

  const removePreferredSlot = (index) => {
    const newSlots = counsellorInfo.preferredSlots.filter((_, i) => i !== index);
    setCounsellorInfo(prev => ({ ...prev, preferredSlots: newSlots }));
    
    // Clear slot-specific errors
    if (errors.preferredSlots) {
      const newSlotErrors = [...errors.preferredSlots];
      newSlotErrors.splice(index, 1);
      setErrors(prev => ({ ...prev, preferredSlots: newSlotErrors }));
    }
  };

  const updatePreferredSlot = (index, field, value) => {
    const newSlots = [...counsellorInfo.preferredSlots];
    newSlots[index][field] = value;
    setCounsellorInfo(prev => ({ ...prev, preferredSlots: newSlots }));

    // Clear specific slot errors when user starts typing
    if (errors.preferredSlots && errors.preferredSlots[index]) {
      const newSlotErrors = [...errors.preferredSlots];
      if (newSlotErrors[index]) {
        delete newSlotErrors[index][field];
        if (field === 'start' || field === 'end') {
          delete newSlotErrors[index]['time'];
        }
        setErrors(prev => ({ ...prev, preferredSlots: newSlotErrors }));
      }
    }
  };

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  useEffect(() => {
    if (cToken) {
      profileData();
    }
  }, [cToken]);

  // Show loading state if counsellorInfo is not loaded
  if (!counsellorInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium text-lg">Loading your profile...</p>
          <p className="text-blue-400 text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Professional Profile
          </h1>
          <p className="text-blue-600/70 text-lg">Manage your counselling practice information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Image and Availability */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Image */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="relative">
                {isEdit ? (
                  <label htmlFor="image" className="block">
                    <div className="relative cursor-pointer group">
                      <img
                        className="w-full aspect-square object-cover rounded-2xl transition-all duration-300 group-hover:opacity-75 shadow-md"
                        src={imagePreview || counsellorInfo.image}
                        alt="Profile Preview"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 rounded-2xl">
                        <div className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium shadow-lg">
                          📷 Change Photo
                        </div>
                      </div>
                    </div>
                    <input 
                      onChange={handleImageChange} 
                      type="file" 
                      id="image" 
                      accept="image/*"
                      hidden 
                    />
                  </label>
                ) : (
                  <img 
                    className="w-full aspect-square object-cover rounded-2xl shadow-md" 
                    src={counsellorInfo.image} 
                    alt="Profile" 
                  />
                )}
                
                {/* Professional Badge */}
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl shadow-lg">
                  <span className="text-lg">👨‍⚕️</span>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📅</span>
                Availability Status
              </h3>
              
              <div className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                counsellorInfo.available 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
              }`}>
                <input
                  onChange={(e) => {
                    if (isEdit) {
                      setCounsellorInfo(prev => ({
                        ...prev,
                        available: e.target.checked,
                      }));
                    }
                  }}
                  checked={counsellorInfo.available}
                  type="checkbox"
                  id="availability"
                  disabled={!isEdit}
                  className={`w-6 h-6 text-blue-600 bg-white border-2 border-blue-300 rounded-lg focus:ring-blue-500 focus:ring-2 transition-all ${
                    !isEdit ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-400"
                  }`}
                />
                <label
                  htmlFor="availability"
                  className={`font-medium select-none flex-1 ${
                    isEdit ? "cursor-pointer" : "cursor-default"
                  } ${counsellorInfo.available ? 'text-green-800' : 'text-red-800'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {counsellorInfo.available ? "🟢" : "🔴"}
                    </span>
                    <span>
                      {counsellorInfo.available
                        ? "Available for appointments"
                        : "Currently unavailable"
                      }
                    </span>
                  </div>
                </label>
              </div>
              
              <p className="text-xs text-blue-600/70 mt-3 leading-relaxed">
                {isEdit 
                  ? "Toggle to set your availability status for new appointments. This helps clients know if you're accepting new bookings."
                  : "Your current availability status for accepting new appointments and client inquiries."
                }
              </p>
            </div>

            {/* Session Type */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                Session Type <span className="text-red-500">*</span>
              </h3>
              
              {isEdit ? (
                <div className="space-y-3">
                  {sessionTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        counsellorInfo.sessionType === type.value
                          ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md'
                          : 'border-blue-100 hover:border-blue-300 hover:bg-blue-50/50'
                      } ${errors.sessionType ? 'border-red-300' : ''}`}
                    >
                      <input
                        type="radio"
                        name="sessionType"
                        value={type.value}
                        checked={counsellorInfo.sessionType === type.value}
                        onChange={(e) => {
                          setCounsellorInfo(prev => ({ ...prev, sessionType: e.target.value }));
                          clearFieldError('sessionType');
                        }}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{type.icon}</span>
                          <span className="font-semibold text-blue-800">{type.label}</span>
                        </div>
                        <p className="text-sm text-blue-600/70">{type.description}</p>
                      </div>
                    </label>
                  ))}
                  {errors.sessionType && (
                    <p className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg border border-red-200">
                      {errors.sessionType}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  {sessionTypes.find(type => type.value === counsellorInfo.sessionType) ? (
                    <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <span className="text-2xl mr-4">
                        {sessionTypes.find(type => type.value === counsellorInfo.sessionType)?.icon}
                      </span>
                      <div>
                        <p className="font-bold text-blue-800 text-lg">
                          {sessionTypes.find(type => type.value === counsellorInfo.sessionType)?.label}
                        </p>
                        <p className="text-blue-600/70 text-sm">
                          {sessionTypes.find(type => type.value === counsellorInfo.sessionType)?.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-blue-500 italic bg-blue-50 p-3 rounded-xl border border-blue-200">
                      Session type not specified
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
              {/* Name */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  Full Name <span className="text-red-500">*</span>
                </label>
                {isEdit ? (
                  <div>
                    <input
                      type="text"
                      value={counsellorInfo.name || ""}
                      onChange={(e) => {
                        setCounsellorInfo(prev => ({ ...prev, name: e.target.value }));
                        clearFieldError('name');
                      }}
                      className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 bg-white/80 border-b-3 ${
                        errors.name ? 'border-red-300 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'
                      } outline-none pb-2 w-full transition-all duration-300 placeholder:text-blue-300`}
                      placeholder="Enter your full name"
                    />
                    <p className="text-xs text-blue-600/70 mt-2 bg-blue-50/50 p-2 rounded-lg">
                      Your professional name as it appears on your credentials and will be shown to clients
                    </p>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg border border-red-200">
                        {errors.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {counsellorInfo.name}
                    </h1>
                    <p className="text-xs text-blue-600/70 mt-2">Professional name</p>
                  </div>
                )}
              </div>

              {/* Degree, Specialty, and Experience */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">🎓</span>
                  Professional Qualifications <span className="text-red-500">*</span>
                </label>
                {isEdit ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-blue-700 mb-1">Degree/Qualification</label>
                      <input
                        type="text"
                        value={counsellorInfo.degree || ""}
                        onChange={(e) => {
                          setCounsellorInfo(prev => ({ ...prev, degree: e.target.value }));
                          clearFieldError('degree');
                        }}
                        className={`w-full py-3 px-4 border-2 ${
                          errors.degree ? 'border-red-300 focus:border-red-500' : 'border-blue-200 focus:border-blue-400'
                        } rounded-xl focus:outline-none bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder:text-blue-300`}
                        placeholder="e.g., MSc Psychology, PhD Clinical Psychology"
                      />
                      {errors.degree && (
                        <p className="text-red-500 text-xs mt-1 bg-red-50 p-2 rounded-lg">
                          {errors.degree}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-blue-700 mb-1">Specialization</label>
                      <input
                        type="text"
                        value={counsellorInfo.specialty || ""}
                        onChange={(e) => {
                          setCounsellorInfo(prev => ({ ...prev, specialty: e.target.value }));
                          clearFieldError('specialty');
                        }}
                        className={`w-full py-3 px-4 border-2 ${
                          errors.specialty ? 'border-red-300 focus:border-red-500' : 'border-blue-200 focus:border-blue-400'
                        } rounded-xl focus:outline-none bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder:text-blue-300`}
                        placeholder="e.g., Family Therapy, Anxiety Treatment"
                      />
                      {errors.specialty && (
                        <p className="text-red-500 text-xs mt-1 bg-red-50 p-2 rounded-lg">
                          {errors.specialty}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-blue-700 mb-1">Experience</label>
                      <input
                        type="text"
                        value={counsellorInfo.experience || ""}
                        onChange={(e) => {
                          setCounsellorInfo(prev => ({ ...prev, experience: e.target.value }));
                          clearFieldError('experience');
                        }}
                        className={`w-full py-3 px-4 border-2 ${
                          errors.experience ? 'border-red-300 focus:border-red-500' : 'border-blue-200 focus:border-blue-400'
                        } rounded-xl focus:outline-none bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder:text-blue-300`}
                        placeholder="e.g., 5 Years Experience"
                      />
                      {errors.experience && (
                        <p className="text-red-500 text-xs mt-1 bg-red-50 p-2 rounded-lg">
                          {errors.experience}
                        </p>
                      )}
                    </div>
                    
                    <p className="text-xs text-blue-600/70 md:col-span-2 bg-blue-50/50 p-3 rounded-lg">
                      Your educational background, area of specialization, and years of professional practice
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-blue-800 font-bold text-lg truncate">
                            {counsellorInfo.degree}
                          </p>
                          <p className="text-blue-600 font-medium">
                            {counsellorInfo.specialty}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold rounded-full shadow-md">
                            ⭐ {counsellorInfo.experience}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-blue-600/70 mt-2">Educational background, specialization, and experience level</p>
                  </div>
                )}
              </div>

              {/* Fees and Location Row */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Appointment Fee */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <label className="block text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">💰</span>
                    Session Fee <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-blue-600">{currency}</span>
                    {isEdit ? (
                      <div className="flex-1">
                        <input
                          type="number"
                          onChange={(e) => {
                            setCounsellorInfo(prev => ({ ...prev, fees: e.target.value }));
                            clearFieldError('fees');
                          }}
                          value={counsellorInfo.fees || ""}
                          className={`text-3xl font-bold text-blue-600 bg-white/80 border-2 ${
                            errors.fees ? 'border-red-300 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'
                          } rounded-lg px-4 py-2 w-full focus:outline-none transition-all duration-300`}
                          min="0"
                          step="0.01"
                          placeholder="0"
                        />
                        {errors.fees && (
                          <p className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg border border-red-200">
                            {errors.fees}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-blue-600">
                        {counsellorInfo.fees}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-blue-600/70 mt-2">
                    Fee per counselling session (typically 45-60 minutes)
                  </p>
                </div>

                {/* Location */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <label className="block text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    Practice Location <span className="text-red-500">*</span>
                  </label>
                  {isEdit ? (
                    <div>
                      <input
                        type="text"
                        placeholder="e.g., Accra, Ghana"
                        onChange={(e) => {
                          setCounsellorInfo(prev => ({ ...prev, location: e.target.value }));
                          clearFieldError('location');
                        }}
                        value={counsellorInfo.location || ""}
                        className={`w-full bg-white/80 border-2 ${
                          errors.location ? 'border-red-300 focus:border-red-500' : 'border-blue-300 focus:border-blue-500'
                        } rounded-lg px-4 py-3 text-blue-800 font-medium focus:outline-none transition-all duration-300`}
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg border border-red-200">
                          {errors.location}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-blue-800 font-bold text-xl">
                      {counsellorInfo.location}
                    </p>
                  )}
                  <p className="text-xs text-blue-600/70 mt-2">
                    Your primary practice location for sessions
                  </p>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  About Me <span className="text-red-500">*</span>
                </label>
                {isEdit ? (
                  <div>
                    <textarea
                      value={counsellorInfo.about || ""}
                      onChange={(e) => {
                        setCounsellorInfo(prev => ({ ...prev, about: e.target.value }));
                        clearFieldError('about');
                      }}
                      className={`w-full p-4 border-2 ${
                        errors.about ? 'border-red-300 focus:border-red-500' : 'border-blue-200 focus:border-blue-400'
                      } rounded-xl focus:outline-none resize-vertical min-h-[140px] text-blue-800 bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder:text-blue-300`}
                      placeholder="Tell potential clients about yourself, your experience, therapeutic approach, and what makes your practice unique..."
                    />
                    <p className="text-xs text-blue-600/70 mt-2 bg-blue-50/50 p-3 rounded-lg">
                      Describe your background, approach to therapy, and what clients can expect from working with you
                    </p>
                    {errors.about && (
                      <p className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg border border-red-200">
                        {errors.about}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-blue-200 shadow-sm">
                      <p className="text-blue-800 leading-relaxed text-base">
                        {counsellorInfo.about}
                      </p>
                    </div>
                    <p className="text-xs text-blue-600/70 mt-2">Professional background and therapeutic approach</p>
                  </div>
                )}
              </div>

              {/* Preferred Slots */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">⏰</span>
                  Available Time Slots
                </label>
                <p className="text-xs text-blue-600/70 mb-4 bg-blue-50/50 p-3 rounded-lg">
                  {isEdit 
                    ? "Set your preferred working hours. These help clients know when you're typically available for sessions."
                    : "Your typical availability windows for scheduling appointments"
                  }
                </p>
                {isEdit ? (
                  <div className="space-y-4">
                    {counsellorInfo.preferredSlots?.map((slot, index) => (
                      <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-200 shadow-sm">
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-bold text-blue-700 mb-2">Start Time</label>
                            <input
                              type="time"
                              value={slot.start || ""}
                              onChange={(e) => updatePreferredSlot(index, 'start', e.target.value)}
                              className={`w-full border-2 ${
                                errors.preferredSlots?.[index]?.start ? 'border-red-300' : 'border-blue-200'
                              } p-3 rounded-lg focus:outline-none focus:border-blue-400 transition-all duration-300 bg-white/80`}
                            />
                            {errors.preferredSlots?.[index]?.start && 
                              <p className="text-red-500 text-xs mt-1 bg-red-50 p-1 rounded">{errors.preferredSlots[index].start}</p>
                            }
                          </div>
                          
                          <div>
                            <label className="block text-xs font-bold text-blue-700 mb-2">End Time</label>
                            <input
                              type="time"
                              value={slot.end || ""}
                              onChange={(e) => updatePreferredSlot(index, 'end', e.target.value)}
                              className={`w-full border-2 ${
                                errors.preferredSlots?.[index]?.end ? 'border-red-300' : 'border-blue-200'
                              } p-3 rounded-lg focus:outline-none focus:border-blue-400 transition-all duration-300 bg-white/80`}
                            />
                            {errors.preferredSlots?.[index]?.end && 
                              <p className="text-red-500 text-xs mt-1 bg-red-50 p-1 rounded">{errors.preferredSlots[index].end}</p>
                            }
                          </div>
                          
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => removePreferredSlot(index)}
                              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-3 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                              title="Remove this time slot"
                            >
                              🗑️ Remove
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-blue-700 mb-2">
                            Additional Notes (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., 'Flexible on weekends', 'Emergency sessions available'"
                            value={slot.note || ""}
                            onChange={(e) => updatePreferredSlot(index, 'note', e.target.value)}
                            className="w-full border-2 border-blue-200 p-3 rounded-lg focus:outline-none focus:border-blue-400 transition-all duration-300 bg-white/80"
                          />
                          <p className="text-xs text-blue-600/70 mt-1">
                            Any special conditions or flexibility for this time slot
                          </p>
                        </div>
                        
                        {errors.preferredSlots?.[index]?.time && 
                          <p className="text-red-500 text-sm mt-3 bg-red-50 p-2 rounded-lg border border-red-200">
                            {errors.preferredSlots[index].time}
                          </p>
                        }
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={addPreferredSlot}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <span className="text-lg">➕</span>
                      Add Time Slot
                    </button>
                    <p className="text-xs text-blue-600/70 mt-3 bg-blue-50/50 p-3 rounded-lg">
                      Add multiple time slots to give clients flexibility in booking appointments
                    </p>
                  </div>
                ) : (
                  <div>
                    {counsellorInfo.preferredSlots?.length > 0 ? (
                      <div className="grid gap-3">
                        {counsellorInfo.preferredSlots.map((slot, index) => (
                          <div key={index} className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-bold shadow-md">
                                <span>⏰</span>
                                <span>{slot.start} - {slot.end}</span>
                              </div>
                              {slot.note && (
                                <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                  <span>💡</span>
                                  <span className="italic">{slot.note}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-blue-50/50 border border-blue-200 p-6 rounded-xl text-center">
                        <p className="text-blue-500 italic font-medium">
                          🕐 No preferred time slots set - clients can request any time
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-blue-200 pt-6">
                {isEdit ? (
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={updateProfile}
                      disabled={isLoading}
                      className={`px-8 py-4 text-white font-bold rounded-xl transition-all duration-300 flex-1 md:flex-none ${
                        isLoading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-3 justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving Changes...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 justify-center">
                          <span>💾</span>
                          Save Profile Changes
                        </span>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="px-8 py-4 border-2 border-blue-300 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 shadow-md hover:shadow-lg flex-1 md:flex-none"
                    >
                      <span className="flex items-center gap-2 justify-center">
                        <span>❌</span>
                        Cancel Changes
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="flex items-center gap-2">
                      <span>✏️</span>
                      Edit Profile Information
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorProfile;