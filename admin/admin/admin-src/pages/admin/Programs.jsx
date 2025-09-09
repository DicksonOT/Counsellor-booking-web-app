import React, { useState, useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
// import { formatProgramDuration, formatProgramRating, formatInstructorName, formatProgramForForm } from '../../utils/programUtils';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  Clock,
  Star,
  BookOpen,
  DollarSign,
  Award,
  Eye,
  X,
  Minus,
  Save,
  Upload,
  AlertTriangle
} from 'lucide-react';

// Separate Form Component to prevent re-rendering issues
const ProgramFormModal = ({ isOpen, isEdit = false, program = null, onClose, onSubmit }) => {
  const [localFormData, setLocalFormData] = useState({
    title: '',
    description: '',
    duration: '',
    difficulty: 'Beginner',
    category: '',
    instructor: '',
    outcome: '',
    features: [''],
    price: 'Free',
    image: null
  });

  const [localErrors, setLocalErrors] = useState({});
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [localPreviewImage, setLocalPreviewImage] = useState('');

  const categories = [
    'Meditation', 'Wellness', 'Mindfulness', 'Stress Relief', 'Sleep',
    'Focus', 'Anxiety Management', 'Mental Health', 'Emotional Wellbeing', 'Self Care'
  ];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const durations = ['1 week', '2 weeks', '3 weeks', '4 weeks', '6 weeks', '8 weeks', '10 weeks', '12 weeks'];

  // Initialize form data when program changes
  useEffect(() => {
    if (isEdit && program) {
      setLocalFormData({
        title: program.title || '',
        description: program.description || '',
        duration: program.duration || '',
        difficulty: program.difficulty || 'Beginner',
        category: program.category || '',
        instructor: program.instructor || '',
        outcome: program.outcome || '',
        features: program.features && program.features.length > 0 ? program.features : [''],
        price: program.price || 'Free',
        image: null
      });
      setLocalPreviewImage(program.thumbnail || '');
    } else {
      // Reset form for new program
      setLocalFormData({
        title: '',
        description: '',
        duration: '',
        difficulty: 'Beginner',
        category: '',
        instructor: '',
        outcome: '',
        features: [''],
        price: 'Free',
        image: null
      });
      setLocalPreviewImage('');
    }
    setLocalErrors({});
  }, [isEdit, program, isOpen]);

  const handleLocalInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({ ...prev, [name]: value }));
    if (localErrors[name]) {
      setLocalErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLocalImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setLocalErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setLocalErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      setLocalFormData(prev => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      if (localErrors.image) {
        setLocalErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleLocalFeatureChange = (index, value) => {
    setLocalFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const addLocalFeature = () => {
    if (localFormData.features.length < 10) {
      setLocalFormData(prev => ({
        ...prev,
        features: [...prev.features, '']
      }));
    }
  };

  const removeLocalFeature = (index) => {
    if (localFormData.features.length > 1) {
      setLocalFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const validateLocalForm = () => {
    const newErrors = {};
    if (!localFormData.title.trim()) newErrors.title = 'Program title is required';
    if (!localFormData.description.trim()) newErrors.description = 'Description is required';
    if (!localFormData.instructor.trim()) newErrors.instructor = 'Instructor name is required';
    if (!localFormData.outcome.trim()) newErrors.outcome = 'Program outcome is required';
    if (!localFormData.category) newErrors.category = 'Please select a category';
    if (!localFormData.duration) newErrors.duration = 'Please select a duration';
    if (localFormData.features.some(f => !f.trim())) newErrors.features = 'All feature fields must be filled or removed';

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocalSubmit = async () => {
    if (!validateLocalForm()) return;

    setLocalIsSubmitting(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all form fields
      formData.append('title', localFormData.title);
      formData.append('description', localFormData.description);
      formData.append('duration', localFormData.duration);
      formData.append('difficulty', localFormData.difficulty);
      formData.append('category', localFormData.category);
      formData.append('instructor', localFormData.instructor);
      formData.append('outcome', localFormData.outcome);
      formData.append('price', localFormData.price);

      // Add features as JSON string
      const validFeatures = localFormData.features.filter(f => f.trim() !== '');
      formData.append('features', JSON.stringify(validFeatures));

      // Add image file if present
      if (localFormData.image) {
        formData.append('image', localFormData.image);
      }

      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLocalIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className={`${isEdit ? 'bg-gradient-to-r from-green-600 to-blue-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white p-6 flex justify-between items-center`}>
          <h2 className="text-2xl font-bold">{isEdit ? `Edit: ${program?.title}` : 'Add New Wellness Program'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program Title *</label>
                <input
                  type="text"
                  name="title"
                  value={localFormData.title}
                  onChange={handleLocalInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${isEdit ? 'focus:ring-green-500' : 'focus:ring-blue-500'} transition-colors ${localErrors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter program title"
                  maxLength="100"
                />
                {localErrors.title && <p className="text-red-500 text-sm mt-1">{localErrors.title}</p>}
                <p className="text-gray-500 text-xs mt-1">{localFormData.title.length}/100 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Name *</label>
                <input
                  type="text"
                  name="instructor"
                  value={localFormData.instructor}
                  onChange={handleLocalInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${isEdit ? 'focus:ring-green-500' : 'focus:ring-blue-500'} transition-colors ${localErrors.instructor ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Instructor name"
                />
                {localErrors.instructor && <p className="text-red-500 text-sm mt-1">{localErrors.instructor}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program Description *</label>
              <textarea
                name="description"
                value={localFormData.description}
                onChange={handleLocalInputChange}
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${isEdit ? 'focus:ring-green-500' : 'focus:ring-blue-500'} transition-colors ${localErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Provide a detailed description of the program..."
              />
              {localErrors.description && <p className="text-red-500 text-sm mt-1">{localErrors.description}</p>}
            </div>
          </div>

          {/* Program Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Program Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={localFormData.category}
                  onChange={handleLocalInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${isEdit ? 'focus:ring-green-500' : 'focus:ring-blue-500'} transition-colors ${localErrors.category ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {localErrors.category && <p className="text-red-500 text-sm mt-1">{localErrors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                <select
                  name="duration"
                  value={localFormData.duration}
                  onChange={handleLocalInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${isEdit ? 'focus:ring-green-500' : 'focus:ring-blue-500'} transition-colors ${localErrors.duration ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Select Duration</option>
                  {durations.map(duration => <option key={duration} value={duration}>{duration}</option>)}
                </select>
                {localErrors.duration && <p className="text-red-500 text-sm mt-1">{localErrors.duration}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <select
                  name="difficulty"
                  value={localFormData.difficulty}
                  onChange={handleLocalInputChange}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${isEdit ? 'focus:ring-green-500' : 'focus:ring-blue-500'} transition-colors`}>
                  {difficulties.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program Outcome *</label>
              <textarea
                name="outcome"
                value={localFormData.outcome}
                onChange={handleLocalInputChange}
                rows="3"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${isEdit ? 'focus:ring-green-500' : 'focus:ring-blue-500'} transition-colors ${localErrors.outcome ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="What will participants achieve after completing this program?"
              />
              {localErrors.outcome && <p className="text-red-500 text-sm mt-1">{localErrors.outcome}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    value="Free"
                    checked={localFormData.price === 'Free'}
                    onChange={handleLocalInputChange}
                    className={`mr-2 ${isEdit ? 'text-green-600' : 'text-blue-600'}`}
                  />
                  Free
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    value="Premium"
                    checked={localFormData.price === 'Premium'}
                    onChange={handleLocalInputChange}
                    className={`mr-2 ${isEdit ? 'text-green-600' : 'text-blue-600'}`}
                  />
                  Premium
                </label>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-800">Program Features</h3>
              <button
                type="button"
                onClick={addLocalFeature}
                disabled={localFormData.features.length >= 10}
                className={`flex items-center px-3 py-1 text-sm text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isEdit ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                <Plus size={16} className="mr-1" /> Add Feature
              </button>
            </div>

            <div className="space-y-3">
              {localFormData.features.map((feature, index) => (
                <div key={`feature-${index}`} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleLocalFeatureChange(index, e.target.value)}
                    className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${isEdit ? 'focus:ring-green-500' : 'focus:ring-blue-500'} transition-colors`}
                    placeholder={`Feature ${index + 1}`}
                  />
                  {localFormData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLocalFeature(index)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {localErrors.features && <p className="text-red-500 text-sm">{localErrors.features}</p>}
          </div>

          {/* Image Upload */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Program Image</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Program Image {!isEdit && '*'}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLocalImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${localErrors.image ? 'border-red-500' : ''}`}
                >
                  <Upload size={20} className="mr-2" />
                  Choose Image
                </label>
                <span className="text-sm text-gray-500">
                  {localFormData.image ? localFormData.image.name : 'No file chosen'}
                </span>
              </div>
              {localErrors.image && <p className="text-red-500 text-sm mt-1">{localErrors.image}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>

              {localPreviewImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={localPreviewImage}
                    alt="Preview"
                    className="w-48 h-32 object-cover rounded-lg border"
                    onError={(e) => {
                      e.target.src = 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/r_max/f_auto/placeholder.jpg';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLocalSubmit}
              disabled={localIsSubmitting}
              className={`px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${isEdit ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}>
              {isEdit && <Save size={20} className="mr-2" />}
              {localIsSubmitting ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Program' : 'Add Program')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Programs = () => {
  const { programs, getAllPrograms, addProgram, updateProgram, deleteProgram, loading } = useContext(AdminContext);

  // State management
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [showEditProgram, setShowEditProgram] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterPrice, setFilterPrice] = useState('');

  const categories = [
    'Meditation', 'Wellness', 'Mindfulness', 'Stress Relief', 'Sleep',
    'Focus', 'Anxiety Management', 'Mental Health', 'Emotional Wellbeing', 'Self Care'
  ];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  // Load programs on component mount
  useEffect(() => {
    getAllPrograms();
  }, []);

  // Filter programs based on search and filters
  const filteredPrograms = (programs || []).filter(program => {
    const title = program.title ? program.title.toString().toLowerCase().trim() : "";
    const instructor = program.instructor ? program.instructor.toString().toLowerCase().trim() : "";
    const category = program.category ? program.category.toString().trim() : "";
    const difficulty = program.difficulty ? program.difficulty.toString().trim() : "";
    const price = program.price ? program.price.toString().trim() : "";

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      title.includes(search) ||
      instructor.includes(search);

    const matchesCategory =
      !filterCategory || category === filterCategory;

    const matchesDifficulty =
      !filterDifficulty || difficulty === filterDifficulty;

    const matchesPrice =
      !filterPrice || price === filterPrice;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice;
  });

  // CRUD Operations
  const handleAddProgram = () => {
    setShowAddProgram(true);
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setShowEditProgram(true);
  };

  const handleDeleteProgram = (program) => {
    setProgramToDelete(program);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (programToDelete) {
      const result = await deleteProgram(programToDelete._id);
      if (result.success) {
        setShowDeleteConfirm(false);
        setProgramToDelete(null);
      }
    }
  };

  const handleSubmitAdd = async (formData) => {
    const result = await addProgram(formData);
    if (result.success) {
      setShowAddProgram(false);
    }
  };

  const handleSubmitEdit = async (formData) => {
    const result = await updateProgram(selectedProgram._id, formData);
    if (result.success) {
      setShowEditProgram(false);
      setSelectedProgram(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Wellness Programs</h1>
          <p className="text-gray-600">Manage your wellness programs and content</p>
        </div>
        <button
          onClick={handleAddProgram}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center">
          <Plus size={20} className="mr-2" />
          Add New Program
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Levels</option>
            {difficulties.map(level => <option key={level} value={level}>{level}</option>)}
          </select>

          <select
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Prices</option>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Programs Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map(program => (
            <div key={program._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative">
                <img
                  src={program.thumbnail || 'https://res.cloudinary.com/demo/image/upload/w_400,h_200,c_fill/r_max/f_auto/placeholder.jpg'}
                  alt={program.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://res.cloudinary.com/demo/image/upload/w_400,h_200,c_fill/r_max/f_auto/placeholder.jpg';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${program.price === 'Free' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {program.price}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-blue-600 line-clamp-2">{program.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProgram(program)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Program"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(program)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Program"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{program.description}</p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="mr-4">{program.participants || 0}</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Duration: {program.duration.value} {program.duration.unit}</span>
                  <Award className="w-4 h-4 mr-1" />
                  <span>{program.difficulty}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>Rating: {program.rating.average} ({program.rating.count} ratings)</span>
                  </div>
                  <span>Instructor: {program.instructor.name}</span>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {program.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPrograms.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-500">Try adjusting your search or filters, or add a new program.</p>
        </div>
      )}

      {/* Modals */}
      <ProgramFormModal
        isOpen={showAddProgram}
        isEdit={false}
        onSubmit={handleSubmitAdd}
        onClose={() => setShowAddProgram(false)}
      />

      <ProgramFormModal
        isOpen={showEditProgram}
        isEdit={true}
        program={selectedProgram}
        onSubmit={handleSubmitEdit}
        onClose={() => setShowEditProgram(false)}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Program</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete "{programToDelete?.title}"? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex flex-row-reverse rounded-b-xl">
              <button
                onClick={confirmDelete}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;