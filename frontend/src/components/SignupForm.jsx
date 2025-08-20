import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const steps = ["Personal Info", "Credentials", "Experience", "Details"];

const CounselorSignupForm = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [fileTypes, setFileTypes] = useState({});

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', gpcNumber: '',
    degree: '', cv: null, certificates: null, license: null, image: null,
    experienceYears: '', specialty: '', supervisedHours: '',
    about: '', location: '', fees: '',
  });


const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (files && files.length > 0) {
    setFormData(prev => ({ ...prev, [name]: files }));

    const types = Array.from(files).map(file => file.type).join(', ');
    setFileTypes(prev => ({ ...prev, [name]: types }));
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
};

  const validateStep = (currentStep) => {
    const requiredFields = {
      0: ["name", "email", "password"],
      1: ["gpcNumber", "degree"],
      2: ["experienceYears", "specialty"],
      3: ["about", "location", "fees"]
    };

    const stepErrors = {};
    requiredFields[currentStep].forEach(field => {
      const value = formData[field];
      if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '') ||
        (value instanceof FileList && value.length === 0)
      ) {
        stepErrors[field] = "This field is required.";
      }
    });
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleSubmit = async () => {
  if (!validateStep(step)) return;
  setIsSubmitting(true);
  try {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof FileList) {
        Array.from(value).forEach(file => form.append(key, file));
      } else {
        form.append(key, value);
      }
    });

    const { data } = await axios.post(`${backendUrl}/api/counsellor/register`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    if (data.success) {
      toast.success(data.message);
    } else {
      toast.error(data.message || 'Something went wrong');
    }

    navigate('/')
  } catch (err) {
    console.error(err);
    setErrors({ submit: err.response?.data?.error || 'Submission failed.' });
  } finally {
    setIsSubmitting(false);
  }
};

  const inputStyles = "w-full px-4 py-3 text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-500 hover:border-gray-300";
  const selectStyles = "w-full px-4 py-3 text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 cursor-pointer appearance-none bg-no-repeat bg-right pr-10";
  const textareaStyles = "w-full px-4 py-3 text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-500 hover:border-gray-300 resize-vertical min-h-[100px]";
  const fileInputStyles = "w-full px-4 py-3 text-gray-700 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer";

const renderStep = () => {
    const labelStyles = "block text-sm font-semibold text-gray-700 mb-2";

    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div>
              <label className={labelStyles}>Full Name</label>
              <input name="name" placeholder="e.g., John Doe" value={formData.name} onChange={handleChange} className={inputStyles} />
            </div>
            <div>
              <label className={labelStyles}>Email</label>
              <input name="email" placeholder="Email Address" type="email" value={formData.email} onChange={handleChange} className={inputStyles} />
            </div>
            <div>
              <label className={labelStyles}>Password</label>
              <input name="password" placeholder="Your secure password" type="password" value={formData.password} onChange={handleChange} className={inputStyles} />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 pt-2">
            <div>
              <label className={labelStyles}>GPC Number</label>
              <input name="gpcNumber" placeholder="e.g., GPC-123456" value={formData.gpcNumber} onChange={handleChange} className={inputStyles} />
            </div>
            <div>
              <label className={labelStyles}>Degree</label>
              <input name="degree" placeholder="e.g., Master of Arts in Clinical Psychology" value={formData.degree} onChange={handleChange} className={inputStyles} />
            </div>
            <div className="space-y-4 pt-2">
              <label className={labelStyles}>CV Upload</label>
              <input type="file" name="cv" onChange={handleChange} className={fileInputStyles} />
              {fileTypes.cv && <p className="text-sm text-gray-500 mt-1">File type: {fileTypes.cv}</p>}
            </div>
            <div>
              <label className={labelStyles}>Certificates</label>
              <input type="file" name="certificates" multiple onChange={handleChange} className={fileInputStyles} />
              {fileTypes.certificates && <p className="text-sm text-gray-500 mt-1">File type(s): {fileTypes.certificates}</p>}
            </div>
            <div>
              <label className={labelStyles}>License</label>
              <input type="file" name="license" onChange={handleChange} className={fileInputStyles} />
              {fileTypes.license && <p className="text-sm text-gray-500 mt-1">File type: {fileTypes.license}</p>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label className={labelStyles}>Years of Experience</label>
              <input name="experienceYears" placeholder="e.g., 5" value={formData.experienceYears} onChange={handleChange} className={inputStyles} />
            </div>
            <div>
              <label className={labelStyles}>Specialty</label>
              <select
                onChange={handleChange}
                name="specialty"
                className={selectStyles}
              >
                <option value="" disabled selected>Select a specialty</option>
                <option value="Marriage and Family Counsellor">Marriage and Family Counsellor</option>
                <option value="School Counsellor">School Counsellor</option>
                <option value="Rehabilitation Counsellor">Rehabilitation Counsellor</option>
                <option value="Substance Abuse Counsellor">Substance Abuse Counsellor</option>
                <option value="Mental Health Counsellor">Mental Health Counsellor</option>
                <option value="Career Counsellor">Career Counsellor</option>
              </select>
            </div>
            <div>
              <label className={labelStyles}>Profile Image</label>
              <input type="file" name="image" onChange={handleChange} className={fileInputStyles} />
              {fileTypes.image && <p className="text-sm text-gray-500 mt-1">File type: {fileTypes.image}</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <label className={labelStyles}>About You</label>
              <textarea name="about" placeholder="Share your professional philosophy, counseling style, and who you enjoy working with." value={formData.about} onChange={handleChange} className={textareaStyles} rows="4" />
            </div>
            <div>
              <label className={labelStyles}>Location</label>
              <input name="location" placeholder="e.g., Accra, Ghana" value={formData.location} onChange={handleChange} className={inputStyles} />
            </div>
            <div>
              <label className={labelStyles}>Fees</label>
              <input name="fees" type="number" placeholder="e.g., 150" value={formData.fees} onChange={handleChange} className={inputStyles} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress & Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6"><span className="text-2xl">🩺</span></div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Counselor Network</h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">Help people find the mental health support they need. Complete your registration in just a few steps.</p>
        </div>

        {/* Step Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">{steps[step]}</h2>
            <div className="flex justify-center mt-2"><div className="text-blue-100 text-sm">Step {step + 1} of {steps.length}</div></div>
          </div>

          <div className="p-8">
            {/* Step Description */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-gradient-to-br from-blue-100 to-indigo-100">
                {["👤", "📋", "💼", "✨"][step]}
              </div>
              <p className="text-gray-600 text-sm">
                {[
                  "Let's start with your basic information",
                  "Upload your professional credentials and documents",
                  "Tell us about your professional experience",
                  "Complete your profile with additional details"
                ][step]}
              </p>
            </div>

            {/* ✅ Fixed Field Mounting */}
            <div key={step} className="mb-8">
              {renderStep()}
            </div>

            {/* Errors */}
            {Object.values(errors).length > 0 && (
              <div className="mb-6 space-y-2">
                {Object.values(errors).map((e, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    ⚠️ {e}
                  </div>
                ))}
              </div>
            )}

            {/* Nav Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              {step > 0 ? (
                <button onClick={() => setStep(step - 1)} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
              ) : <div />}
              {step < steps.length - 1 ? (
                <button onClick={() => validateStep(step) && setStep(step + 1)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Continue</button>
              ) : (
                <button onClick={handleSubmit} disabled={isSubmitting} className={`px-8 py-3 rounded-lg text-white ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorSignupForm;