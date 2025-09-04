import { Clock, Users, FileText, Heart } from 'lucide-react';
import appointment_img from './appointment_img.png'
import header_img from './header_img.jpg'
import header_img1 from './header_img1.jpg'
import header_img2 from './header_img2.jpg'
import header_img3 from './header_img3.jpg'
import header_img4 from './header_img4.jpg'
import header_img5 from './header_img5.jpg'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.jpg'  
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import bot from './bot.gif'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import welcome from './welcome.png'
import people from './people.png'
import coun1 from './coun1.png'
import coun2 from './coun2.png'
import coun3 from './coun3.png'
import coun4 from './coun4.png'
import coun5 from './coun5.png'
import coun6 from './coun6.png'
import coun7 from './coun7.png'
import coun8 from './coun8.png'
import coun9 from './coun9.png'
import coun10 from './coun10.png'
import coun11 from './coun11.png'
import coun12 from './coun12.png'
import coun13 from './coun13.png'
import coun14 from './coun14.png'
import coun15 from './coun15.png'
import coun16 from './coun16.png'
import coun17 from './coun17.png'
import coun19 from './coun19.png'
import coun20 from './coun20.png'
import coun21 from './coun21.png'
import coun22 from './coun22.png'
import coun23 from './coun23.png'
import coun24 from './coun24.png'
import coun25 from './coun25.png'
import coun26 from './coun26.png'
import coun27 from './coun27.png'
import coun28 from './coun28.png'
import coun29 from './coun29.png'
import coun30 from './coun30.png'
import coun31 from './coun31.png'
import coun18 from './coun18.png'
import coun32 from './coun32.png'
import coun33 from './coun33.png'
import coun34 from './coun34.png'
import coun35 from './coun35.png'
import coun36 from './coun36.png'
import coun37 from './coun37.png'
import coun38 from './coun38.png'
import coun39 from './coun39.png'
import coun40 from './coun40.png'
import coun41 from './coun41.png'
import coun42 from './coun42.png'
import coun43 from './coun43.png'
import coun44 from './coun44.png'
import coun45 from './coun45.png'
import coun46 from './coun46.png'
import coun47 from './coun47.png'
import coun48 from './coun48.png'
import coun49 from './coun49.png'
import coun50 from './coun50.png'
import coun51 from './coun51.png'
import coun52 from './coun52.png'
import coun53 from './coun53.png'
import coun54 from './coun54.png'
import coun55 from './coun55.png'
import coun56 from './coun56.png'
import coun57 from './coun57.png'
import coun58 from './coun58.png'
import coun59 from './coun59.png'
import coun60 from './coun60.png'
import coun61 from './coun61.png'
import coun62 from './coun62.png'
import coun63 from './coun63.png'
import coun64 from './coun64.png'
import coun65 from './coun65.png'
import coun66 from './coun66.png'
import coun67 from './coun67.png'
import coun68 from './coun68.png'
import coun69 from './coun69.png'
import coun70 from './coun70.png'
import coun71 from './coun71.png'
import vic    from './vic.jpg'
import video  from './video.mp4'
import elorm from './elorm.jpg'

import Family from './Family.svg'
import Student from './Student.svg'
import Rehabilitation from './Rehabilitation.svg'
import Drugs from './Drugs.svg'
import Mental from './Mental.svg'
import Career from './Career.svg'
import linkedin from './linkedin.svg'

export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo,
    welcome,
    people,
    header_img1,
    header_img2,
    header_img3,
    header_img4,
    header_img5,
    bot,
    vic,
    linkedin,
    video,
    elorm
}


// DonationUtils

