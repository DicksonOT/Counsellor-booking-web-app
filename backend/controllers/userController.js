import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import counsellorModel from '../models/counsellorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import moodModel from '../models/moodModel.js'
import notificationModel from '../models/notificationModel.js';
import Stripe from 'stripe'
import transporter from '../config/email.js'
import sessionModel from '../models/sessionModel.js'
import { sessions } from '../config/websocket.js';
import { initWebSocket } from '../config/websocket.js'
import programModel from '../models/programModel.js'
import enrollmentModel from '../models/enrollmentModel.js'
import WellnessActivity from '../models/activityModel.js'
import { Community, Post, Comment } from '../models/communityModel.js';
import UserProgress from '../models/userProgressModel.js'
import mongoose from 'mongoose';
import donationModel from '../models/donationModel.js'

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body


    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing details' })
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Invalid email' })
    }

    if (password.length < 8) {
      return res.json({ success: false, message: 'Enter a strong password' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name,
      email,
      password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })

  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

// API for user login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      return res.json({ success: false, message: 'Invalid credentials' })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API for user profile
const userInfo = async (req, res) => {
  try {
    const userId = req.userId
    const userData = await userModel.findById(userId).select('-password')
    res.json({ success: true, userData })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

// API for updating user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, dob, gender } = req.body
    const userId = req.userId
    const imageFile = req.file

    if (!name || !phone || !dob || !gender || !location) {
      return res.json({ success: false, message: 'Missing details' })
    }

    await userModel.findByIdAndUpdate(userId, { name, phone, location, dob, gender })

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      const imageUrl = imageUpload.secure_url

      await userModel.findByIdAndUpdate(userId, { image: imageUrl })
    }

    res.json({ success: true, message: 'Profile updated' })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }

}

// API for getting list of counsellors
const counsellorList = async (req, res) => {
    try {

        const counsellors = await counsellorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, counsellors })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, messsage: error.message })
    }
}

// API for booking appointment 
const bookAppointment = async (req, res) => {
  try {

    const userId = req.userId
    const { slotTime, slotDate, counId } = req.body

    const counData = await counsellorModel.findById(counId).select('-password')

    if (!counData.available) {
      return res.json({ success: false, message: 'Counsellor not available' })
    }

    let slots_booked = counData.slots_booked

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot not available' })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')
    delete counData.slots_booked

    const appointmentData = {
      userId,
      counId,
      slotTime,
      slotDate,
      userData,
      counData,
      amount: counData.fees,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    await counsellorModel.findByIdAndUpdate(counId, { slots_booked })
    res.json({ success: true, message: 'Appointment Booked' })

    // Email content for user
    const userMailOptions = {
      from: `"Quiet Place" <${process.env.MAIL_USER}>`,
      to: userData.email,
      subject: 'Appointment Confirmation – Quiet Place',
      html: `
    <h2>Appointment Confirmed</h2>
    <p>Hi ${userData.name},</p>
    <p>Your appointment with <strong>${counData.name}</strong> has been successfully booked.</p>
    <p><strong>Date:</strong> ${slotDate}<br/>
    <strong>Time:</strong> ${slotTime}<br/>
    <strong>Location:</strong> ${counData.location}</p>
    <p>Thank you for choosing Quiet Place.</p>
  `,
    };

    // Email content for counsellor
    const counsellorMailOptions = {
      from: `"Quiet Place" <${process.env.MAIL_USER}>`,
      to: counData.email,
      subject: 'New Appointment Booked – Quiet Place',
      html: `
    <h2>New Appointment Alert</h2>
    <p>Hi ${counData.name},</p>
    <p><strong>${userData.name}</strong> has booked an appointment with you.</p>
    <p><strong>Date:</strong> ${slotDate}<br/>
    <strong>Time:</strong> ${slotTime}<br/>
    <strong>User Email:</strong> ${userData.email}<br/>
    <strong>User Phone:</strong> ${userData.phone}</p>
  `,
    };

    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(counsellorMailOptions)
    ]);


  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}


// API to get user appointments
const listAppointments = async (req, res) => {
  try {
    const userId = req.userId
    const appointments = await appointmentModel.find({ userId })

    if (!appointments) {
      return res.json({ success: false, message: 'You do not have any appointment' })
    }

    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

// API for cancelling appointment 
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId
    const { appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    // verify user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'You are not authorised' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    // releasing counsellor slot
    const { counId, slotTime, slotDate } = appointmentData

    const counData = await counsellorModel.findById(counId)

    let slots_booked = counData.slots_booked
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await counsellorModel.findByIdAndUpdate(counId, { slots_booked })
    res.json({ success: true, message: 'Appointment Cancelled' })

  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// API for making payment
const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'Unauthorised action' })
    }
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment does not exist or is cancelled' });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: process.env.CURRENCY,
            product_data: {
              name: 'Counselling Appointment',
            },
            unit_amount: appointmentData.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/my-appointment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: { appointmentId: appointmentId.toString() }
    })

    res.json({ success: true, url: session.url })

  } catch (error) {
    console.error(error)
    return res.json({ success: false, message: error.message })
  }
}

// Stripe Webhook Handler
const StripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature']
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)

    console.log(event)
    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const appointmentId = session.metadata.appointmentId

      // Update appointment status in DB
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true, paymentId: session.payment_intent })
    }

    res.json({ success: true })
  } catch (error) {
    console.error(error)
    return res.json({ success: false, message: error.message })
  }
}

// API for verifying payment
const verifyPayment = async (req, res) => {
  const { sessionId } = req.body

  if (!sessionId) {
    return res.json({ success: false, message: "No session ID provided" })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      await appointmentModel.findByIdAndUpdate(session.metadata.appointmentId, { payment: true, paymentId: session.payment_intent })
      res.json({ success: true, message: 'Payment confirmed!' })
    } else {
      return res.json({ success: false, message: 'Payment failed' })
    }

  } catch (error) {
    console.error(error)
    return res.json({ success: false, message: error.message })
  }
}

