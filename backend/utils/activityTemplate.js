const activityTemplates = {
  daily_reflection: {
    name: "Daily Reflection",
    description: "A structured daily reflection exercise to promote self-awareness and mindfulness",
    suggestedDuration: 15,
    maxDuration: 30,
    defaultInstructions: [
      "Find a quiet space where you won't be interrupted",
      "Take three deep breaths to center yourself",
      "Reflect on today's experiences, emotions, and thoughts",
      "Write down three things you're grateful for",
      "Identify one thing you learned about yourself today",
      "Set a positive intention for tomorrow"
    ],
    suggestedResources: [
      {
        type: "article",
        url: "https://example.com/daily-reflection-guide",
        title: "Guide to Daily Reflection Practice"
      }
    ],
    promptQuestions: [
      "What emotions did I experience today?",
      "What challenged me today and how did I handle it?",
      "What am I most grateful for today?",
      "How did I show kindness to myself or others today?",
      "What would I like to improve tomorrow?"
    ]
  },

  mood_checking: {
    name: "Mood Check-in",
    description: "A quick daily assessment to track and understand your emotional patterns",
    suggestedDuration: 10,
    maxDuration: 20,
    defaultInstructions: [
      "Rate your overall mood on a scale of 1-10",
      "Identify the primary emotions you're feeling",
      "Notice any physical sensations in your body",
      "Reflect on what might be influencing your mood",
      "Choose one small action to support your wellbeing",
      "Record your mood and any insights"
    ],
    suggestedResources: [
      {
        type: "article",
        url: "https://example.com/mood-tracking-benefits",
        title: "Benefits of Daily Mood Tracking"
      }
    ],
    moodScale: [
      { value: 1, label: "Very Low", color: "#dc2626" },
      { value: 2, label: "Low", color: "#ea580c" },
      { value: 3, label: "Below Average", color: "#d97706" },
      { value: 4, label: "Fair", color: "#ca8a04" },
      { value: 5, label: "Average", color: "#eab308" },
      { value: 6, label: "Good", color: "#84cc16" },
      { value: 7, label: "Very Good", color: "#22c55e" },
      { value: 8, label: "Great", color: "#10b981" },
      { value: 9, label: "Excellent", color: "#059669" },
      { value: 10, label: "Outstanding", color: "#047857" }
    ]
  },

  meditation: {
    name: "Guided Meditation",
    description: "Mindfulness and meditation exercises for stress relief and mental clarity",
    suggestedDuration: 20,
    maxDuration: 60,
    defaultInstructions: [
      "Find a comfortable seated position",
      "Close your eyes or soften your gaze",
      "Begin with natural breathing",
      "Focus on the sensation of breath entering and leaving your body",
      "When your mind wanders, gently return focus to your breath",
      "End with a few moments of gratitude"
    ],
    suggestedResources: [
      {
        type: "audio",
        url: "https://example.com/guided-meditation",
        title: "10-Minute Beginner's Meditation"
      }
    ],
    techniques: [
      "Breath Awareness",
      "Body Scan",
      "Loving-Kindness",
      "Mindful Observation",
      "Walking Meditation"
    ]
  },

  exercise: {
    name: "Physical Exercise",
    description: "Physical activities designed to boost mood and energy levels",
    suggestedDuration: 30,
    maxDuration: 90,
    defaultInstructions: [
      "Start with a 5-minute warm-up",
      "Choose exercises appropriate for your fitness level",
      "Focus on proper form over intensity",
      "Listen to your body and rest when needed",
      "Stay hydrated throughout the session",
      "Cool down with stretching for 5-10 minutes"
    ],
    suggestedResources: [
      {
        type: "video",
        url: "https://example.com/beginner-workout",
        title: "15-Minute Beginner Workout"
      }
    ],
    exerciseTypes: [
      "Cardio (walking, jogging, dancing)",
      "Strength training (bodyweight exercises)",
      "Flexibility (yoga, stretching)",
      "Balance (tai chi, stability exercises)",
      "Sports activities"
    ]
  },

  journaling: {
    name: "Therapeutic Journaling",
    description: "Structured writing exercises for emotional processing and self-discovery",
    suggestedDuration: 20,
    maxDuration: 45,
    defaultInstructions: [
      "Choose a quiet space for writing",
      "Set aside judgment and write freely",
      "Focus on honest self-expression",
      "Don't worry about grammar or structure",
      "Write continuously without stopping to edit",
      "Review what you've written with self-compassion"
    ],
    suggestedResources: [
      {
        type: "article",
        url: "https://example.com/therapeutic-journaling",
        title: "Therapeutic Journaling Techniques"
      }
    ],
    journalPrompts: [
      "What are you feeling right now and why?",
      "Describe a recent challenge and what you learned from it",
      "Write a letter to your future self",
      "What are your core values and how do they guide you?",
      "Describe a moment when you felt truly happy",
      "What patterns do you notice in your thoughts or behaviors?",
      "Write about someone who inspires you and why"
    ]
  },

  challenge: {
    name: "Wellness Challenge",
    description: "Short-term challenges to build healthy habits and positive behaviors",
    suggestedDuration: 45,
    maxDuration: 120,
    defaultInstructions: [
      "Read the challenge description carefully",
      "Set a specific, achievable goal",
      "Break the challenge into smaller steps",
      "Track your progress daily",
      "Celebrate small victories along the way",
      "Reflect on what you learned at the end"
    ],
    suggestedResources: [
      {
        type: "article",
        url: "https://example.com/wellness-challenges",
        title: "Creating Sustainable Wellness Habits"
      }
    ],
    challengeTypes: [
      "7-Day Gratitude Practice",
      "5-Day Digital Detox",
      "Week of Random Acts of Kindness",
      "7-Day Sleep Hygiene Challenge",
      "5-Day Mindful Eating Practice",
      "Week of Daily Movement",
      "7-Day Positive Affirmations"
    ]
  }
};

// Validation function for activity creation
export const validateActivityData = (activityData) => {
  const { activityType, duration, startDate, endDate } = activityData;
  
  const template = activityTemplates[activityType];
  if (!template) {
    throw new Error(`Invalid activity type: ${activityType}`);
  }

  // Validate duration
  if (duration && duration > template.maxDuration) {
    throw new Error(`Duration cannot exceed ${template.maxDuration} minutes for ${template.name}`);
  }

  // Validate date range - activities shouldn't last more than a week
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInDays = (end - start) / (1000 * 60 * 60 * 24);
    
    if (diffInDays > 7) {
      throw new Error('Activities cannot last more than 7 days. Use wellness programs for longer durations.');
    }
  }

  return true;
};

// Function to get template data for frontend
export const getActivityTemplate = (activityType) => {
  return activityTemplates[activityType] || null;
};

export { activityTemplates };