export const donationUtils = {
  // Format currency consistently
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  },

  // Calculate sessions funded
  calculateSessionsFunded: (amount, sessionCost = 50) => {
    return Math.floor(amount / sessionCost);
  },

  // Format date for display
  formatDate: (dateString, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleDateString('en-US', {
      ...defaultOptions,
      ...options
    });
  },

  // Get status styling
  getStatusStyling: (status) => {
    const styles = {
      completed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200'
      },
      active: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200'
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200'
      },
      failed: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200'
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200'
      },
      default: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200'
      }
    };
    
    return styles[status] || styles.default;
  },

  // Validate donation amount
  validateDonationAmount: (amount, minAmount = 5) => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
      return { valid: false, error: 'Please enter a valid amount' };
    }
    
    if (numAmount < minAmount) {
      return { valid: false, error: `Minimum donation amount is $${minAmount}` };
    }
    
    if (numAmount > 50000) {
      return { valid: false, error: 'Maximum donation amount is $50,000. Please contact us for larger donations.' };
    }
    
    return { valid: true };
  },

  // Validate email
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      return { valid: false, error: 'Email address is required' };
    }
    
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Please enter a valid email address' };
    }
    
    return { valid: true };
  },

  // Generate donation receipt content
  generateReceiptContent: (donation) => {
    return `
DONATION RECEIPT
================

Thank you for your generous donation!

Donation Details:
- ID: ${donation.id || donation._id}
- Amount: ${donationUtils.formatCurrency(donation.amount)}
- Type: ${donation.type === 'monthly' ? 'Monthly Recurring' : 'One-time'}
- Date: ${donationUtils.formatDate(donation.createdAt)}
- Status: ${donation.status}

Donor Information:
- Name: ${donation.donorName}
- Email: ${donation.donorEmail}

Tax Information:
- This donation is tax-deductible
- Tax ID: 12-3456789
- Receipt Date: ${donationUtils.formatDate(new Date())}

Impact Statement:
Your donation of ${donationUtils.formatCurrency(donation.amount)} can provide 
${donationUtils.calculateSessionsFunded(donation.amount)} free counseling sessions 
to individuals who need mental health support but cannot afford it.

${donation.type === 'monthly' ? 
  `As a monthly donor, you will help provide ${donationUtils.calculateSessionsFunded(donation.amount) * 12} sessions annually!` : 
  ''}

Thank you for supporting mental health care accessibility!

---
Mental Health Support Foundation
Contact: support@mentalhealthfoundation.org
Website: www.mentalhealthfoundation.org
    `.trim();
  },

  // Download file helper
  downloadFile: (content, filename, mimeType = 'text/plain') => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  },

  // Calculate next charge date for monthly donations
  calculateNextChargeDate: (startDate, monthsToAdd = 1) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + monthsToAdd);
    return date;
  },

  // Filter donations by criteria
  filterDonations: (donations, filters) => {
    let filtered = [...donations];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(donation => 
        (donation.id || donation._id).toLowerCase().includes(searchLower) ||
        donation.amount.toString().includes(filters.search) ||
        donation.donorName?.toLowerCase().includes(searchLower) ||
        donation.donorEmail?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(donation => donation.status === filters.status);
    }

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(donation => donation.type === filters.type);
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;

      switch (filters.dateRange) {
        case '7days':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1year':
          cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = null;
      }

      if (cutoffDate) {
        filtered = filtered.filter(donation => 
          new Date(donation.createdAt) >= cutoffDate
        );
      }
    }

    return filtered;
  },

  // Calculate donation statistics
  calculateDonationStats: (donations) => {
    return donations.reduce((stats, donation) => {
      if (donation.status === 'completed' || donation.status === 'active') {
        stats.totalAmount += donation.amount;
        stats.totalCount += 1;

        if (donation.type === 'monthly') {
          stats.monthlyAmount += donation.amount;
          stats.monthlyCount += 1;
        } else {
          stats.oneTimeAmount += donation.amount;
          stats.oneTimeCount += 1;
        }

        stats.totalSessions += donationUtils.calculateSessionsFunded(donation.amount);
      }

      return stats;
    }, {
      totalAmount: 0,
      totalCount: 0,
      monthlyAmount: 0,
      monthlyCount: 0,
      oneTimeAmount: 0,
      oneTimeCount: 0,
      totalSessions: 0,
      averageAmount: 0
    });
  },

  // Export donations to CSV
  exportDonationsToCSV: (donations, filename = 'donations-export.csv') => {
    const headers = ['Date', 'Amount', 'Type', 'Status', 'Donor Name', 'Donor Email', 'ID', 'Sessions Funded'];
    
    const csvContent = [
      headers.join(','),
      ...donations.map(donation => [
        donationUtils.formatDate(donation.createdAt, { hour: undefined, minute: undefined }),
        donation.amount,
        donation.type,
        donation.status,
        donation.donorName || 'Anonymous',
        donation.donorEmail || 'N/A',
        donation.id || donation._id,
        donationUtils.calculateSessionsFunded(donation.amount)
      ].join(','))
    ].join('\n');

    donationUtils.downloadFile(csvContent, filename, 'text/csv');
  },

  // Share donation success
  shareDonation: async (donation) => {
    const shareText = `I just donated ${donationUtils.formatCurrency(donation.amount)} to support mental health services! This will help fund ${donationUtils.calculateSessionsFunded(donation.amount)} free counseling sessions for those in need.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Supporting Mental Health',
          text: shareText,
          url: window.location.origin
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    } else {
      // Fallback for browsers without Web Share API
      try {
        await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
        return { success: true, message: 'Copied to clipboard!' };
      } catch (error) {
        console.log(error)
        return { success: false, error: 'Failed to copy to clipboard' };
      }
    }
  }
};

// React Hook for donation management
import { useState, useCallback } from 'react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useDonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshDonations = useCallback(async (getDonationHistory) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDonationHistory();
      if (response.success) {
        setDonations(response.donations || []);
      } else {
        setError(response.message || 'Failed to fetch donations');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDonationStatus = useCallback((donationId, newStatus) => {
    setDonations(prev => 
      prev.map(donation => 
        (donation.id === donationId || donation._id === donationId)
          ? { ...donation, status: newStatus }
          : donation
      )
    );
  }, []);

  return {
    donations,
    loading,
    error,
    refreshDonations,
    updateDonationStatus,
    stats: donationUtils.calculateDonationStats(donations)
  };
};

// Payment status verification component
export const PaymentStatusVerifier = ({ sessionId, onVerified, onError }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const { verifyDonationPayment } = useContext(AppContext);

  const verifyPayment = useCallback(async () => {
    if (!sessionId || isVerifying) return;

    setIsVerifying(true);
    
    try {
      const response = await verifyDonationPayment(sessionId);
      
      if (response.success) {
        onVerified?.(response.donation);
      } else {
        onError?.(response.message || 'Payment verification failed');
      }
    } catch (error) {
      onError?.(error.message || 'An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  }, [sessionId, isVerifying, verifyDonationPayment, onVerified, onError]);

  return {
    verifyPayment,
    isVerifying
  };
};

// Donation form validation hook
export const useDonationForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    isCustom: false,
    type: 'one-time',
    donorName: '',
    donorEmail: ''
  });

  const [errors, setErrors] = useState({});

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    const currentAmount = formData.isCustom ? formData.customAmount : formData.amount;
    const amountValidation = donationUtils.validateDonationAmount(currentAmount);
    if (!amountValidation.valid) {
      newErrors.amount = amountValidation.error;
    }

    if (!formData.donorName.trim()) {
      newErrors.donorName = 'Name is required';
    }

    const emailValidation = donationUtils.validateEmail(formData.donorEmail);
    if (!emailValidation.valid) {
      newErrors.donorEmail = emailValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const getCurrentAmount = useCallback(() => {
    return formData.isCustom ? formData.customAmount : formData.amount;
  }, [formData.isCustom, formData.customAmount, formData.amount]);

  return {
    formData,
    errors,
    updateField,
    validateForm,
    getCurrentAmount,
    isValid: Object.keys(errors).length === 0 && getCurrentAmount() && formData.donorName && formData.donorEmail
  };
};

 export const resources = [
    // Depression Resources
    {
      id: 1,
      title: "Understanding Depression: A Complete Guide",
      type: "book",
      category: "depression",
      duration: "15 mins",
      rating: 4.7,
      views: 2341,
      description: "Learn about symptoms, causes, and treatment options for depression.",
      tags: ["depression", "mental health", "treatment"],
      featured: true,
      viewLink: "https://example.com/depression-guide",
      downloadLink: null
    },
    {
      id: 2,
      title: "Depression Self-Assessment Quiz",
      type: "download",
      category: "depression",
      duration: "PDF",
      rating: 4.8,
      views: 1892,
      description: "Professional screening tool to help identify depression symptoms.",
      tags: ["depression", "assessment", "quiz"],
      new: true,
      viewLink: "https://example.com/depression-quiz",
      downloadLink: "https://example.com/download/depression-quiz.pdf"
    },
    {
      id: 3,
      title: "Overcoming Depression: Real Stories",
      type: "audio",
      category: "depression",
      duration: "25 mins",
      rating: 4.6,
      views: 1456,
      description: "Inspiring recovery stories and practical advice from mental health experts.",
      tags: ["depression", "recovery", "stories"],
      viewLink: "https://example.com/depression-stories",
      downloadLink: null
    },
    {
      id: 4,
      title: "Daily Mood Tracking Template",
      type: "download",
      category: "depression",
      duration: "PDF",
      rating: 4.5,
      views: 967,
      description: "Track your mood patterns and identify triggers with this daily log.",
      tags: ["mood", "tracking", "template"],
      viewLink: "https://example.com/mood-tracker",
      downloadLink: "https://example.com/download/mood-tracker.pdf"
    },

    // Anxiety & Stress Resources
    {
      id: 5,
      title: "Anxiety Relief Techniques",
      type: "infographic",
      category: "anxiety",
      duration: "Quick view",
      rating: 4.8,
      views: 1567,
      description: "Visual guide to breathing exercises and grounding techniques.",
      tags: ["anxiety", "breathing", "techniques"],
      trending: true,
      viewLink: "https://example.com/anxiety-techniques",
      downloadLink: "https://example.com/download/anxiety-infographic.pdf"
    },
    {
      id: 6,
      title: "CBT Thought Record Worksheet",
      type: "download",
      category: "anxiety",
      duration: "PDF",
      rating: 4.9,
      views: 2156,
      description: "Cognitive behavioral therapy worksheet for challenging negative thoughts.",
      tags: ["CBT", "thoughts", "worksheet"],
      new: true,
      viewLink: "https://example.com/cbt-worksheet",
      downloadLink: "https://example.com/download/cbt-worksheet.pdf"
    },
    {
      id: 7,
      title: "Managing Panic Attacks",
      type: "video",
      category: "anxiety",
      duration: "12 mins",
      rating: 4.7,
      views: 1834,
      description: "Learn immediate techniques to manage and reduce panic attack intensity.",
      tags: ["panic", "anxiety", "emergency"],
      viewLink: "https://example.com/panic-attacks",
      downloadLink: null
    },
    {
      id: 8,
      title: "Stress Management Workbook",
      type: "download",
      category: "anxiety",
      duration: "PDF",
      rating: 4.6,
      views: 1245,
      description: "Comprehensive workbook with exercises and strategies for stress reduction.",
      tags: ["stress", "workbook", "exercises"],
      viewLink: "https://example.com/stress-workbook",
      downloadLink: "https://example.com/download/stress-workbook.pdf"
    },

    // Sleep Health Resources
    {
      id: 9,
      title: "Sleep Hygiene Checklist",
      type: "download",
      category: "sleep",
      duration: "PDF",
      rating: 4.6,
      views: 789,
      description: "Downloadable checklist to improve your sleep quality and bedtime routine.",
      tags: ["sleep", "hygiene", "checklist"],
      new: true,
      viewLink: "https://example.com/sleep-checklist",
      downloadLink: "https://example.com/download/sleep-checklist.pdf"
    },
    {
      id: 10,
      title: "Guided Sleep Meditation",
      type: "audio",
      category: "sleep",
      duration: "20 mins",
      rating: 4.8,
      views: 2103,
      description: "Relaxing meditation to help you fall asleep naturally and peacefully.",
      tags: ["sleep", "meditation", "relaxation"],
      trending: true,
      viewLink: "https://example.com/sleep-meditation",
      downloadLink: null
    },
    {
      id: 11,
      title: "Understanding Sleep Disorders",
      type: "article",
      category: "sleep",
      duration: "7 min read",
      rating: 4.5,
      views: 1432,
      description: "Comprehensive guide to common sleep disorders and treatment options.",
      tags: ["sleep disorders", "insomnia", "treatment"],
      viewLink: "https://example.com/sleep-disorders",
      downloadLink: null
    },
    {
      id: 12,
      title: "Sleep Schedule Template",
      type: "download",
      category: "sleep",
      duration: "PDF",
      rating: 4.4,
      views: 876,
      description: "Printable template to track and optimize your sleep patterns.",
      tags: ["sleep schedule", "template", "tracking"],
      viewLink: "https://example.com/sleep-template",
      downloadLink: "https://example.com/download/sleep-template.pdf"
    },

    // Relationships Resources
    {
      id: 13,
      title: "Building Healthy Relationships",
      type: "article",
      category: "relationships",
      duration: "8 min read",
      rating: 4.5,
      views: 934,
      description: "Communication strategies and boundary-setting in relationships.",
      tags: ["relationships", "communication", "boundaries"],
      viewLink: "https://example.com/healthy-relationships",
      downloadLink: null
    },
    {
      id: 14,
      title: "Conflict Resolution Guide",
      type: "article",
      category: "relationships",
      duration: "18 mins",
      rating: 4.7,
      views: 1567,
      description: "Learn effective techniques for resolving conflicts in any relationship.",
      tags: ["conflict", "resolution", "communication"],
      featured: true,
      viewLink: "https://www.crnhq.org/",
      downloadLink: null
    },
    {
      id: 15,
      title: "Relationship Assessment Tool",
      type: "download",
      category: "relationships",
      duration: "PDF",
      rating: 4.6,
      views: 723,
      description: "Evaluate the health of your relationships with this comprehensive tool.",
      tags: ["relationship", "assessment", "evaluation"],
      viewLink: "https://example.com/relationship-assessment",
      downloadLink: "https://example.com/download/relationship-assessment.pdf"
    },
    {
      id: 16,
      title: "Love Languages Explained",
      type: "infographic",
      category: "relationships",
      duration: "Quick view",
      rating: 4.8,
      views: 2145,
      description: "Visual guide to understanding and applying the five love languages.",
      tags: ["love languages", "relationships", "communication"],
      viewLink: "https://example.com/love-languages",
      downloadLink: "https://example.com/download/love-languages.pdf"
    },

    // Mindfulness & Growth Resources
    {
      id: 17,
      title: "Mindful Morning Routine",
      type: "audio",
      category: "mindfulness",
      duration: "10 mins",
      rating: 4.9,
      views: 856,
      description: "Start your day with intention through guided meditation and mindfulness.",
      tags: ["meditation", "morning", "routine"],
      trending: true,
      viewLink: "https://example.com/morning-routine",
      downloadLink: null
    },
    {
      id: 18,
      title: "Gratitude Journal Template",
      type: "download",
      category: "mindfulness",
      duration: "PDF",
      rating: 4.7,
      views: 1234,
      description: "Daily gratitude practice template to cultivate positivity and awareness.",
      tags: ["gratitude", "journal", "mindfulness"],
      new: true,
      viewLink: "https://example.com/gratitude-journal",
      downloadLink: "https://example.com/download/gratitude-journal.pdf"
    },
    {
      id: 19,
      title: "Mindfulness for Beginners",
      type: "video",
      category: "mindfulness",
      duration: "22 mins",
      rating: 4.6,
      views: 1789,
      description: "Introduction to mindfulness practices for stress reduction and self-awareness.",
      tags: ["mindfulness", "beginner", "meditation"],
      featured: true,
      viewLink: "https://www.youtube.com/watch?v=NxYFxjZBqHg",
      downloadLink: null
    },
    {
      id: 20,
      title: "Personal Growth Planner",
      type: "download",
      category: "mindfulness",
      duration: "PDF",
      rating: 4.8,
      views: 1456,
      description: "Comprehensive planner for setting and achieving personal development goals.",
      tags: ["growth", "planning", "goals"],
      viewLink: "https://example.com/growth-planner",
      downloadLink: "https://example.com/download/growth-planner.pdf"
    },

    // Workplace Mental Health Resources
    {
      id: 21,
      title: "Preventing Workplace Burnout",
      type: "video",
      category: "workplace",
      duration: "12 mins",
      rating: 4.7,
      views: 1123,
      description: "Recognize early signs and implement strategies to prevent burnout.",
      tags: ["burnout", "workplace", "stress"],
      featured: true,
      viewLink: "https://www.youtube.com/watch?v=smjGAcyqDnk&t=44s",
      downloadLink: null
    },
    {
      id: 22,
      title: "Work-Life Balance Assessment",
      type: "download",
      category: "workplace",
      duration: "PDF",
      rating: 4.6,
      views: 892,
      description: "Evaluate and improve your work-life balance with this self-assessment tool.",
      tags: ["work-life", "balance", "assessment"],
      viewLink: "https://example.com/work-life-balance",
      downloadLink: "https://example.com/download/work-life-assessment.pdf"
    },
    {
      id: 23,
      title: "Managing Workplace Anxiety",
      type: "article",
      category: "workplace",
      duration: "6 min read",
      rating: 4.5,
      views: 1034,
      description: "Practical strategies for dealing with anxiety in professional environments.",
      tags: ["workplace", "anxiety", "stress"],
      trending: true,
      viewLink: "https://example.com/workplace-anxiety",
      downloadLink: null
    },
    {
      id: 24,
      title: "Productivity & Mental Health Guide",
      type: "download",
      category: "workplace",
      duration: "PDF",
      rating: 4.8,
      views: 1567,
      description: "Balance productivity with mental well-being in your professional life.",
      tags: ["productivity", "mental health", "work"],
      viewLink: "https://example.com/productivity-guide",
      downloadLink: "https://example.com/download/productivity-guide.pdf"
    },

    // Youth/Student Resources (Expanded)
    {
      id: 25,
      title: "10 Ways to Reduce Stress Before Exams",
      type: "article",
      category: "youth",
      duration: "5 min read",
      rating: 4.8,
      views: 1234,
      description: "Evidence-based strategies to manage exam anxiety and perform your best.",
      tags: ["stress", "exams", "students"],
      featured: true,
      viewLink: "hhttps://www.uwslondon.ac.uk/blog/complete-guide-to-stress-and-time-management-for-students/",
      downloadLink: null
    },
    {
      id: 26,
      title: "Student Mental Health Toolkit",
      type: "download",
      category: "youth",
      duration: "PDF",
      rating: 4.9,
      views: 2234,
      description: "Comprehensive resource pack for students dealing with academic pressure.",
      tags: ["student", "toolkit", "mental health"],
      new: true,
      viewLink: "https://example.com/student-toolkit",
      downloadLink: "https://example.com/download/student-toolkit.pdf"
    },
    {
      id: 27,
      title: "Building Self-Esteem in Teens",
      type: "video",
      category: "youth",
      duration: "16 mins",
      rating: 4.6,
      views: 1678,
      description: "Guidance for teenagers to develop healthy self-esteem and confidence.",
      tags: ["self-esteem", "teenagers", "confidence"],
      viewLink: "https://example.com/teen-self-esteem",
      downloadLink: null
    },
    {
      id: 28,
      title: "Study Schedule Template",
      type: "download",
      category: "youth",
      duration: "PDF",
      rating: 4.4,
      views: 945,
      description: "Organize your study time effectively with this customizable template.",
      tags: ["study", "schedule", "organization"],
      viewLink: "https://example.com/study-template",
      downloadLink: "https://example.com/download/study-template.pdf"
    },
    {
      id: 29,
      title: "Overcoming Social Anxiety at School",
      type: "video",
      category: "youth",
      duration: "14 mins",
      rating: 4.7,
      views: 1456,
      description: "Practical tips for students struggling with social interactions and presentations.",
      tags: ["social anxiety", "school", "presentations"],
      trending: true,
      viewLink: "https://example.com/social-anxiety-school",
      downloadLink: null
    },
    {
      id: 30,
      title: "College Transition Guide",
      type: "article",
      category: "youth",
      duration: "9 min read",
      rating: 4.5,
      views: 1123,
      description: "Navigate the emotional challenges of transitioning to college life.",
      tags: ["college", "transition", "independence"],
      viewLink: "https://example.com/college-transition",
      downloadLink: null
    },
    {
      id: 31,
      title: "Academic Pressure Worksheet",
      type: "download",
      category: "youth",
      duration: "PDF",
      rating: 4.6,
      views: 834,
      description: "Identify and manage sources of academic stress with guided exercises.",
      tags: ["academic pressure", "worksheet", "stress"],
      viewLink: "https://example.com/academic-pressure",
      downloadLink: "https://example.com/download/academic-pressure.pdf"
    },
    {
      id: 32,
      title: "Time Management for Students",
      type: "infographic",
      category: "youth",
      duration: "Quick view",
      rating: 4.8,
      views: 1789,
      description: "Visual guide to effective time management techniques for academic success.",
      tags: ["time management", "productivity", "students"],
      viewLink: "https://example.com/time-management-students",
      downloadLink: "https://example.com/download/time-management.pdf"
    },

    // Workplace Mental Health Resources (Expanded)
    {
      id: 34,
      title: "Work-Life Balance Assessment",
      type: "download",
      category: "workplace",
      duration: "PDF",
      rating: 4.6,
      views: 892,
      description: "Evaluate and improve your work-life balance with this self-assessment tool.",
      tags: ["work-life", "balance", "assessment"],
      viewLink: "https://example.com/work-life-balance",
      downloadLink: "https://example.com/download/work-life-assessment.pdf"
    },
    {
      id: 35,
      title: "Managing Workplace Anxiety",
      type: "article",
      category: "workplace",
      duration: "6 min read",
      rating: 4.5,
      views: 1034,
      description: "Practical strategies for dealing with anxiety in professional environments.",
      tags: ["workplace", "anxiety", "stress"],
      trending: true,
      viewLink: "https://example.com/workplace-anxiety",
      downloadLink: null
    },
    {
      id: 36,
      title: "Productivity & Mental Health Guide",
      type: "download",
      category: "workplace",
      duration: "PDF",
      rating: 4.8,
      views: 1567,
      description: "Balance productivity with mental well-being in your professional life.",
      tags: ["productivity", "mental health", "work"],
      viewLink: "https://example.com/productivity-guide",
      downloadLink: "https://example.com/download/productivity-guide.pdf"
    },
    {
      id: 37,
      title: "Dealing with Difficult Colleagues",
      type: "video",
      category: "workplace",
      duration: "18 mins",
      rating: 4.6,
      views: 1345,
      description: "Professional strategies for handling challenging workplace relationships.",
      tags: ["colleagues", "workplace conflict", "communication"],
      viewLink: "https://example.com/difficult-colleagues",
      downloadLink: null
    },
    {
      id: 38,
      title: "Remote Work Mental Health Tips",
      type: "article",
      category: "workplace",
      duration: "7 min read",
      rating: 4.7,
      views: 1678,
      description: "Maintain mental wellness while working from home or remotely.",
      tags: ["remote work", "isolation", "mental health"],
      new: true,
      viewLink: "https://example.com/remote-work-tips",
      downloadLink: null
    },
    {
      id: 39,
      title: "Stress Management at Work Toolkit",
      type: "download",
      category: "workplace",
      duration: "PDF",
      rating: 4.8,
      views: 1234,
      description: "Complete toolkit with exercises and strategies for workplace stress.",
      tags: ["stress management", "workplace", "toolkit"],
      viewLink: "https://example.com/workplace-stress-toolkit",
      downloadLink: "https://example.com/download/workplace-stress-toolkit.pdf"
    },
    {
      id: 40,
      title: "Leadership and Mental Health",
      type: "audio",
      category: "workplace",
      duration: "22 mins",
      rating: 4.5,
      views: 987,
      description: "How to lead teams while prioritizing mental health and well-being.",
      tags: ["leadership", "team management", "mental health"],
      viewLink: "https://example.com/leadership-mental-health",
      downloadLink: null
    },

    // Relationships Resources (Expanded)
    {
      id: 41,
      title: "Building Healthy Relationships",
      type: "article",
      category: "relationships",
      duration: "8 min read",
      rating: 4.5,
      views: 934,
      description: "Communication strategies and boundary-setting in relationships.",
      tags: ["relationships", "communication", "boundaries"],
      viewLink: "https://example.com/healthy-relationships",
      downloadLink: null
    },
    {
      id: 42,
      title: "Conflict Resolution Guide",
      type: "video",
      category: "relationships",
      duration: "18 mins",
      rating: 4.7,
      views: 1567,
      description: "Learn effective techniques for resolving conflicts in any relationship.",
      tags: ["conflict", "resolution", "communication"],
      featured: true,
      viewLink: "https://example.com/conflict-resolution",
      downloadLink: null
    },
    {
      id: 43,
      title: "Relationship Assessment Tool",
      type: "download",
      category: "relationships",
      duration: "PDF",
      rating: 4.6,
      views: 723,
      description: "Evaluate the health of your relationships with this comprehensive tool.",
      tags: ["relationship", "assessment", "evaluation"],
      viewLink: "https://www.wvdhhr.org/wvhomevisitation/forms/Relationship_Assessment_Tool.pdf",
      downloadLink: "https://www.wvdhhr.org/wvhomevisitation/forms/Relationship_Assessment_Tool.pdf"
    },
    {
      id: 44,
      title: "Love Languages Explained",
      type: "infographic",
      category: "relationships",
      duration: "Quick view",
      rating: 4.8,
      views: 2145,
      description: "Visual guide to understanding and applying the five love languages.",
      tags: ["love languages", "relationships", "communication"],
      viewLink: "https://example.com/love-languages",
      downloadLink: "https://example.com/download/love-languages.pdf"
    },
    {
      id: 45,
      title: "Dealing with Toxic Relationships",
      type: "video",
      category: "relationships",
      duration: "20 mins",
      rating: 4.9,
      views: 2456,
      description: "Recognize signs of toxic relationships and learn how to protect yourself.",
      tags: ["toxic relationships", "red flags", "self-protection"],
      trending: true,
      viewLink: "https://www.youtube.com/watch?v=NtDLPzsR-Gg",
      downloadLink: "https://www.youtube.com/watch?v=NtDLPzsR-Gg"
    },
    {
      id: 46,
      title: "Family Therapy Exercises",
      type: "article",
      category: "relationships",
      duration: "PDF",
      rating: 4.4,
      views: 1123,
      description: "At-home exercises to improve family communication and bonding.",
      tags: ["family therapy", "exercises", "communication"],
      viewLink: "https://positivepsychology.com/family-therapy-techniques/",
      downloadLink: "https://example.com/download/family-exercises.pdf"
    },
    {
      id: 47,
      title: "Long-Distance Relationship Survival",
      type: "article",
      category: "relationships",
      duration: "10 min read",
      rating: 4.6,
      views: 1345,
      description: "Maintain strong connections across the miles with practical advice.",
      tags: ["long distance", "relationships", "connection"],
      viewLink: "https://markmanson.net/long-distance-relationships",
      downloadLink: null
    },
    {
      id: 48,
      title: "Dating After Divorce Guide",
      type: "audio",
      category: "relationships",
      duration: "28 mins",
      rating: 4.7,
      views: 1789,
      description: "Navigate the emotional journey of dating again after divorce.",
      tags: ["dating", "divorce", "healing"],
      new: true,
      viewLink: "https://podcasts.apple.com/us/podcast/the-dating-after-divorce-survival-guide/id1486480336",
      downloadLink: null
    },
    {
      id: 49,
      title: "Couple's Communication Workbook",
      type: "download",
      category: "relationships",
      duration: "PDF",
      rating: 4.8,
      views: 1567,
      description: "Strengthen your relationship with guided communication exercises.",
      tags: ["couples", "communication", "workbook"],
      viewLink: "https://example.com/couples-workbook",
      downloadLink: "https://example.com/download/couples-workbook.pdf"
    }
  ];

export const moods = [
  { label: '😄', value: 'happy', name: 'Happy', color: 'from-yellow-400 to-orange-500' },
  { label: '😢', value: 'sad', name: 'Sad', color: 'from-blue-300 to-blue-500' },
  { label: '😡', value: 'angry', name: 'Angry', color: 'from-red-400 to-red-600' },
  { label: '😌', value: 'calm', name: 'Calm', color: 'from-green-300 to-green-500' },
  { label: '😨', value: 'anxious', name: 'Anxious', color: 'from-purple-300 to-purple-600' },
];


export const questions = [
  "I feel overwhelmed easily.",
  "I often feel anxious or stressed.",
  "I find it hard to relax even during free time.",
  "I sleep well and wake up refreshed.",
  "I find joy in everyday activities.",
];

  export const benefits = [
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Set your own schedule and work when it suits you best"
    },
    {
      icon: Users,
      title: "Client-Matching Support",
      description: "We connect you with clients who are the right fit for your expertise"
    },
    {
      icon: FileText,
      title: "Reduced Admin Burden",
      description: "Focus on what you do best - we handle the paperwork"
    },
    {
      icon: Heart,
      title: "Professional Community",
      description: "Join a supportive network of mental health professionals"
    }
  ];

  export const stats = [
    { number: "98%", label: "Client Satisfaction" },
    { number: "24/7", label: "Platform Support" }
  ];

export const SpecialtyData = [
    {
        specialty: 'Marriage and Family Counsellor',
        image: Family
    },
    {
        specialty: 'School Counsellor',
        image: Student
    },
    {
        specialty: 'Rehabilitation Counsellor',
        image: Rehabilitation
    },
    {
        specialty: 'Substance Abuse Counsellor',
        image: Drugs
    },
    {
        specialty: 'Mental Health Counsellor',
        image: Mental
    },
    {
        specialty: 'Career Counsellor',
        image: Career
    },
]
 
export const team = [
    {
        id: 1,
        name: "Mrs. Victoria De-Graft Adjei",
        image: vic,
        about: "Mrs. Victoria is a Counselling Psychologist with varied experience in career guidance/development, educational/academic counselling, job placement and vocational counselling. She is a Senior Assistant Registrar/Senior Counsellor in the KNUST Counselling Center (KCC). She holds a bachelor's degree in Psychology from the University of Cape Coast and master's degrees in Health Education & Promotion and Guidance & Counselling from KNUST and University of Cape Coast respectively, all in Ghana.",
        linkedin: "https://linkedin.com/in/victoria-degraft-adjei" 
    },
    {
        id: 2,
        name: "Osei Tutu Dickson",
        image: profile_pic,
        about: "Dickson, our Lead Developer, passionately builds and enhances our platform daily to perfectly support counsellors and clients, combining cutting-edge technology with his deep commitment to mental health accessibility. His technical expertise ensures our members enjoy seamless, exceptional experiences while his genuine care for mental wellness drives every innovation—because he believes great technology should make quality care more empowering and available to all at anytime.",
        linkedin: "https://linkedin.com/in/osei-tutu-dickson"
    },
    {
        id: 3, 
        name: "Elorm Ahanogbe",
        image: elorm,
        about: "Elorm, our Software Engineer, provides steady support in maintaining and optimizing our platform's core systems. With a meticulous approach to troubleshooting and system stability, he helps ensure our technical infrastructure runs smoothly behind the scenes. While working with the team, Elorm focuses on incremental improvements that collectively enhance our platform's reliability and performance over time",
        linkedin: "https://linkedin.com/in/elorm-ahanogbe"
    },
]

export const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Anxiety Management",
      avatar: "https://th.bing.com/th/id/OIP.Qei0L3UNSa4c_5DOXiPRgQHaEK?rs=1&pid=ImgDetMain",
      text: "This AI system has been a game-changer for my anxiety. The daily check-ins and personalized coping strategies have helped me manage my symptoms much better than traditional therapy alone.",
      rating: 5,
      date: "2025-01-15"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Depression Support",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "I was skeptical at first, but the AI's ability to recognize patterns in my mood and suggest interventions has been surprisingly accurate. It's like having a therapist available 24/7.",
      rating: 4,
      date: "2025-01-28"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Stress Reduction",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      text: "The mindfulness exercises recommended by the AI are perfectly tailored to my needs. I've seen a significant reduction in my stress levels since using this system regularly.",
      rating: 5,
      date: "2025-02-02"
    },
    {
      id: 4,
      name: "David Kim",
      role: "PTSD Management",
      avatar: "https://randomuser.me/api/portraits/men/76.jpg",
      text: "As a veteran with PTSD, I've found the AI's trauma-sensitive approach incredibly helpful. The gradual exposure techniques have made a real difference in my daily life.",
      rating: 4,
      date: "2025-02-20"
    },
    {
      id: 5,
      name: "Jamal Williams",
      role: "Community Therapist",
      avatar: "https://th.bing.com/th/id/R.af74dcf90495b32dc4c5d80caacf109d?rik=b8L%2b9gi3c2ioAg&pid=ImgRaw&r=0",
      text: "As a Black man, I appreciate how culturally aware this AI system is. It understands the unique stressors our community faces and provides relevant coping mechanisms.",
      rating: 5,
      date: "2025-03-15"
    },
    {
      id: 6,
      name: "Keisha Thompson",
      role: "Social Worker",
      avatar: "https://randomuser.me/api/portraits/women/90.jpg",
      text: "This system has been invaluable for my clients in underserved communities. The AI's ability to recognize racial trauma and suggest appropriate resources is groundbreaking.",
      rating: 5,
      date: "2025-04-01"
    },
     {
      id: 7,
      name: "Sarah Johnson",
      role: "College Student",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c2c5?w=150&h=150&fit=crop&crop=faces",
      text: "The AI chatbot helped me through my anxiety attacks at 3 AM when no one else was available. Truly life-saving.",
      rating: 5,
      date: "2024-11-15"
    },
    {
      id: 8,
      name: "Michael Chen",
      role: "Software Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
      text: "As someone who struggles with social anxiety, having 24/7 access to mental health support has been incredible.",
      rating: 5,
      date: "2024-11-12"
    },
    {
      id: 9,
      name: "Emma Rodriguez",
      role: "Teacher",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces",
      text: "The coping strategies suggested by the AI are practical and actually work. I use them daily with my students too.",
      rating: 4,
      date: "2024-11-10"
    },
    {
      id: 104,
      name: "David Thompson",
      role: "Marketing Manager",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
      text: "The connection to local therapists feature saved me weeks of research. Found the perfect match immediately.",
      rating: 5,
      date: "2024-11-08"
    },
    {
      id: 105,
      name: "Lisa Park",
      role: "Nurse",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
      text: "Working in healthcare is stressful. This platform provides the emotional support I need after difficult shifts.",
      rating: 5,
      date: "2024-11-05"
    },
    {
      id: 106,
      name: "James Wilson",
      role: "Retired Teacher",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=faces",
      text: "Even at my age, I found the technology easy to use. The AI is patient and understanding.",
      rating: 4,
      date: "2024-11-03"
    },
    {
      id: 107,
      name: "Amanda Foster",
      role: "Graduate Student",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=faces",
      text: "Thesis stress was overwhelming me. The AI helped me develop healthy coping mechanisms that actually work.",
      rating: 5,
      date: "2024-11-01"
    },
    {
      id: 108,
      name: "Robert Kim",
      role: "Small Business Owner",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
      text: "Running a business is lonely and stressful. Having 24/7 mental health support has been a game-changer.",
      rating: 5,
      date: "2024-10-28"
    },
    {
      id: 109,
      name: "Maria Gonzalez",
      role: "Social Worker",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=faces",
      text: "I recommend this platform to my clients. The AI provides consistent, non-judgmental support.",
      rating: 4,
      date: "2024-10-25"
    },
    {
      id: 110,
      name: "Kevin O'Brien",
      role: "Construction Worker",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces",
      text: "Never thought I'd use something like this, but it's helped me deal with work stress and family issues.",
      rating: 4,
      date: "2024-10-22"
    },
    {
      id: 111,
      name: "Jennifer Hayes",
      role: "Stay-at-home Mom",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=faces",
      text: "Postpartum depression was hitting hard. The AI provided immediate support when I needed it most.",
      rating: 5,
      date: "2024-10-20"
    },
    {
      id: 112,
      name: "Alex Turner",
      role: "Graphic Designer",
      avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=faces",
      text: "Creative blocks and self-doubt were paralyzing me. This platform helped me rediscover my confidence.",
      rating: 5,
      date: "2024-10-18"
    },
    {
      id: 113,
      name: "Rachel Green",
      role: "HR Specialist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
      text: "Dealing with workplace conflicts daily was draining. The AI taught me better stress management techniques.",
      rating: 4,
      date: "2024-10-15"
    },
    {
      id: 114,
      name: "Daniel Martinez",
      role: "Firefighter",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces",
      text: "First responder PTSD is real. This platform provides the support our profession desperately needs.",
      rating: 5,
      date: "2024-10-12"
    },
    {
      id: 115,
      name: "Sophie Anderson",
      role: "Medical Student",
      avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=faces",
      text: "Medical school stress was overwhelming. The AI helped me develop healthy study habits and stress relief.",
      rating: 5,
      date: "2024-10-10"
    },
    {
      id: 116,
      name: "Marcus Johnson",
      role: "Veteran",
      avatar: "https://images.unsplash.com/photo-1507038772120-7fff76f79d79?w=150&h=150&fit=crop&crop=faces",
      text: "Transitioning to civilian life was tough. The AI provided non-judgmental support when I needed it most.",
      rating: 5,
      date: "2024-10-08"
    },
    {
      id: 117,
      name: "Chloe Williams",
      role: "High School Student",
      avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=faces",
      text: "College prep stress and social anxiety were getting to me. This platform helped me cope with teenage pressures.",
      rating: 4,
      date: "2024-10-05"
    },
    {
      id: 118,
      name: "Ryan Cooper",
      role: "Sales Representative",
      avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=150&h=150&fit=crop&crop=faces",
      text: "Rejection in sales was affecting my self-esteem. The AI helped me build resilience and maintain motivation.",
      rating: 4,
      date: "2024-10-03"
    },
    {
      id: 119,
      name: "Grace Liu",
      role: "Accountant",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=faces",
      text: "Tax season stress was unbearable. The mindfulness exercises suggested by the AI really helped me stay calm.",
      rating: 4,
      date: "2024-10-01"
    },
    {
      id: 120,
      name: "Tyler Brooks",
      role: "Restaurant Manager",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=faces",
      text: "Managing a restaurant during COVID was incredibly stressful. This platform provided consistent emotional support.",
      rating: 5,
      date: "2024-09-28"
    }
  ];
  

export const counsellors = [
    {
        _id: 'coun1',
        name: 'Prof. Richard James',
        image: coun1,
        specialty: 'Marriage and Family Counsellor',
        degree: 'MA in MFT/MMFT',
        experience: '14 Years',
        about: 'As a Marriage and Family Therapist, I am dedicated to helping couples, families and individuals build stronger, healthier relationships. I provide a safe and supportive space to explore communication patterns, resolve conflicts and navigate life is challenges together, fostering deeper connections and lasting well-being.',
        fees: 50,
        location: 'London, Ring Road, UK'
    },
    {
        _id: 'coun2',
        name: 'Ms. Emily Larson',
        image: coun2,
        specialty: 'School Counsellor',
        degree: 'MEd in Counseling',
        experience: '6 Years',
        about: 'As a School Counselor, my mission is to empower students to reach their full potential—academically, socially, and emotionally. I provide a supportive environment where students can explore their strengths, overcome obstacles and develop the skills they need to thrive in school and beyond.',
        fees: 30,
        location:'Ottawa, Elgin St, Canada'
        
    },
    {
        _id: 'coun4',
        name: 'Dr. Jian Li',
        image: coun4,
        specialty: 'Substance Abuse Counsellor',
        degree: 'PsyD',
        experience: '14 Years',
        about: 'As a Substance Abuse Counselor, I provide a supportive and non-judgmental environment for individuals and families struggling with addiction. I offer guidance, resources, and evidence-based strategies to help you break free from the cycle of substance abuse, reclaim your life, and build a path towards lasting recovery.',
        fees: 40,
        location: 'Beijing, Shogum Road, China'
    },
    {
        _id: 'coun3',
        name: 'Dr. Kiara Sharma',
        image: coun3,
        specialty: 'Rehabilitation Counsellor',
        degree: 'EdD in Counseling Psychology',
        experience: '8 Years',
        about: 'As a Rehabilitation Counselor, my goal is to empower individuals with disabilities to achieve their personal and professional goals. I provide support, guidance, and advocacy to help you overcome barriers, develop independent living skills, and find meaningful employment opportunities, fostering independence and self-sufficiency.',
        fees: 30,
        location: 'New Delhi, Veera Road, India'
    },
    {
        _id: 'coun5',
        name: 'Prof. Denzel Lukeman',
        image: coun5,
        specialty: 'Mental Health Counsellor',
        degree: 'PsyD',
        experience: '28 Years',
        about: 'As a Mental Health Counselor, I am committed to supporting individuals on their journey towards improved mental and emotional well-being. I offer a compassionate and evidence-based approach to help you navigate challenges such as anxiety, depression, trauma, and other mental health concerns, empowering you to build a fulfilling and meaningful life.',
        fees: 60,
        loction: 'Washington DC, Barney Circle, USA'
    },
    {
        _id: 'coun6',
        name: 'Dr. Rohan Kumar Sharma',
        image: coun6,
        specialty: 'Mental Health Counsellor',
        degree: 'PsyD',
        experience: '26 Years',
        about: ' As a Mental Health Counselor, I am committed to supporting individuals on their journey towards improved mental and emotional well-being. I offer a compassionate and evidence-based approach to help you navigate challenges such as anxiety, depression, trauma, and other mental health concerns, empowering you to build a fulfilling and meaningful life.',
        fees: 50,
        location: 'Asia India'
    },
    {
        _id: 'coun7',
        name: 'Ms. Mei Wang',
        image: coun7,
        specialty: 'Career Counsellor',
        degree: 'MPC',
        experience: '5 Years',
        about: ' As a Career Counselor, I am passionate about helping individuals discover their strengths, explore career options, and create a fulfilling professional life. I provide guidance and support throughout the career exploration process, from identifying your skills and interests to crafting a compelling resume and navigating the job market.',
        fees: 20,
        location: 'Asia, Japan'
        
    },
    {
        _id: 'coun8',
        name: 'Prof. Timothy White',
        image: coun8,
        specialty: 'Marriage and Family Counsellor',
        degree: 'MA in MFT/MMFT',
        experience: '31 Years',
        about: 'As a Marriage and Family Therapist, I am dedicated to helping couples, families, and individuals build stronger, healthier relationships. I provide a safe and supportive space to explore communication patterns, resolve conflicts, and navigate life is challenges together, fostering deeper connections and lasting well-being.',
        fees: 60,
        location: 'Europe, Germany'

    },
    {
        _id: 'coun9',
        name: 'Ms. Amina Fatima Zohra',
        image: coun9,
        specialty: 'School Counsellor',
        degree: ' MEd in Counseling',
        experience: '5 Years',
        about: 'Guiding students through academic challenges, social development, and career planning to build confident, well-rounded individuals',
        fees: 25,
        location: 'Africa, Algeria'
    },
    {
        _id: 'coun10',
        name: 'Dr. Jens Peter Hansen',
        image: coun10,
        specialty: 'Substance Abuse Counsellor',
        degree: 'PsyD',
        experience: '30 Years',
        about: 'Trauma-informed care for PTSD, abuse survivors, and those healing from grief or loss.',
        fees: 55,
        location: 'Europe, Denmark'
    },
    {
        _id: 'coun11',
        name: 'Dr. Tan Mei Ling',
        image: coun11,
        specialty: 'Mental Health Counsellor',
        degree: 'PsyD',
        experience: '7 Years',
        about: 'Perinatal and postpartum support for parents navigating depression or adjustment challenges.',
        fees: 40,
        location: 'Asia, Malaysia'
    },
    {
        _id: 'coun12',
        name: 'Dr. Juan Carlos Hernández García',
        image: coun12,
        specialty: 'Mental Health Counsellor',
        degree: 'PsyD',
        experience: '6 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Mexico'
    },
    {
        _id: 'coun13',
        name: 'Mr. Isaac Asiamah',
        image: coun13,
        specialty: 'Career Counsellor',
        degree: 'MPC',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        loction: 'Africa, Ghana'
    },
    {
        _id: 'coun14',
        name: 'Mr.  Mikael Juhani Niemi',
        image: coun14,
        specialty: 'Marriage and Family Counsellor',
        degree: 'MA in MFT/MMFT',
        experience: '12 Years',
        about: 'As a Marriage and Family Therapist, I am dedicated to helping couples, families, and individuals build stronger, healthier relationships. I provide a safe and supportive space to explore communication patterns, resolve conflicts, and navigate life is challenges together, fostering deeper connections and lasting well-being.',
        fees: 45,
        location: 'Europe, Finland'
    },
    {
        _id: 'coun15',
        name: 'Mrs. Amelia Hill',
        image: coun15,
        specialty: 'Career Counsellor',
        degree: 'MPC',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'North America, Guatemala'
    },
    {
        _id: 'coun16',
        name: 'Prof. Juan Carlos Pérez',
        image: coun16,
        specialty: 'Career Counsellor',
        degree: 'MPC',
        experience: '28 Years',
        about: 'Mr. Maxwell has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 55,
        location: 'North America, Panana'
    },
    {
        _id: 'coun17',
        name: 'Mr. Dickson Osei Tutu',
        image: coun17,
        specialty: 'School Counsellor',
        degree: ' MEd in Counseling',
        experience: '6 Years',
        about: 'Mr. Dickson has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 25,
        location: 'Africa, Ghana'
    },
    {
        _id: 'coun18',
        name: 'Dr. Muhammad Ali Khan',
        image: coun18,
        specialty: 'Substance Abuse Counsellor',
        degree: 'PsyD',
        experience: '9 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Asia, Pakistan'
    },
    {
        _id: 'coun19',
        name: 'Prof. Felicia Antwi',
        image: coun19,
        specialty: 'Marriage and Family Counsellor',
        degree: 'MA in MFT/MMFT',
        experience: '16 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        location: 'Africa, Ghana'
    },
    {
        _id: 'coun20',
        name: 'Dr. Thanawat Wongchai',
        image: coun20,
        specialty: 'Rehabilitation Counsellor',
        degree: 'EdD in Counseling Psychology',
        experience: '12 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 35,
        location: 'Asia, Thailand'
    },
    {
        _id: 'coun21',
        name: 'Mr. Aarav Singh',
        image: coun21,
        specialty: 'School Counsellor',
        degree: ' MEd in Counseling',
        experience: '8 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 25,
        location: 'Asia, India'
    },
    {
        _id: 'coun22',
        name: 'Ms. Maria Sofia Rodriguez',
        image: coun22,
        specialty: 'Career Counsellor',
        degree: 'MPC',
        experience: '8 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 25,
        location: 'Asia, Philippines'
    },
    {
        _id: 'coun23',
        name: 'Dr. Franjo Tuđman',
        image: coun23,
        specialty: 'Substance Abuse Counsellor',
        degree: 'PsyD',
        experience: '14 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        location: 'Europe, Crotia'
    },
    {
        _id: 'coun24',
        name: 'Mr. Alessandro Marku ',
        image: coun24,
        specialty: 'Marriage and Family Counsellor',
        degree: 'MA in MFT/MMFT',
        experience: '11 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        locatio:  'Europe, Italy'
    },
    {
        _id: 'coun25',
        name: 'Dr. Ali Bongo Ondimba',
        image: coun25,
        specialty: 'Mental Health Counsellor',
        degree: 'PsyD',
        experience: '7 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Gabon'
    },
    {
        _id: 'coun26',
        name: 'Dr. Ji-Hyun Lee',
        image: coun26,
        specialty: 'Rehabilitation Counsellor',
        degree: ' EdD in Counseling Psychology',
        experience: '10 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        loaction: 'Asia, Korea'
    },
    {
        _id: 'coun27',
        name: 'Mr. Dmitriy Sergeyevich Kovalyov',
        image: coun27,
        specialty: 'Rehabilitation Counsellor',
        degree: ' EdD in Counseling Psychology',
        experience: '11 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Asia, Russia'
    },
    {
        _id: 'coun28',
        name: 'Ms. Blue Tamika',
        image: coun28,
        specialty: 'School Counsellor',
        degree: ' MEd in Counseling',
        experience: '8 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 20,
        location: 'Europe, Iceland'
    },
    {
        _id: 'coun29',
        name: 'Mr. Austin Ferdnardo',
        image: coun29,
        specialty: 'Career Counsellor',
        degree: 'MPC',
        experience: '15 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        location: 'North America, Mexico'
    },
    {
        _id: 'coun30',
        name: 'Mr. Chen Yang',
        image: coun30,
        specialty: 'Family and Marriage Counsellor',
        degree: 'MBBS',
        experience: '22 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        location: 'Asia, China'
    },
    {
        _id: 'coun31',
        name: 'Dr. Anna Sofia Johansson',
        image: coun31,
        specialty: 'Substance Abuse Counsellor',
        degree: 'PsyD',
        experience: '9 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Europe, Sweden'
    },
    {
        _id: 'coun32',
        name: 'Dr. Festus Mogae',
        image: coun32,
        specialty: 'Mental Health Counsellor',
        degree: 'PsyD',
        experience: '7 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: ' Africa, Botswana'
    },
    {
        _id: 'coun33',
        name: 'Dr. Mohammed Amine Benyahia',
        image: coun33,
        specialty: 'Substance Abuse Counsellor',
        degree: 'PsyD',
        experience: '8 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Africa, Algeria'
    },
    {
        _id: 'coun34',
        name: 'Dr. Denzel Trump',
        image: coun34,
        specialty: 'Rehabilitation Counsellor',
        degree: ' EdD in Counseling Psychology',
        experience: '11 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 35,
        location: 'Europe, US'
    },
    {
        _id: 'coun35',
        name: 'Prof. Mariam Sherif',
        image: coun35,
        specialty: 'School Counsellor',
        degree: ' MEd in Counseling',
        experience: '11 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Africa, Egypt'
    },
    {
        _id: 'coun36',
        name: 'Prof. Grace Mugabe',
        image: coun36,
        specialty: 'Marriage and Family Counsellor',
        degree: 'MA in MFT/MMFT',
        experience: '18 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        loction: 'Africa, Zimbabwe'
    },
    {
        _id: 'coun37',
        name: 'Mr. Yemi Osinbajo',
        image: coun37,
        specialty: 'School Counsellor',
        degree: ' MEd in Counseling',
        experience: '7 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 25,
        location: 'Africa, Nigeria'
    },
    {
        _id: 'coun38',
        name: 'Dr. Min-Ji Park',
        image: coun38,
        specialty: 'Rehabilitation Counsellor',
        degree: ' EdD in Counseling Psychology',
        experience: '13 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        location: 'Asia, Korea'
    },
    {
        _id: 'coun39',
        name: 'Dr. Christopher Lee',
        image: coun39,
        specialty: 'Substance Abuse Counsellor',
        degree: 'PsyD',
        experience: '21 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        location: 'Asia, Japan'
    },
    {
        _id: 'coun40',
        name: 'Dr. Georgina Woods',
        image: coun40,
        specialty: 'Mental Health Counsellor',
        degree: 'PsyD',
        experience: '7 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Europe, USA'
    },
    {
        _id: 'coun41',
        name: 'Dr. Aisha Gaddafi',
        image: coun41,
        specialty: 'Mental Health Counsellor',
        degree: 'PsyD',
        experience: '7 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 35,
        location: 'Africa, Libya'
    },
    {
        _id: 'coun42',
        name: 'Mr. Paul Kaba Thieba',
        image: coun42,
        specialty: 'Career Counsellor',
        degree: 'MPC',
        experience: '9 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        loction: 'Africa, Burkina Faso'
    },
    {
        _id: 'coun43',
        name: 'Mrs. Emiko Suzuki',
        image: coun43,
        specialty: 'Marriage and Family Counsellor',
        degree: 'MA in MFT/MMFT',
        experience: ' Years',
        about: 'As a Marriage and Family Therapist, I am dedicated to helping couples, families, and individuals build stronger, healthier relationships. I provide a safe and supportive space to explore communication patterns, resolve conflicts, and navigate life is challenges together, fostering deeper connections and lasting well-being.',
        fees: 30,
        location: 'Asia, Japan'
    },
    {
        _id: 'coun44',
        name: 'Mr. Moussa Dadis Camara',
        image: coun44,
        specialty: 'School Counsellor',
        degree: ' MEd in Counseling',
        experience: '9 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Africa, Guinea'
    },
    {
        _id: 'coun45',
        name: 'Dr. Tan Kok Sing',
        image: coun45,
        specialty: 'Substance Abuse Counsellor',
        degree: 'PsyD',
        experience: '10 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Asia, Malaysia'
    },
    {
        _id: 'coun46',
        name: 'Dr. Mulatu Teshome',
        image: coun46,
        specialty: 'Mental Health Counsellor',
        degree: 'PsyD',
        experience: '6 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Africa, Ethiopia'
    },
    {
        _id: 'coun47',
        name: 'Dr. Ana Patricia Santos',
        image: coun47,
        specialty: 'Mental Health Counsellor',
        degree: 'PsyD',
        experience: '6 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 25,
        location: 'Asia, Philippines'
    },
    {
        _id: 'coun48',
        name: 'Mr.Yoweri Museveni',
        image: coun48,
        specialty: 'Career Counsellor',
        degree: 'MPC',
        experience: '7 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 25,
        loction: ' Africa, Uganda'
    },
    {
        _id: 'coun49',
        name: 'Mrs. Mei Wang',
        image: coun49,
        specialty: 'Marriage and Family Counsellor',
        degree: 'MA in MFT/MMFT',
        experience: '12 Years',
        about: 'As a Marriage and Family Therapist, I am dedicated to helping couples, families, and individuals build stronger, healthier relationships. I provide a safe and supportive space to explore communication patterns, resolve conflicts, and navigate life is challenges together, fostering deeper connections and lasting well-being.',
        fees: 30,
        location: 'Asia, China'
    },
    {
        _id: 'coun50',
        name: 'Mrs. Janeth Magufuli',
        image: coun50,
        specialty: 'Career Counsellor',
        degree: 'MPC',
        experience: '13 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Africa, Tanzania'
    },
    {
        _id: 'coun51',
        name: 'mr.  Jae-Ho Lee',
        image: coun51,
        specialty: 'Career Counsellor',
        degree: 'MPC',
        experience: '8 Years',
        about: 'Mr. Maxwell has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Asia, Korea'
    },
    {
        _id: 'coun52',
        name: 'Ms. Ásta Jóhannesdóttir',
        image: coun52,
        specialty: 'School Counsellor',
        degree: ' MEd in Counseling',
        experience: '5 Years',
        about: 'Mr. Dickson has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 25,
        location: 'Europe, Belgium'
    },
    {
        _id: 'coun53',
        name: 'Prof. Marie Sophie Dupont',
        image: coun53,
        specialty: 'Substance Abuse Counsellor',
        degree: 'PsyD',
        experience: '15 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 45,
        location: 'Europe, France'
    },
    {
        _id: 'coun54',
        name: 'mr.  Hans-Adam',
        image: coun54,
        specialty: 'Marriage and Family Counsellor',
        degree: 'MA in MFT/MMFT',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Europe, Liechtenstein'
    },
    {
        _id: 'coun55',
        name: 'Dr. Zanele Mbeki',
        image: coun55,
        specialty: 'Rehabilitation Counsellor',
        degree: ' EdD in Counseling Psychology',
        experience: '8 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: ' Africa, South Africa'
    },
    {
        _id: 'coun56',
        name: 'PROF. Ankica Tuđman',
        image: coun56,
        specialty: 'School Counsellor',
        degree: ' MEd in Counseling',
        experience: '16 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        location: 'Europe, Croatia'
    },
    {
        _id: 'coun57',
        name: 'Ms. Anna Komorowska',
        image: coun57,
        specialty: 'Career Counsellor',
        degree: 'MPC',
        experience: '9 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Europe, Poland'
    },
    {
        _id: 'coun58',
        name: 'Prof. Kenji Nakamura',
        image: coun58,
        specialty: 'Substance Abuse Counsellor',
        degree: 'PsyD',
        experience: '16 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 45,
        location: ''
    },
    {
        _id: 'coun59',
        name: 'Mrs. Auxillia Mnangagwa',
        image: coun59,
        specialty: 'Marriage and Family Counsellor',
        degree: 'MA in MFT/MMFT',
        experience: '12 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 35,
        location: 'Africa, Madagascar'
    },
    {
        _id: 'coun60',
        name: 'Dr.  Carlos Enrique López',
        image: coun60,
        specialty: 'Mental Health Counsellor',
        degree: 'PsyD',
        experience: '11 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 35,
        location: 'Argentina'
    },
    {
        _id: 'coun61',
        name: 'Dr. Ali Mohammed',
        image: coun61,
        specialty: 'Rehabilitation Counsellor',
        degree: ' EdD in Counseling Psychology',
        experience: '13 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 35,
        location: 'Asia, Iraq'
    },
    {
        _id: 'coun62',
        name: 'Dr. Luana Cristina Santos',
        image: coun62,
        specialty: 'Rehabilitation Counsellor',
        degree: ' EdD in Counseling Psychology',
        experience: '7 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'South America, Brazil'
    },
    {
        _id: 'coun63',
        name: 'Ms. Sofía Isabel',
        image: coun63,
        specialty: 'School Counsellor',
        degree: ' MEd in Counseling',
        experience: '9 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'South America, Colombia'
    },
    {
        _id: 'coun64',
        name: 'Mrs. Santiago Mateo Fernández',
        image: coun64,
        specialty: 'Career Counsellor',
        degree: 'MPC',
        experience: '14 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'South America, Ecuador'
    },
    {
        _id: 'coun65',
        name: 'Mr. Mateo Julián Gómez',
        image: coun65,
        specialty: 'Family and Marriage Counsellor',
        degree: 'MBBS',
        experience: '10 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'South America, Paraguay'
    },
    {
        _id: 'coun66',
        name: 'Dr. Manuel Vicente',
        image: coun66,
        specialty: 'Substance Abuse Counsellor',
        degree: 'PsyD',
        experience: '10 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Africa, Kenya'
    },
    {
        _id: 'coun67',
        name: 'Dr. Gulzhan Askarovna',
        image: coun67,
        specialty: 'Mental Health Counsellor',
        degree: 'PsyD',
        experience: '11 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        location: 'Europe, Ukraine'
    },
    {
        _id: 'coun68',
        name: 'Dr. Amina Lahbabi',
        image: coun68,
        specialty: 'Substance Abuse Counsellor',
        degree: 'PsyD',
        experience: '9 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Africa, Morocco'
    },
    {
        _id: 'coun69',
        name: 'Dr. Youssef Chahed',
        image: coun69,
        specialty: 'Rehabilitation Counsellor',
        degree: ' EdD in Counseling Psychology',
        experience: '10 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Africa, Tunisia'
    },
    {
        _id: 'coun70',
        name: 'Ms.  Ava Sophia Patel',
        image: coun70,
        specialty: 'School Counsellor',
        degree: ' MEd in Counseling',
        experience: '5 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        location: 'Australia'
    },
    {
        _id: 'coun71',
        name: 'Prof. Emily Anne Wilson',
        image: coun71,
        specialty: 'School Counsellor',
        degree: ' MEd in Counseling',
        experience: '30 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 55,
        location: 'Australia'
    },
]