// API for assessing user with questions (Assessment Test)
const submitAssessment = async (req, res) => {
  try {
    const userId = req.userId; 
    const { answers } = req.body;

    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);

    let progress = await UserProgress.findOne({ user: userId });

    if (!progress) {
      progress = new UserProgress({ user: userId });
    }

    const today = new Date().toDateString();
    const lastEntry = progress.scoreHistory[progress.scoreHistory.length - 1];

    if (lastEntry) {
      const lastEntryDate = new Date(lastEntry.date).toDateString();
      if (lastEntryDate === today && lastEntry.source === 'assessmentTest') {
        return res.json({
          success: false,
          message: "You've already taken the assessment today. Try again tomorrow."
        });
      }
    }

    // Store old total score for badge checking
    const oldTotalScore = progress.totalScore;
    
    progress.totalScore += totalScore;
    progress.wellnessPoints += totalScore;
    progress.scoreHistory.push({
      score: totalScore,
      source: 'assessmentTest',
      date: new Date(),
    });

    // Check for new badges
    const newBadges = checkForNewBadges(oldTotalScore, progress.totalScore, progress.badges);
    if (newBadges.length > 0) {
      progress.badges.push(...newBadges);
    }

    await progress.save();
    
    res.json({ 
      success: true, 
      message: "Assessment recorded successfully.",
      newBadges: newBadges.length > 0 ? newBadges : undefined
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to record assessment." });
  }
};

// Check if assessment was taken today
const checkAssessmentToday = async (req, res) => {
  try {
    const userId = req.userId;
    const progress = await UserProgress.findOne({ user: userId });

    if (!progress || progress.scoreHistory.length === 0) {
      return res.json({ takenToday: false });
    }

    const lastEntry = progress.scoreHistory[progress.scoreHistory.length - 1];
    const today = new Date().toDateString();
    const lastEntryDate = new Date(lastEntry.date).toDateString();

    if (lastEntry && lastEntry.source === 'assessmentTest' && lastEntryDate === today) {
      return res.json({ takenToday: true });
    }

    res.json({ takenToday: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ takenToday: false });
  }
};

// API to getAssessment to match the route
const getAssessment = async (req, res) => {
  const userId = req.userId;
  const { source, startDate, endDate, limit = 50 } = req.query;

  try {
    let progress = await UserProgress.findOne({ user: userId })
      .populate('completedActivities.activity', 'title category')
      .populate('joinedCommunities.community', 'name');

    if (!progress) {
      return res.json({ 
        success: false, 
        message: 'No progress found for this user',
        progress: null
      });
    }

    // Filter score history if filters are provided
    let filteredScoreHistory = progress.scoreHistory;

    if (source) {
      filteredScoreHistory = filteredScoreHistory.filter(entry => 
        entry.source.toLowerCase() === source.toLowerCase()
      );
    }

    if (startDate || endDate) {
      filteredScoreHistory = filteredScoreHistory.filter(entry => {
        const entryDate = new Date(entry.date);
        if (startDate && entryDate < new Date(startDate)) return false;
        if (endDate && entryDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Apply limit
    if (limit) {
      filteredScoreHistory = filteredScoreHistory.slice(-parseInt(limit));
    }

    // Calculate source statistics
    const sourceStats = {};
    progress.scoreHistory.forEach(entry => {
      const source = entry.source;
      if (!sourceStats[source]) {
        sourceStats[source] = { count: 0, totalPoints: 0 };
      }
      sourceStats[source].count += 1;
      sourceStats[source].totalPoints += entry.score;
    });

    // Calculate trends (last 30 days vs previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

    const recentEntries = progress.scoreHistory.filter(entry => 
      new Date(entry.date) >= thirtyDaysAgo
    );
    const previousEntries = progress.scoreHistory.filter(entry => 
      new Date(entry.date) >= sixtyDaysAgo && new Date(entry.date) < thirtyDaysAgo
    );

    const recentTotal = recentEntries.reduce((sum, entry) => sum + entry.score, 0);
    const previousTotal = previousEntries.reduce((sum, entry) => sum + entry.score, 0);
    const trend = previousTotal > 0 ? ((recentTotal - previousTotal) / previousTotal * 100).toFixed(1) : 0;

    const responseData = {
      ...progress.toObject(),
      scoreHistory: filteredScoreHistory,
      statistics: {
        sourceStats,
        trend: parseFloat(trend),
        recentTotal,
        previousTotal,
        totalActivities: progress.scoreHistory.length,
        averageScore: progress.scoreHistory.length > 0 
          ? (progress.scoreHistory.reduce((sum, entry) => sum + entry.score, 0) / progress.scoreHistory.length).toFixed(1)
          : 0
      }
    };

    res.json({ success: true, progress: responseData });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: 'Error retrieving user progress' });
  }
};

// Get assessment statistics and insights
const getAssessmentInsights = async (req, res) => {
  const userId = req.userId;

  try {
    const progress = await UserProgress.findOne({ user: userId });
    if (!progress) {
      return res.json({ 
        success: false, 
        message: 'No progress data found',
        insights: null
      });
    }

    const now = new Date();
    const scoreHistory = progress.scoreHistory || [];

    // Weekly comparison
    const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const twoWeeksAgo = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));

    const thisWeek = scoreHistory.filter(entry => new Date(entry.date) >= oneWeekAgo);
    const lastWeek = scoreHistory.filter(entry => 
      new Date(entry.date) >= twoWeeksAgo && new Date(entry.date) < oneWeekAgo
    );

    // Monthly trends
    const monthlyData = {};
    scoreHistory.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { points: 0, activities: 0 };
      }
      monthlyData[monthKey].points += entry.score;
      monthlyData[monthKey].activities += 1;
    });

    // Most active source
    const sourceActivity = {};
    scoreHistory.forEach(entry => {
      sourceActivity[entry.source] = (sourceActivity[entry.source] || 0) + 1;
    });

    const mostActiveSource = Object.entries(sourceActivity)
      .sort(([,a], [,b]) => b - a)[0];

    // Consistency score (activities in last 7 days)
    const consistencyScore = Math.min(thisWeek.length * 14.3, 100); // Max 7 activities = 100%

    // Generate insights
    const insights = {
      weeklyComparison: {
        thisWeek: thisWeek.reduce((sum, entry) => sum + entry.score, 0),
        lastWeek: lastWeek.reduce((sum, entry) => sum + entry.score, 0),
        improvement: thisWeek.length - lastWeek.length
      },
      consistencyScore: Math.round(consistencyScore),
      mostActiveSource: mostActiveSource ? mostActiveSource[0] : null,
      monthlyTrends: Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6), // Last 6 months
      recommendations: generateRecommendations(progress, thisWeek, consistencyScore)
    };

    res.json({ success: true, insights });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error generating insights' });
  }
};

// Badge checking function - awards badges every 50 points
const checkForNewBadges = (oldScore, newScore, existingBadges) => {
  const newBadges = [];
  const oldLevel = Math.floor(oldScore / 50);
  const newLevel = Math.floor(newScore / 50);
  
  // Check if user has crossed 50-point thresholds
  for (let level = oldLevel + 1; level <= newLevel; level++) {
    const points = level * 50;
    const badgeName = `${points} Points Milestone`;
    
    // Check if badge already exists
    const badgeExists = existingBadges.some(badge => badge.name === badgeName);
    
    if (!badgeExists) {
      let badgeInfo = getBadgeInfo(points);
      newBadges.push({
        name: badgeName,
        description: badgeInfo.description,
        icon: badgeInfo.icon,
        pointsMilestone: points,
        earnedAt: new Date()
      });
    }
  }
  
  return newBadges;
};

// Get badge information based on points milestone
const getBadgeInfo = (points) => {
  const badges = {
    50: { icon: "🌱", description: "You've taken your first steps in mental wellness!" },
    100: { icon: "🌿", description: "Your wellness journey is growing stronger!" },
    150: { icon: "🍃", description: "Building momentum in your wellness journey!" },
    200: { icon: "🌳", description: "You're building healthy mental habits!" },
    250: { icon: "🌺", description: "Blooming beautifully in your wellness path!" },
    300: { icon: "🏆", description: "Consistent effort in your wellness journey!" },
    350: { icon: "⭐", description: "You're shining bright in your mental health journey!" },
    400: { icon: "🔥", description: "Your dedication to wellness is on fire!" },
    450: { icon: "💎", description: "You're a gem in mental health consistency!" },
    500: { icon: "🚀", description: "Your wellness journey has reached new heights!" },
    550: { icon: "👑", description: "You're ruling your mental health journey!" },
    600: { icon: "🎯", description: "Perfect aim at mental wellness goals!" },
    650: { icon: "🌟", description: "You're a wellness superstar!" },
    700: { icon: "💫", description: "Your commitment is truly stellar!" },
    750: { icon: "✨", description: "Sparkling with wellness achievements!" },
    800: { icon: "🎊", description: "Celebrating your wellness dedication!" },
    850: { icon: "🎉", description: "Party time for your amazing progress!" },
    900: { icon: "🦋", description: "You've transformed beautifully!" },
    950: { icon: "🌈", description: "Bringing color to your wellness journey!" },
    1000: { icon: "🎖️", description: "Military-grade commitment to wellness!" }
  };
  
  // For points above 1000, use a cycling pattern every 50 points
  if (points > 1000) {
    const cyclePosition = Math.floor((points - 1000) / 50) % 10;
    const icons = ["🌠", "💥", "⚡", "🔮", "🎭", "🎪", "🎨", "🎵", "🎬", "🎲"];
    const descriptions = [
      "Shooting star level wellness!",
      "Explosive progress in mental health!",
      "Electric energy in your wellness journey!",
      "Mystical mastery of mental wellness!",
      "Dramatic improvement in your journey!",
      "Circus-level balance in wellness!",
      "Artistic approach to mental health!",
      "Harmonious wellness achievements!",
      "Blockbuster mental health progress!",
      "Lucky streak in wellness activities!"
    ];
    return {
      icon: icons[cyclePosition],
      description: `${descriptions[cyclePosition]} ${points} points achieved!`
    };
  }
  
  return badges[points] || { icon: "🏅", description: `Incredible ${points} points milestone reached!` };
};

// API for chatbot visits
const chatbotVisit = async (req, res) => {
  const userId = req.userId;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight today

    let progress = await UserProgress.findOne({ user: userId });
    if (!progress) {
      progress = new UserProgress({ user: userId });
    }

    // Check if chatbot visit already recorded today
    if (progress.scoreHistory.some(
      entry =>
        entry.source === 'chatbot' &&
        new Date(entry.date).setHours(0, 0, 0, 0) === today.getTime()
    )) {
      return res.json({ success: true, message: 'Chatbot visit already recorded today.' });
    }

    // Store old total score for badge checking
    const oldTotalScore = progress.totalScore;

    // Record chatbot visit
    progress.wellnessPoints += 2;
    progress.totalScore += 2;
    progress.scoreHistory.push({
      score: 2,
      source: 'chatbot',
      date: new Date()
    });

    // Check for new badges
    const newBadges = checkForNewBadges(oldTotalScore, progress.totalScore, progress.badges);
    if (newBadges.length > 0) {
      progress.badges.push(...newBadges);
    }

    await progress.save();
    res.json({ 
      success: true, 
      message: 'Chatbot visit recorded successfully.',
      newBadges: newBadges.length > 0 ? newBadges : undefined
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'An error occurred while recording the visit.' });
  }
};

// API to record counselor assessment
const recordCounselorAssessment = async (req, res) => {
  const userId = req.userId;
  const { score, counselorId } = req.body;

  try {
    if (!score || score < 0) {
      return res.json({ success: false, message: 'Invalid score provided.' });
    }

    let progress = await UserProgress.findOne({ user: userId });
    if (!progress) {
      progress = new UserProgress({ user: userId });
    }

    // Store old total score for badge checking
    const oldTotalScore = progress.totalScore;

    // Record counselor assessment
    progress.wellnessPoints += score;
    progress.totalScore += score;
    progress.scoreHistory.push({
      score: score,
      source: 'counselor',
      counId: counselorId || null,
      date: new Date()
    });

    // Check for new badges
    const newBadges = checkForNewBadges(oldTotalScore, progress.totalScore, progress.badges);
    if (newBadges.length > 0) {
      progress.badges.push(...newBadges);
    }

    await progress.save();
    res.json({ 
      success: true, 
      message: 'Counselor assessment recorded successfully.',
      newTotal: progress.totalScore,
      newBadges: newBadges.length > 0 ? newBadges : undefined
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'An error occurred while recording the assessment.' });
  }
};

// API to record activity completion
const recordActivityCompletion = async (req, res) => {
  const userId = req.userId;
  const { activityId, activityTitle, activityType, pointsEarned = 10, duration } = req.body;

  try {
    let progress = await UserProgress.findOne({ user: userId });
    if (!progress) {
      progress = new UserProgress({ user: userId });
    }

    // Store old total score for badge checking
    const oldTotalScore = progress.totalScore;

    // Add to completed activities
    progress.completedActivities.push({
      activity: activityId,
      completedAt: new Date(),
      pointsEarned: pointsEarned,
      title: activityTitle,
      activityType: activityType,
      duration: duration
    });

    // Add to score history
    progress.scoreHistory.push({
      score: pointsEarned,
      source: 'activity',
      date: new Date()
    });

    // Update totals
    progress.wellnessPoints += pointsEarned;
    progress.totalScore += pointsEarned;

    // Update monthly and weekly stats
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Check if we need to reset monthly stats
    if (progress.monthlyStats.currentMonth !== currentMonth || 
        progress.monthlyStats.currentYear !== currentYear) {
      
      // Archive current month's data
      progress.monthlyHistory.push({
        month: progress.monthlyStats.currentMonth,
        year: progress.monthlyStats.currentYear,
        pointsEarned: progress.monthlyStats.pointsThisMonth,
        activitiesCompleted: progress.monthlyStats.activitiesThisMonth,
        postsCreated: progress.monthlyStats.postsThisMonth,
        supportGiven: progress.monthlyStats.supportGivenThisMonth
      });

      // Reset monthly stats
      progress.monthlyStats = {
        currentMonth: currentMonth,
        currentYear: currentYear,
        pointsThisMonth: pointsEarned,
        activitiesThisMonth: 1,
        postsThisMonth: 0,
        supportGivenThisMonth: 0
      };
    } else {
      // Update current month stats
      progress.monthlyStats.pointsThisMonth += pointsEarned;
      progress.monthlyStats.activitiesThisMonth += 1;
    }

    // Update weekly stats
    progress.weeklyStats.activitiesCompleted += 1;
    progress.weeklyStats.pointsEarned += pointsEarned;

    // Update activity completion streak
    const lastActivity = progress.streaks.activityCompletion.lastActivity;
    const today = new Date().toDateString();
    
    if (lastActivity) {
      const lastActivityDate = new Date(lastActivity).toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      if (lastActivityDate === yesterday || lastActivityDate === today) {
        if (lastActivityDate !== today) {
          progress.streaks.activityCompletion.current += 1;
        }
      } else {
        progress.streaks.activityCompletion.current = 1;
      }
    } else {
      progress.streaks.activityCompletion.current = 1;
    }

    // Update longest streak if current is longer
    if (progress.streaks.activityCompletion.current > progress.streaks.activityCompletion.longest) {
      progress.streaks.activityCompletion.longest = progress.streaks.activityCompletion.current;
    }

    progress.streaks.activityCompletion.lastActivity = new Date();

    // Check for new badges
    const newBadges = checkForNewBadges(oldTotalScore, progress.totalScore, progress.badges);
    if (newBadges.length > 0) {
      progress.badges.push(...newBadges);
    }

    await progress.save();
    res.json({ 
      success: true, 
      message: 'Activity completion recorded successfully.',
      pointsEarned: pointsEarned,
      newTotal: progress.totalScore,
      newBadges: newBadges.length > 0 ? newBadges : undefined
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'An error occurred while recording activity completion.' });
  }
};

// API to generate personalized recommendations
const generateRecommendations = (progress, thisWeekActivities, consistencyScore) => {
  const recommendations = [];

  // Consistency recommendations
  if (consistencyScore < 50) {
    recommendations.push({
      type: 'consistency',
      message: 'Try to engage in wellness activities more regularly. Even small daily actions can make a big difference!',
      priority: 'high'
    });
  }

  // Source diversity recommendations
  const sourcesThisWeek = [...new Set(thisWeekActivities.map(a => a.source))];
  if (sourcesThisWeek.length < 2) {
    recommendations.push({
      type: 'diversity',
      message: 'Consider diversifying your wellness activities. Try mixing chatbot sessions with assessments or counselor visits.',
      priority: 'medium'
    });
  }

  // Engagement recommendations
  if (thisWeekActivities.length === 0) {
    recommendations.push({
      type: 'engagement',
      message: 'It looks like you haven\'t been active recently. Start with a quick chatbot session or take an assessment!',
      priority: 'high'
    });
  } else if (thisWeekActivities.length >= 5) {
    recommendations.push({
      type: 'congratulations',
      message: 'Great job staying active this week! Keep up the excellent work on your wellness journey.',
      priority: 'positive'
    });
  }

  // Streak recommendations
  if (progress.streaks?.activityCompletion?.current >= 7) {
    recommendations.push({
      type: 'streak',
      message: `Amazing! You're on a ${progress.streaks.activityCompletion.current}-day activity streak. Keep it going!`,
      priority: 'positive'
    });
  }

  return recommendations;
};

// API for mood entry
const addMood = async (req, res) => {
 try {
  const { mood, note } = req.body;
  const userId = req.userId;
  await moodModel.create({ user: userId, mood, note });
  res.json({ success: true, message:'Mood recorded' });

 } catch (error) {
  console.log(error.message);
  res.json({ success: false, message: 'Error recording mood' });
 }
};

// API to get mood history
const getMoodHistory = async (req, res) => {
try {
  const userId = req.userId;
  const history = await moodModel.find({ user: userId }).sort({ date: -1 });
  res.json({ success: true, history });
} catch (error) {
  console.log(error.message);
  res.json({ success: false, message: 'Error getting mood history' });
}
};

// API to handle crisis
const handleCrisisSupport = async (req, res) => {
  try {
    const userId = req.userId;
    const { message, moodScore } = req.body;

    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Get all approved counselors
    const activeCounselors = await counsellorModel.find({ status: "approved" });

    const recipients = [
      ...activeCounselors.map(c => c.email),
      process.env.MAIL_USER 
    ];

    // Email options
    const mailOptions = {
      from: `"QuietPlace Crisis Alert" <${process.env.MAIL_USER}>`,
      to: recipients,
      subject: "🚨 Crisis Support Request - Immediate Action Needed",
      html: `
        <h2>Crisis Alert from QuietPlace</h2>
        <p><strong>User:</strong> ${user.name} (${user.email}) ${user.phone ? `(${user.phone})` : ''}</p>
        <p><strong>Mood Score:</strong> ${moodScore}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
        <a href="${process.env.APP_URL}/counselor/chat/${userId}" style="background:#007bff;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">Respond Now</a>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Respond with success + helplines
    res.json({
      success: true,
      message: "Crisis request sent. Helplines provided.",
      helplines: [
        { name: "Samaritans", phone: "+44 8457 90 90 90" },
        { name: "National Suicide Prevention Lifeline", phone: "+1 800-273-8255" },
        { name: "Lifeline Ghana", phone: "+233 244 852 570" },
      ],
    });

  } catch (error) {
    console.error("Error handling crisis support:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// API for user to join live session
const joinLiveSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.userId;

    const session = await sessionModel.findById(sessionId)
      .populate('counId', 'name')
      .populate('userId', 'name');

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Authorization check
    if (
      session.userId._id.toString() !== userId &&
      session.counId._id.toString() !== userId
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to join this session" });
    }

    let updated = false;

    // Ensure roomId exists (important for WebRTC)
    if (!session.roomId) {
      session.roomId = `session-${session._id}`;
      updated = true;
    }

    // Add participant if new
    if (!session.participants.includes(userId)) {
      session.participants.push(userId);
      updated = true;
    }

    // If scheduled, activate
    if (session.status === 'scheduled') {
      session.status = 'active';
      session.startTime = new Date();
      updated = true;
    }

    if (updated) {
      await session.save();
    }

    // Notify the other participant
    const otherParticipantId =
      session.userId._id.toString() === userId
        ? session.counId._id
        : session.userId._id;

    await notifyUserInSession(
      otherParticipantId,
      `${session.userId.name || 'A participant'} joined the session.`,
      session
    );

    res.json({
      success: true,
      message: "Joined session successfully",
      session: {
        _id: session._id,
        roomId: session.roomId,
        sessionType: session.sessionType,
        status: session.status,
        participants: session.participants
      }
    });

  } catch (error) {
    console.error("Error in joinLiveSession:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get user's sessions 
const getUserSessions = async (req, res) => {
  try {
    const userId = req.userId;

    const sessions = await sessionModel.find({ userId })
      .populate('counId', 'name email speciality image')
      .populate('appointmentId')
      .sort({ createdAt: -1 });

    res.json({ success: true, sessions });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const notifyUser = ( message) => {
  const userId = req.userId
  const userSessions = sessions[userId] || [];
  userSessions.forEach(ws => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}

// API to mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId; // From auth middleware

    // Find and update notification, ensuring user owns it
    const notification = await notificationModel.findOneAndUpdate(
      { 
        _id: notificationId, 
        userId: userId 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      },
      { new: true }
    );

    if (!notification) {
      return res.json({
        success: false,
        message: 'Notification not found or not authorized'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      notification
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

//API to mark all notifications as read 
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const result = await notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// API to delete notification 
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId;

    const notification = await notificationModel.findOneAndDelete({
      _id: notificationId,
      userId: userId
    });

    if (!notification) {
      return res.json({
        success: false,
        message: 'Notification not found or not authorized'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// API to get unread notification count 
const getUnreadNotificationCount = async (req, res) => {
  try {
    const userId = req.userId;

    const unreadCount = await notificationModel.countDocuments({
      userId,
      isRead: false
    });

    res.json({
      success: true,
      unreadCount
    });

  } catch (error) {
    console.error('Error getting unread count:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// Enhanced getUserNotifications 
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const query = { userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await notificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalNotifications = await notificationModel.countDocuments(query);
    const unreadCount = await notificationModel.countDocuments({ 
      userId, 
      isRead: false 
    });

    res.json({
      success: true,
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalNotifications / limit),
        totalNotifications,
        unreadCount,
        hasMore: page * limit < totalNotifications
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
};

// API to get notification in session
const notifyUserInSession = async (userId, message, sessionData) => {
  try {
    if (sessions[userId]) {
      const notificationPayload = {
        type: 'session_update',
        message,
        sessionData: {
          sessionId: sessionData._id,
          sessionUrl: sessionData.sessionUrl,
          scheduledTime: sessionData.scheduledTime,
          status: sessionData.status
        }
      };

      sessions[userId].forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(notificationPayload));
        }
      });
      console.log(`📱 Session update sent to user ${userId}`);
    }
  } catch (error) {
    console.error('❌ Error notifying user in session:', error);
  }
};

// API to fetch all programs
const getPrograms = async (req, res) => {
  try {
    const programs = await programModel.find();
    res.json({ success: true, programs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//API to enroll user into a program
const enrollProgram = async (req, res) => {
  try {
    const { programId } = req.body;
    const userId = req.userId

    const program = await programModel.findById(programId);
    if (!program) return res.json({ success: false, message: "Program not found" });

    // Check if already enrolled
    const alreadyEnrolled = await enrollmentModel.findOne({ user: userId, program: programId });
    if (alreadyEnrolled) return res.json({ success: true, message: "Already enrolled", enrollment: alreadyEnrolled });

    // Create enrollment
    const enrollment = new enrollmentModel({ user: userId, program: programId });
    await enrollment.save();

    // Increase participant count
    program.participants += 1;
    await program.save();

    // Fetch user + counsellors + admin email
    const user = await userModel.findById(userId);
    const counsellors = await counsellorModel.find(); 
    const adminEmail = process.env.MAIL_USER;

    // Email content
    const mailOptions = [
      {
        from: process.env.MAIL_USER,
        to: user.email,
        subject: `Enrolled in ${program.title}`,
        html: `<p>Hi ${user.name},</p><p>You have successfully enrolled in <b>${program.title}</b>.</p>`
      },
      {
        from: process.env.MAIL_USER,
        to: adminEmail,
        subject: `New Enrollment Logged`,
        html: `<p>User <b>${user.name}</b> has enrolled in <b>${program.title}</b>.</p>`
      }
    ];

    // Send all mails
    await Promise.all(mailOptions.map(mail => transporter.sendMail(mail)));

    res.json({ success: true, message: "Enrollment successful, notifications sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// API to get communities with membership status
const getCommunities = async (req, res) => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const { category, theme, search } = req.query;

    // Build filter object for active communities only
    let filter = { status: 'active' };
    
    // Apply filters based on query parameters
    if (category && ['peer_support', 'counselor_led', 'wellness_activities', 'resource_sharing'].includes(category)) {
      filter.category = category;
    }
    
    if (theme && ['anxiety', 'depression', 'stress', 'trauma', 'mindfulness', 'general'].includes(theme)) {
      filter.theme = theme;
    }
    
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } }
      ];
    }

    console.log('Filter applied:', filter);

    // Use aggregation pipeline to get communities with post counts
    const communities = await Community.aggregate([
      // Match communities based on filter
      { $match: filter },
      
      // Lookup posts for each community
      {
        $lookup: {
          from: 'posts', // Make sure this matches your Post collection name in MongoDB
          localField: '_id',
          foreignField: 'community',
          as: 'posts'
        }
      },
      
      // Lookup moderators
      {
        $lookup: {
          from: 'users',
          localField: 'moderators',
          foreignField: '_id',
          as: 'moderatorDetails'
        }
      },
      
      // Lookup counselor moderators
      {
        $lookup: {
          from: 'counsellors', // Adjust collection name as needed
          localField: 'counselorModerators',
          foreignField: '_id',
          as: 'counselorModeratorDetails'
        }
      },
      
      // Add computed fields
      {
        $addFields: {
          postCount: { $size: '$posts' },
          isMember: { $in: [new mongoose.Types.ObjectId(userId), '$members'] },
          memberCount: { $size: '$members' },
          moderatorCount: { 
            $add: [
              { $size: '$moderatorDetails' }, 
              { $size: '$counselorModeratorDetails' }
            ] 
          },
          canViewDetails: {
            $or: [
              { $in: [new mongoose.Types.ObjectId(userId), '$members'] },
              { $eq: ['$isPrivate', false] }
            ]
          }
        }
      },
      
      // Project only the fields we need (only inclusion, no exclusion mixed in)
      {
        $project: {
          name: 1,
          description: 1,
          category: 1,
          theme: 1,
          isPrivate: 1,
          maxMembers: 1,
          tags: 1,
          image: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          // Computed fields
          isMember: 1,
          memberCount: 1,
          postCount: 1,
          moderatorCount: 1,
          canViewDetails: 1,
          lastActivity: '$updatedAt'
          // Note: We don't exclude fields here, we just include what we want
        }
      },
      
      // Sort by member count and creation date
      { $sort: { memberCount: -1, createdAt: -1 } }
    ]);

    console.log(`Found ${communities.length} communities with post counts`);

    // Log post counts for debugging
    communities.forEach(community => {
      console.log(`Community ${community.name}: ${community.postCount} posts, ${community.memberCount} members`);
    });

    res.json({ 
      success: true, 
      communities: communities,
      totalCount: communities.length
    });

  } catch (error) {
    console.error("GET COMMUNITIES ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch communities. Please try again.' 
    });
  }
};


// API to join community
const joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Validate ObjectId format
    if (!communityId || !communityId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid community ID format' });
    }

    // Find community with current member data
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' });
    }

    // Check if community is active
    if (community.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Community is not currently active' });
    }

    // Initialize members array if it doesn't exist
    if (!community.members) {
      community.members = [];
    }

    // Filter out any invalid member references
    community.members = community.members.filter(member => member && member.toString());

    console.log(`Community "${community.name}" current members:`, community.members.length);

    // Check if user is already a member
    const isAlreadyMember = community.members.some(memberId => 
      memberId.toString() === userId.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are already a member of this community' 
      });
    }

    // Check if community has reached max capacity
    if (community.maxMembers && community.members.length >= community.maxMembers) {
      return res.status(400).json({ 
        success: false, 
        message: `Community is full. Maximum ${community.maxMembers} members allowed.` 
      });
    }

    // Add user to community members
    community.members.push(userId);
    community.memberCount = community.members.length;
    
    // Save the community
    await community.save();

    // Update user progress (wrapped in try-catch to prevent main operation failure)
    try {
      await UserProgress.findOneAndUpdate(
        { user: userId },
        { 
          $addToSet: { joinedCommunities: communityId },
          $inc: { wellnessPoints: 5 }
        },
        { upsert: true }
      );
    } catch (progressError) {
      console.warn("User progress update failed (non-critical):", progressError);
    }

    console.log(`✅ User ${userId} successfully joined community "${community.name}"`);
    console.log(`New member count: ${community.memberCount}`);

    res.json({ 
      success: true, 
      message: `Successfully joined "${community.name}"`,
      data: {
        communityId: community._id,
        communityName: community.name,
        memberCount: community.memberCount,
        isMember: true
      }
    });

  } catch (error) {
    console.error("JOIN COMMUNITY ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to join community. Please try again later.' 
    });
  }
};

// API to leave community
const leaveCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Validate ObjectId format
    if (!communityId || !communityId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid community ID format' });
    }

    // Find the community
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' });
    }

    // Initialize members array if it doesn't exist
    if (!community.members) {
      community.members = [];
    }

    const initialMemberCount = community.members.length;
    console.log(`Community "${community.name}" initial members:`, initialMemberCount);

    // Check if user is actually a member
    const isMember = community.members.some(memberId => 
      memberId && memberId.toString() === userId.toString()
    );

    if (!isMember) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are not a member of this community' 
      });
    }

    // Remove user from members array
    community.members = community.members.filter(memberId => 
      memberId && memberId.toString() !== userId.toString()
    );
    
    // Update member count
    community.memberCount = community.members.length;
    
    // Save the community
    await community.save();

    // Update user progress (wrapped in try-catch)
    try {
      await UserProgress.findOneAndUpdate(
        { user: userId },
        { $pull: { joinedCommunities: communityId } }
      );
    } catch (progressError) {
      console.warn("User progress update failed (non-critical):", progressError);
    }

    const membersRemoved = initialMemberCount - community.memberCount;
    console.log(`✅ User ${userId} left community "${community.name}"`);
    console.log(`Members removed: ${membersRemoved}, New count: ${community.memberCount}`);

    res.json({ 
      success: true, 
      message: `Successfully left "${community.name}"`,
      data: {
        communityId: community._id,
        communityName: community.name,
        memberCount: community.memberCount,
        isMember: false
      }
    });

  } catch (error) {
    console.error("LEAVE COMMUNITY ERROR:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to leave community. Please try again later.' 
    });
  }
};

// API to get posts for a specific community
const getPosts = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { page = 1, limit = 10, sortBy = 'recent' } = req.query;
    const userId = req.userId; // Based on your authUser middleware

    console.log('Getting posts for community:', communityId, 'User:', userId);

    // Check if community exists and user is a member
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ success: false, message: 'Community not found' });
    }

    // Check if user is a member of the community
    if (!community.members.includes(userId)) {
      return res.status(403).json({ success: false, message: 'Must be a community member to view posts' });
    }

    // Set up sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'popular':
        sortOptions = { likeCount: -1, commentCount: -1, createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      default: // 'recent'
        sortOptions = { createdAt: -1 };
    }

    const posts = await Post.find({ 
      community: communityId,
      status: 'active' 
    })
      .populate('author', 'name image')
      .populate('community', 'name')
      .populate({
        path: 'likes',
        select: 'name',
        options: { limit: 5 }
      })
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalPosts = await Post.countDocuments({
      community: communityId,
      status: 'active'
    });

    console.log(`Found ${posts.length} posts out of ${totalPosts} total`);

    // Add user-specific data to each post
    const postsWithUserData = posts.map(post => {
      const postObj = post.toObject();
      return {
        ...postObj,
        isLikedByUser: post.likes.some(like => like._id.toString() === userId.toString()),
        isOwner: post.author._id.toString() === userId.toString()
      };
    });

    res.json({
      success: true,
      posts: postsWithUserData,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalPosts / parseInt(limit)),
        totalPosts,
        hasMore: parseInt(page) < Math.ceil(totalPosts / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
};

// API to create a community post
const createPost = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { title, content, tags, isAnonymous = false, postType = 'discussion', moodTag, supportLevel = 'low' } = req.body;
    const userId = req.userId;

    console.log('Creating post - Community ID:', communityId, 'User ID:', userId);
    console.log('Request body:', req.body);

    // Validate user ID
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User authentication required' });
    }

    // Validate community ID format
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ success: false, message: 'Invalid community ID format' });
    }

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Post title is required' });
    }
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Post content is required' });
    }
    if (title.length > 200) {
      return res.status(400).json({ success: false, message: 'Title too long (max 200 characters)' });
    }
    if (content.length > 5000) {
      return res.status(400).json({ success: false, message: 'Content too long (max 5000 characters)' });
    }

    // Check if community exists and user is a member
    const community = await Community.findById(communityId);
    if (!community) {
      console.log('Community not found:', communityId);
      return res.status(404).json({ success: false, message: 'Community not found' });
    }

    console.log('Community found:', community.name);
    console.log('Community members:', community.members);
    console.log('User is member:', community.members.includes(userId));

    if (!community.members.includes(userId)) {
      return res.status(403).json({ success: false, message: 'Must be a community member to create posts' });
    }

    // Process tags properly
    let processedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        processedTags = tags.filter(tag => tag && tag.trim().length > 0).map(tag => tag.trim());
      } else if (typeof tags === 'string') {
        processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      }
    }

    // Create the post
    const post = new Post({
      title: title.trim(),
      content: content.trim(),
      author: userId,
      community: communityId,
      postType,
      tags: processedTags,
      isAnonymous,
      moodTag: moodTag || null,
      supportLevel,
      likeCount: 0,
      commentCount: 0,
      likes: [],
      status: 'active'
    });

    console.log('Saving post:', post);
    await post.save();
    console.log('Post saved successfully with ID:', post._id);

    // Try to update user progress (don't fail if this fails)
    try {
      await UserProgress.findOneAndUpdate(
        { user: userId },
        { 
          $inc: { 
            wellnessPoints: 5,
            'streaks.communityEngagement.current': 1
          },
          $set: { 'streaks.communityEngagement.lastActivity': new Date() }
        },
        { upsert: true }
      );
      console.log('User progress updated');
    } catch (progressError) {
      console.log('Failed to update user progress (non-critical):', progressError.message);
    }

    // Populate the post before returning
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name image')
      .populate('community', 'name')
      .lean(); // Use lean() for better performance

    console.log('Post created successfully:', populatedPost);

    res.status(201).json({
      success: true,
      post: populatedPost,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Create post error - Full error:', error);
    console.error('Error stack:', error.stack);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid ID format'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// API to like/unlike posts (updated to work with your existing structure)
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    console.log('Liking/unliking post:', postId, 'by user:', userId);

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      // Like the post
      post.likes.push(userId);
      post.likeCount = post.likeCount + 1;
      
      // Award points for supporting others (only when liking)
      await UserProgress.findOneAndUpdate(
        { user: userId },
        { 
          $inc: { 
            wellnessPoints: 1, 
            supportGiven: 1,
            'streaks.communityEngagement.current': 1 
          },
          $set: { 'streaks.communityEngagement.lastActivity': new Date() }
        },
        { upsert: true }
      );
    }

    await post.save();
    
    console.log('Post like status updated:', isLiked ? 'unliked' : 'liked');
    
    res.json({ 
      success: true, 
      liked: !isLiked, 
      likeCount: post.likeCount,
      message: isLiked ? 'Post unliked' : 'Post liked'
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ success: false, message: 'Failed to update post like status' });
  }
};

// API to get comments for a post (updated)
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    console.log('Getting comments for post:', postId);

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comments = await Comment.find({ 
      post: postId, 
      status: 'active',
      parentComment: null 
    })
      .populate('author', 'name image')
      .populate({
        path: 'replies',
        match: { status: 'active' },
        populate: { 
          path: 'author', 
          select: 'name image' 
        },
        options: { sort: { createdAt: 1 } }
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalComments = await Comment.countDocuments({
      post: postId,
      status: 'active',
      parentComment: null
    });

    console.log(`Found ${comments.length} comments out of ${totalComments} total`);

    res.json({ 
      success: true, 
      comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComments / parseInt(limit)),
        totalComments,
        hasMore: parseInt(page) < Math.ceil(totalComments / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch comments' });
  }
};

// API to create comments (updated)
const createComment = async (req, res) => {
  try {
    const { content, isAnonymous = false, parentCommentId } = req.body;
    const { postId } = req.params;
    const userId = req.userId;

    console.log('Creating comment on post:', postId, 'by user:', userId);

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ success: false, message: 'Comment too long (max 1000 characters)' });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // If replying to a comment, check if parent exists
    let parentComment = null;
    if (parentCommentId) {
      parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ success: false, message: 'Parent comment not found' });
      }
      if (parentComment.parentComment) {
        return res.status(400).json({ success: false, message: 'Cannot reply to a reply' });
      }
    }

    const comment = new Comment({
      content: content.trim(),
      author: userId,
      post: postId,
      parentComment: parentCommentId || null,
      isAnonymous
    });

    await comment.save();

    // Update post comment count
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    // If it's a reply, update parent comment
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
        $inc: { replyCount: 1 }
      });
    }

    // Update user progress
    const pointsForComment = parentCommentId ? 2 : 3;
    await UserProgress.findOneAndUpdate(
      { user: userId },
      { 
        $inc: { 
          wellnessPoints: pointsForComment,
          supportGiven: 1,
          'streaks.communityEngagement.current': 1
        },
        $set: { 'streaks.communityEngagement.lastActivity': new Date() }
      },
      { upsert: true }
    );

    // Populate the comment before returning
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name image');

    console.log('Comment created successfully:', comment._id);

    res.status(201).json({ 
      success: true, 
      comment: populatedComment,
      message: parentCommentId ? 'Reply added successfully' : 'Comment added successfully'
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ success: false, message: 'Failed to create comment' });
  }
};

// API to get wellness activities (updated for your schema)
const getWellnessActivities = async (req, res) => {
  try {
    const { 
      activityType, 
      difficulty, 
      status,
      page = 1, 
      limit = 10,
      search
    } = req.query;
    const userId = req.userId;
    
    console.log('Getting wellness activities for user:', userId);
    
    let filter = { isActive: true };
    
    // Apply filters based on your schema
    if (activityType && activityType !== '' && activityType !== 'all') {
      filter.activityType = activityType;
    }
    if (difficulty && difficulty !== '' && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get all activities first
    let activities = await WellnessActivity.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    // Add user-specific data and apply status filter
    const activitiesWithUserData = activities.map(activity => {
      const isParticipant = activity.participants && activity.participants.some(
        p => p.toString() === userId.toString()
      );
      const isCompleted = activity.completions && activity.completions.some(
        c => c.user.toString() === userId.toString()
      );

      return {
        ...activity,
        isParticipant,
        isCompleted,
        participantCount: activity.participants ? activity.participants.length : 0
      };
    });

    // Apply status filter after processing user data
    let filteredActivities = activitiesWithUserData;
    if (status && status !== 'all') {
      switch (status) {
        case 'available':
          filteredActivities = activitiesWithUserData.filter(a => !a.isParticipant);
          break;
        case 'joined':
          filteredActivities = activitiesWithUserData.filter(a => a.isParticipant && !a.isCompleted);
          break;
        case 'completed':
          filteredActivities = activitiesWithUserData.filter(a => a.isCompleted);
          break;
      }
    }

    const totalActivities = await WellnessActivity.countDocuments(filter);

    console.log(`Found ${filteredActivities.length} activities out of ${totalActivities} total`);

    res.json({ 
      success: true, 
      activities: filteredActivities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalActivities / parseInt(limit)),
        totalActivities,
        hasMore: parseInt(page) < Math.ceil(totalActivities / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get wellness activities error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch wellness activities',
      error: error.message 
    });
  }
};

// API to join activity
const joinActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const userId = req.userId;

    console.log('User', userId, 'joining activity:', activityId);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ success: false, message: 'Invalid activity ID' });
    }

    const activity = await WellnessActivity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    if (!activity.isActive) {
      return res.status(400).json({ success: false, message: 'Activity is no longer available' });
    }

    // Initialize participants array if it doesn't exist
    if (!activity.participants) {
      activity.participants = [];
    }

    if (activity.participants.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Already joined this activity' });
    }

    activity.participants.push(userId);
    activity.participantCount = activity.participants.length;
    await activity.save();

    // Update or create user progress
    await UserProgress.findOneAndUpdate(
      { user: userId },
      { 
        $inc: { wellnessPoints: 2 }
      },
      { upsert: true, new: true }
    );

    console.log('Activity joined successfully');

    res.json({ 
      success: true, 
      message: 'Successfully joined activity! You earned 2 points.',
      participantCount: activity.participantCount
    });
  } catch (error) {
    console.error('Join activity error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to join activity',
      error: error.message 
    });
  }
};

// API to complete activity
const completeActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { reflection = '', rating = 5 } = req.body;
    const userId = req.userId;

    console.log('User', userId, 'completing activity:', activityId);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      return res.status(400).json({ success: false, message: 'Invalid activity ID' });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const activity = await WellnessActivity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    // Initialize arrays if they don't exist
    if (!activity.participants) activity.participants = [];
    if (!activity.completions) activity.completions = [];

    if (!activity.participants.includes(userId)) {
      return res.status(400).json({ success: false, message: 'Must join activity before completing' });
    }

    // Check if already completed
    const existingCompletion = activity.completions.find(c => c.user.toString() === userId.toString());
    if (existingCompletion) {
      return res.status(400).json({ success: false, message: 'Activity already completed' });
    }

    // Add completion (following your schema structure)
    activity.completions.push({
      user: userId,
      reflection: reflection.trim(),
      rating: parseInt(rating),
      completedAt: new Date()
    });

    await activity.save();

    // Calculate points based on difficulty and activity type
    let pointsEarned;
    switch (activity.difficulty) {
      case 'beginner': pointsEarned = 10; break;
      case 'intermediate': pointsEarned = 15; break;
      case 'advanced': pointsEarned = 20; break;
      default: pointsEarned = 10;
    }

    // Bonus points for certain activity types
    if (['meditation', 'journaling', 'daily_reflection'].includes(activity.activityType)) {
      pointsEarned += 5;
    }

    // Update user progress
    await UserProgress.findOneAndUpdate(
      { user: userId },
      { 
        $addToSet: { completedActivities: activityId },
        $inc: { 
          wellnessPoints: pointsEarned
        }
      },
      { upsert: true, new: true }
    );

    console.log('Activity completed successfully, points earned:', pointsEarned);

    res.json({ 
      success: true, 
      message: 'Activity completed successfully!', 
      pointsEarned,
      completion: {
        reflection,
        rating: parseInt(rating),
        completedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Complete activity error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to complete activity',
      error: error.message 
    });
  }
};

// Get user progress with time range filtering
const getUserProgress = async (req, res) => {
    try {
        const userId = req.userId;
        const { timeRange = 'all' } = req.query;

        // Get or create user progress
        let userProgress = await UserProgress.findOne({ user: userId })
            .populate({
                path: 'completedActivities.activity',
                select: 'title activityType duration'
            });
        
        if (!userProgress) {
            userProgress = new UserProgress({ user: userId });
            await userProgress.save();
        }

        // Calculate current date ranges
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Time range calculations
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const startOfYear = new Date(currentYear, 0, 1);

        // Update monthly stats if needed (check if we're in a new month)
        await checkAndUpdateMonthlyStats(userProgress, currentMonth, currentYear);

        // Get all completed activities with populated data
        const allCompletedActivities = userProgress.completedActivities.map(activity => ({
            _id: activity._id,
            activity: activity.activity,
            completedAt: activity.completedAt,
            pointsEarned: activity.pointsEarned || 10,
            title: activity.activity?.title || activity.title || 'Unknown Activity',
            activityType: activity.activity?.activityType || activity.activityType || 'general',
            duration: activity.activity?.duration || activity.duration || 0
        }));

        // Filter activities by time range
        let filteredActivities = allCompletedActivities;
        switch (timeRange) {
            case 'today':
                filteredActivities = allCompletedActivities.filter(activity => 
                    new Date(activity.completedAt) >= startOfToday
                );
                break;
            case 'week':
                filteredActivities = allCompletedActivities.filter(activity => 
                    new Date(activity.completedAt) >= startOfWeek
                );
                break;
            case 'month':
                filteredActivities = allCompletedActivities.filter(activity => 
                    new Date(activity.completedAt) >= startOfMonth
                );
                break;
            case 'year':
                filteredActivities = allCompletedActivities.filter(activity => 
                    new Date(activity.completedAt) >= startOfYear
                );
                break;
            default:
                // 'all' - use all activities
                break;
        }

        // Calculate points for filtered activities
        const filteredPoints = filteredActivities.reduce((sum, activity) => 
            sum + (activity.pointsEarned || 10), 0);

        // Calculate today's stats
        const todayActivities = allCompletedActivities.filter(activity => 
            new Date(activity.completedAt) >= startOfToday
        );
        const todayPoints = todayActivities.reduce((sum, activity) => 
            sum + (activity.pointsEarned || 10), 0);

        // Calculate weekly stats
        const weekActivities = allCompletedActivities.filter(activity => 
            new Date(activity.completedAt) >= startOfWeek
        );
        const weekPoints = weekActivities.reduce((sum, activity) => 
            sum + (activity.pointsEarned || 10), 0);

        // Update weekly stats if needed
        await updateWeeklyStats(userProgress, weekActivities.length, weekPoints);

        // Prepare response data based on time range
        const responseData = {
            wellnessPoints: timeRange === 'all' ? userProgress.wellnessPoints : filteredPoints,
            completedActivities: filteredActivities.sort((a, b) => 
                new Date(b.completedAt) - new Date(a.completedAt)
            ),
            joinedCommunities: userProgress.joinedCommunities || [],
            supportGiven: userProgress.supportGiven || 0,
            streaks: userProgress.streaks || {
                communityEngagement: { current: 0, longest: 0 },
                activityCompletion: { current: 0, longest: 0 }
            },
            monthlyStats: userProgress.monthlyStats,
            weeklyStats: userProgress.weeklyStats,
            todayStats: {
                activitiesCompleted: todayActivities.length,
                pointsEarned: todayPoints,
                postsCreated: 0 // Will be updated by getUserPosts
            },
            achievements: userProgress.achievements || [],
            badges: userProgress.badges || []
        };

        res.json({
            success: true,
            progress: responseData
        });

    } catch (error) {
        console.error('Get user progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user progress',
            error: error.message
        });
    }
};

// Get user posts with time range filtering
const getUserPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const { timeRange = 'all' } = req.query;

        // Calculate time ranges
        const now = new Date();
        let startDate = null;

        switch (timeRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                // 'all' - no date filter
                break;
        }

        // Build query
        let query = { author: userId };
        if (startDate) {
            query.createdAt = { $gte: startDate };
        }

        // Get user posts
        const userPosts = await Post.find(query)
            .populate('community', 'name description')
            .populate('author', 'name image')
            .sort({ createdAt: -1 })
            .limit(50); // Reasonable limit

        res.json({
            success: true,
            posts: userPosts
        });

    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user posts',
            posts: []
        });
    }
};

// Get user communities with time range filtering
const getUserCommunities = async (req, res) => {
    try {
        const userId = req.userId;
        const { timeRange = 'all' } = req.query;

        // Get user progress to find joined communities
        const userProgress = await UserProgress.findOne({ user: userId });
        
        if (!userProgress || !userProgress.joinedCommunities.length) {
            return res.json({
                success: true,
                communities: []
            });
        }

        // Calculate time ranges
        const now = new Date();
        let startDate = null;

        switch (timeRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                // 'all' - no date filter
                break;
        }

        // Filter joined communities by time range
        let filteredJoinedCommunities = userProgress.joinedCommunities;
        if (startDate) {
            filteredJoinedCommunities = userProgress.joinedCommunities.filter(jc =>
                new Date(jc.joinedAt) >= startDate
            );
        }

        // Get community IDs
        const communityIds = filteredJoinedCommunities.map(jc => jc.community);

        // Get full community data
        const communities = await Community.find({
            _id: { $in: communityIds },
            status: 'active'
        }).select('name description category theme memberCount image');

        // Combine community data with user-specific data
        const communitiesWithUserData = communities.map(community => {
            const userCommunityData = filteredJoinedCommunities.find(jc =>
                jc.community.toString() === community._id.toString()
            );

            return {
                _id: community._id,
                name: community.name,
                description: community.description,
                category: community.category,
                theme: community.theme,
                memberCount: community.memberCount,
                image: community.image,
                joinedAt: userCommunityData?.joinedAt,
                userPostCount: userCommunityData?.userPostCount || 0,
                lastActivity: userCommunityData?.lastActivity
            };
        });

        res.json({
            success: true,
            communities: communitiesWithUserData
        });

    } catch (error) {
        console.error('Get user communities error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user communities',
            communities: []
        });
    }
};

// Get monthly history
const getMonthlyHistory = async (req, res) => {
    try {
        const userId = req.userId;

        const userProgress = await UserProgress.findOne({ user: userId });
        
        if (!userProgress) {
            return res.json({
                success: true,
                monthlyHistory: []
            });
        }

        // Add current month to history if it has activity
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        let monthlyHistory = [...userProgress.monthlyHistory];
        
        // Check if current month should be included
        if (userProgress.monthlyStats.pointsThisMonth > 0 || 
            userProgress.monthlyStats.activitiesThisMonth > 0 ||
            userProgress.monthlyStats.postsThisMonth > 0) {
            
            monthlyHistory.push({
                month: currentMonth,
                year: currentYear,
                pointsEarned: userProgress.monthlyStats.pointsThisMonth,
                activitiesCompleted: userProgress.monthlyStats.activitiesThisMonth,
                postsCreated: userProgress.monthlyStats.postsThisMonth,
                supportGiven: userProgress.monthlyStats.supportGivenThisMonth,
                isCurrentMonth: true,
                archivedAt: now
            });
        }

        // Sort by year and month
        monthlyHistory.sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
        });

        res.json({
            success: true,
            monthlyHistory
        });

    } catch (error) {
        console.error('Get monthly history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch monthly history',
            monthlyHistory: []
        });
    }
};

// Helper function to check and update monthly stats
const checkAndUpdateMonthlyStats = async (userProgress, currentMonth, currentYear) => {
    try {
        if (userProgress.monthlyStats.currentMonth !== currentMonth || 
            userProgress.monthlyStats.currentYear !== currentYear) {
            
            // Archive previous month data if it has any activity
            if (userProgress.monthlyStats.pointsThisMonth > 0 || 
                userProgress.monthlyStats.activitiesThisMonth > 0 ||
                userProgress.monthlyStats.postsThisMonth > 0) {
                
                userProgress.monthlyHistory.push({
                    month: userProgress.monthlyStats.currentMonth,
                    year: userProgress.monthlyStats.currentYear,
                    pointsEarned: userProgress.monthlyStats.pointsThisMonth,
                    activitiesCompleted: userProgress.monthlyStats.activitiesThisMonth,
                    postsCreated: userProgress.monthlyStats.postsThisMonth,
                    supportGiven: userProgress.monthlyStats.supportGivenThisMonth,
                    archivedAt: new Date()
                });
            }

            // Reset monthly stats for new month
            userProgress.monthlyStats = {
                currentMonth,
                currentYear,
                pointsThisMonth: 0,
                activitiesThisMonth: 0,
                postsThisMonth: 0,
                supportGivenThisMonth: 0
            };

            userProgress.lastMonthlyReset = new Date();
            await userProgress.save();
        }
    } catch (error) {
        console.error('Error updating monthly stats:', error);
    }
};

// Helper function to update weekly stats
const updateWeeklyStats = async (userProgress, weekActivities, weekPoints) => {
    try {
        const now = new Date();
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        
        // Check if we need to reset weekly stats
        const lastWeekStart = new Date(userProgress.weeklyStats.weekStartDate);
        const daysDiff = Math.floor((weekStart - lastWeekStart) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 7) {
            // Store last week's data
            userProgress.weeklyStats.lastWeekActivities = userProgress.weeklyStats.activitiesCompleted;
            userProgress.weeklyStats.lastWeekPosts = userProgress.weeklyStats.postsCreated;
            userProgress.weeklyStats.lastWeekPoints = userProgress.weeklyStats.pointsEarned;
            
            // Reset current week
            userProgress.weeklyStats.activitiesCompleted = weekActivities;
            userProgress.weeklyStats.pointsEarned = weekPoints;
            userProgress.weeklyStats.weekStartDate = weekStart;
            userProgress.lastWeeklyReset = now;
            
            await userProgress.save();
        } else {
            // Update current week stats
            userProgress.weeklyStats.activitiesCompleted = weekActivities;
            userProgress.weeklyStats.pointsEarned = weekPoints;
            await userProgress.save();
        }
    } catch (error) {
        console.error('Error updating weekly stats:', error);
    }
};

// API for creating donation payment
const createDonationPayment = async (req, res) => {
  try {
    const { amount, donationType, donorEmail, donorName } = req.body;
    const userId = req.userId;

    // Validate inputs
    if (!amount || amount < 1) {
      return res.json({ success: false, message: 'Invalid donation amount' });
    }

    if (!['one-time', 'monthly'].includes(donationType)) {
      return res.json({ success: false, message: 'Invalid donation type' });
    }

    if (!donorEmail || !donorName) {
      return res.json({ success: false, message: 'Donor name and email are required' });
    }

    // Create donation record
    const donationData = {
      amount: parseFloat(amount),
      donationType,
      donorEmail,
      donorName,
      userId: userId || null,
      status: 'pending',
      isRecurring: donationType === 'monthly',
      createdAt: new Date()
    };

    const donation = await donationModel.create(donationData);

    let sessionConfig = {
      payment_method_types: ['card'],
      customer_email: donorEmail,
      success_url: `${process.env.FRONTEND_URL}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/donation-cancel`,
      metadata: { 
        donationId: donation._id.toString(),
        donationType,
        donorName,
        donorEmail
      }
    };

    if (donationType === 'one-time') {
      // One-time payment
      sessionConfig.mode = 'payment';
      sessionConfig.line_items = [
        {
          price_data: {
            currency: process.env.CURRENCY || 'usd',
            product_data: {
              name: 'Mental Health Support Donation',
              description: 'Help us provide free counseling services to those in need',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ];
    } else {
      // Monthly subscription
      sessionConfig.mode = 'subscription';
      sessionConfig.line_items = [
        {
          price_data: {
            currency: process.env.CURRENCY || 'usd',
            product_data: {
              name: 'Monthly Mental Health Support Donation',
              description: 'Monthly recurring donation to support free counseling services',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ];
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ success: true, url: session.url, donationId: donation._id });

  } catch (error) {
    console.error('Donation payment error:', error);
    return res.json({ success: false, message: error.message });
  }
};

// Stripe Webhook Handler for donations
const donationWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

    console.log('Donation webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const donationId = session.metadata.donationId;
        
        // Update donation status and add Stripe info
        const updateData = {
          status: 'completed',
          stripeSessionId: session.id,
          paymentIntentId: session.payment_intent,
          completedAt: new Date()
        };

        // If it's a subscription, save the subscription ID
        if (session.mode === 'subscription') {
          updateData.stripeSubscriptionId = session.subscription;
        }

        await donationModel.findByIdAndUpdate(donationId, updateData);

        // Send thank you email (implement this function)
        // await sendDonationThankYouEmail(session.customer_email, session.metadata);

        console.log(`Donation ${donationId} completed successfully`);
        break;

      case 'invoice.payment_succeeded':
        // Handle successful recurring payment
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        
        // For recurring payments after the first one, create a new record
        if (invoice.billing_reason === 'subscription_cycle') {
          // Find the original donation to get donor info
          const originalDonation = await donationModel.findOne({
            stripeSubscriptionId: subscriptionId
          }).sort({ createdAt: 1 }); // Get the first/original donation

          if (originalDonation) {
            await donationModel.create({
              amount: invoice.amount_paid / 100, // Convert from cents
              donationType: 'monthly',
              donorEmail: originalDonation.donorEmail,
              donorName: originalDonation.donorName,
              userId: originalDonation.userId,
              status: 'completed',
              stripeSubscriptionId: subscriptionId,
              paymentIntentId: invoice.payment_intent,
              isRecurring: true,
              parentDonationId: originalDonation._id,
              completedAt: new Date(),
              createdAt: new Date()
            });
            
            console.log(`Recurring donation created for subscription ${subscriptionId}`);
          }
        }
        break;

      case 'invoice.payment_failed':
        // Handle failed recurring payment
        const failedInvoice = event.data.object;
        console.log('Recurring donation payment failed:', failedInvoice.id);
        
        // You might want to send an email to the donor
        // await sendPaymentFailedEmail(failedInvoice.customer_email);
        break;

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const subscription = event.data.object;
        console.log('Donation subscription cancelled:', subscription.id);
        break;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Donation webhook error:', error);
    return res.json({ success: false, message: error.message });
  }
};

// API for verifying donation payment
const verifyDonationPayment = async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.json({ success: false, message: "No session ID provided" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const donationId = session.metadata.donationId;
      
      const updateData = {
        status: 'completed',
        stripeSessionId: session.id,
        paymentIntentId: session.payment_intent,
        completedAt: new Date()
      };

      // If it's a subscription, save the subscription ID
      if (session.mode === 'subscription') {
        updateData.stripeSubscriptionId = session.subscription;
      }

      await donationModel.findByIdAndUpdate(donationId, updateData);

      res.json({ 
        success: true, 
        message: 'Thank you for your generous donation! Your support makes a real difference.',
        donation: {
          amount: session.amount_total / 100,
          donationType: session.metadata.donationType
        }
      });
    } else {
      return res.json({ success: false, message: 'Payment verification failed' });
    }

  } catch (error) {
    console.error('Donation verification error:', error);
    return res.json({ success: false, message: error.message });
  }
};

// API to cancel monthly donation subscription
const cancelMonthlyDonation = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const userId = req.userId;

    if (!subscriptionId) {
      return res.json({ success: false, message: 'Subscription ID is required' });
    }

    // Verify the subscription belongs to the user
    const donation = await donationModel.findOne({
      stripeSubscriptionId: subscriptionId,
      userId: userId,
      donationType: 'monthly'
    });

    if (!donation) {
      return res.json({ success: false, message: 'Subscription not found' });
    }

    // Cancel the subscription in Stripe
    await stripe.subscriptions.del(subscriptionId);

    res.json({ 
      success: true, 
      message: 'Monthly donation subscription cancelled successfully' 
    });

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return res.json({ success: false, message: error.message });
  }
};

// API to get user's donation history
const getUserDonationHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const userEmail = req.userEmail;

    if (!userId) {
      return res.json({ success: false, message: 'User not authenticated' });
    }

    // Build query to find donations
    const query = {
      $or: [
        { userId: userId },
      ]
    };

    // Add email condition only if userEmail is available
    if (userEmail) {
      query.$or.push({ donorEmail: userEmail });
    }

    const donations = await donationModel.find(query)
      .sort({ createdAt: -1 })
      .select('amount donationType status completedAt createdAt stripeSubscriptionId stripeSessionId isRecurring parentDonationId')
      .lean(); // Use lean() for better performance

    console.log(`Found ${donations.length} donations for user ${userId}`); // Debug log

    // Transform the data to ensure consistency
    const transformedDonations = donations.map(donation => ({
      _id: donation._id,
      amount: donation.amount,
      donationType: donation.donationType,
      status: donation.status,
      createdAt: donation.createdAt,
      completedAt: donation.completedAt,
      isRecurring: donation.isRecurring || donation.donationType === 'monthly',
      stripeSubscriptionId: donation.stripeSubscriptionId,
      stripeSessionId: donation.stripeSessionId,
      parentDonationId: donation.parentDonationId
    }));

    res.json({
      success: true,
      donations: transformedDonations,
      count: transformedDonations.length
    });

  } catch (error) {
    console.error('Donation history error:', error);
    return res.json({ success: false, message: error.message });
  }
};

export { registerUser, userLogin, 
         userInfo, updateProfile,
          bookAppointment, listAppointments, cancelAppointment, 
          paymentStripe, StripeWebhook, verifyPayment, 
          chatbotVisit, getAssessment, submitAssessment, checkAssessmentToday, 
          addMood, getMoodHistory, handleCrisisSupport, 
          counsellorList, joinLiveSession , getUserSessions, 
          getUserNotifications, notifyUser, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, getUnreadNotificationCount, 
          getPrograms, enrollProgram, 
          getCommunities, joinCommunity, leaveCommunity, 
          getWellnessActivities,getComments,
          getPosts, createPost,likePost, createComment,
          joinActivity,  completeActivity,  
          getUserProgress, updateWeeklyStats, getMonthlyHistory, getUserCommunities, checkAndUpdateMonthlyStats, getUserPosts,
          recordCounselorAssessment, recordActivityCompletion, 
          getAssessmentInsights, generateRecommendations,
          checkForNewBadges, getBadgeInfo,
          createDonationPayment, donationWebhook, verifyDonationPayment,
          cancelMonthlyDonation, getUserDonationHistory }