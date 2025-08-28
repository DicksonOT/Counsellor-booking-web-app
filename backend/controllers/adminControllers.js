import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import counsellorModel from '../models/counsellorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
import transporter from '../config/email.js'
import programModel from '../models/programModel.js'
import { Community } from '../models/communityModel.js';
import UserProgress from '../models/userProgressModel.js'
import donationModel from '../models/donationModel.js'

// Add formatPath here
const formatPath = (filePath) => {
    if (!filePath) {
        return null;
    }
    // If the path is already a full URL (e.g., from Cloudinary), return it as is.
    if (filePath.startsWith('http')) {
        return filePath;
    }

    // We use a ternary operator to prevent double slashes, e.g., 'http://localhost:4000//uploads...'
    const baseUrl = process.env.BASE_URL.endsWith('/')
        ? process.env.BASE_URL.slice(0, -1)
        : process.env.BASE_URL;

    return `${baseUrl}/${filePath}`;
};

//API for adding counsellor 
const addCounsellor = async (req, res) => {
    try {

        const { name, email, password, specialty, degree, experience, about, fees, location, gpcNumber } = req.body
        const imageFile = req.file

        //  checking for all data to add to counsellor
        if (!name || !email || !password || !specialty || !degree || !experience || !about || !fees || !location || !imageFile) {
            return res.json({ success: false, message: 'Missing details' })
        }

        //  validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' })
        }

        //  Validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: 'Please enter a strong Password' })
        }

        // hashing counsellor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageURL = imageUpload.secure_url

        const counsellorData = {
            name,
            email,
            image: imageURL,
            password: hashedPassword,
            specialty,
            degree,
            experience,
            about,
            fees,
            location,
            gpcNumber,
            date: Date.now()
        }

        const newCounsellor = new counsellorModel(counsellorData)
        await newCounsellor.save()

        res.json({ success: true, message: 'Counsellor added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to Approve or Reject Counsellor
const updateCounsellorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.json({ success: false, message: "Invalid status value" });
    }

    const updatedCounsellor = await counsellorModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedCounsellor) {
      return res.json({ success: false, message: "Counsellor not found" });
    }

    // Prepare email content
    let subject, html;

    if (status === "approved") {
      subject = "Your Counsellor Application Has Been Approved";
      html = `
        <h2>Welcome to Quiet Place!</h2>
        <p>Dear ${updatedCounsellor.name},</p>
        <p>We are pleased to inform you that your application has been <strong>approved</strong>.</p>
        <p>You can now log in and begin helping users:</p>
        <p><a href="https://yourdomain.com/counsellor/login" target="_blank">Log in here</a></p>
        <p>Thank you for joining our mission to support mental wellness.</p>
      `;
    } else {
      subject = "Your Counsellor Application Has Been Rejected";
      html = `
        <h2>Application Update</h2>
        <p>Dear ${updatedCounsellor.name},</p>
        <p>After careful review, we regret to inform you that your counsellor application has been <strong>rejected</strong>.</p>
        <p>If you believe this was an error or would like to reapply with updated credentials, please contact our support team.</p>
        <p>Thank you for your interest in Quiet Place.</p>
      `;
    }

    // Send email
    await transporter.sendMail({
      from: `"Quiet Place Admin" <${process.env.MAIL_USER}>`,
      to: updatedCounsellor.email,
      subject,
      html
    });

    res.json({ success: true, message: `Counsellor ${status} and email sent.` });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// api for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })

        } else {
            res.json({ success: false, message: 'Invalid credentials' })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all counsellors list
const allCounsellors = async (req, res) => {
    try {

        const counsellors = await counsellorModel.find({}).select('-password')
        res.json({ success: true, counsellors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
// API for changing counsellor availability
const changeAvailability = async (req, res) => {
    try {
        const { counId } = req.body
        const counData = await counsellorModel.findById(counId)
        await counsellorModel.findByIdAndUpdate(counId, { available: !counData.available })

        res.json({ success: true, message: 'Availability Changed' })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

// API for getting all appointments
const getAllAppointments = async (req, res) => {
    try {
        const appointmentData = await appointmentModel.find({})
        res.json({ success: true, appointmentData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for getting dashboard data
const adminDashboard = async (req, res) => {
    try {
        const counsellors = await counsellorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashboardData = {
            counsellors: counsellors.length,
            appointments: appointments.length,
            users: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashboardData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for getting pending counsellors
const getPendingCounsellors = async (req, res) => {
    try {
        const counsellors = await counsellorModel.find({ status: 'pending' });

        const enriched = counsellors.map(c => ({
            _id: c._id,
            name: c.name,
            email: c.email,
            gpcNumber: c.gpcNumber,
            degree: c.degree,
            cvPath: c.cvPath,
            certificatePaths: c.certificatePaths || [],
            licensePath: c.licensePath,
            experienceYears: c.experienceYears,
            specialty: c.specialty,
            about: c.about,
            fees: c.fees,
            location: c.location,
            image: c.image,
            available: c.available,
            date: c.date,
        }));

        res.json({ success: true, counsellors: enriched });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API for adding programs
const addProgram = async (req, res) => {
  try {
    const { title, description, duration, difficulty, category, instructor, outcome, features, price, thumbnail } = req.body;

    // Save program
    const newProgram = new programModel({
      title,
      description,
      duration,
      difficulty,
      category,
      instructor,
      outcome,
      features,
      price,
      thumbnail,
      participants: 0,
      rating: 0
    });

    await newProgram.save();

    // Fetch all users
    const users = await userModel.find({}, "email name");

    if (users.length > 0) {
      const mailOptions = users.map(user => ({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: `New Wellness Program: ${newProgram.title}`,
        html: `
          <p>Hi ${user.name || "there"},</p>
          <p>We’re excited to announce a new wellness program:</p>
          <h2>${newProgram.title}</h2>
          <p><b>Duration:</b> ${newProgram.duration} | <b>Difficulty:</b> ${newProgram.difficulty}</p>
          <p><b>Outcome:</b> ${newProgram.outcome}</p>
          <p>${newProgram.description}</p>
          <p>Click below to explore and enroll:</p>
          <a href="${process.env.CLIENT_URL}/programs/${newProgram._id}" 
             style="display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;">
             View Program
          </a>
          <p style="margin-top:20px;">- The Quiet Place Team</p>
        `
      }));

      // Send emails in bulk
      await Promise.all(mailOptions.map(mail => transporter.sendMail(mail)));
    }

    res.json({ success: true, message: "Program added & users notified", program: newProgram });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// API for getting all programs
const getAllPrograms = async (req, res) => {
  try {
    const programs = await programModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, programs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// API for updating programs
const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, difficulty, category, instructor, outcome, features, price, thumbnail } = req.body;

    // Find the existing program
    const existingProgram = await programModel.findById(id);
    if (!existingProgram) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }

    // Store old program data for comparison
    const oldProgram = { ...existingProgram.toObject() };

    // Update program
    const updatedProgram = await programModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        duration,
        difficulty,
        category,
        instructor,
        outcome,
        features,
        price,
        thumbnail
      },
      { new: true, runValidators: true }
    );

    // Check what fields were updated for email notification
    const updatedFields = [];
    if (oldProgram.title !== updatedProgram.title) updatedFields.push('title');
    if (oldProgram.description !== updatedProgram.description) updatedFields.push('description');
    if (oldProgram.duration !== updatedProgram.duration) updatedFields.push('duration');
    if (oldProgram.difficulty !== updatedProgram.difficulty) updatedFields.push('difficulty');
    if (oldProgram.instructor !== updatedProgram.instructor) updatedFields.push('instructor');
    if (oldProgram.outcome !== updatedProgram.outcome) updatedFields.push('outcome');
    if (JSON.stringify(oldProgram.features) !== JSON.stringify(updatedProgram.features)) updatedFields.push('features');
    if (oldProgram.price !== updatedProgram.price) updatedFields.push('pricing');

    // Send email notifications if there are significant updates
    if (updatedFields.length > 0) {
      // Fetch all users
      const users = await userModel.find({}, "email name");

      if (users.length > 0) {
        const getUpdateMessage = () => {
          if (updatedFields.includes('title')) {
            return `The program "${oldProgram.title}" has been updated to "${updatedProgram.title}"`;
          }
          return `The program "${updatedProgram.title}" has been updated with new improvements`;
        };

        const getUpdatedFieldsList = () => {
          const fieldNames = {
            title: 'Program Title',
            description: 'Description',
            duration: 'Duration',
            difficulty: 'Difficulty Level',
            instructor: 'Instructor',
            outcome: 'Expected Outcomes',
            features: 'Program Features',
            pricing: 'Pricing'
          };
          
          return updatedFields.map(field => fieldNames[field] || field).join(', ');
        };

        const mailOptions = users.map(user => ({
          from: process.env.MAIL_USER,
          to: user.email,
          subject: `Program Update: ${updatedProgram.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">Program Updated!</h1>
              </div>
              
              <div style="padding: 30px; background-color: #f8f9fa;">
                <p style="font-size: 16px; color: #333;">Hi ${user.name || "there"},</p>
                
                <p style="font-size: 16px; color: #333; line-height: 1.6;">
                  ${getUpdateMessage()}. Here's what's new:
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                  <h2 style="color: #333; margin-top: 0;">${updatedProgram.title}</h2>
                  <p style="color: #666; margin: 5px 0;"><strong>Instructor:</strong> ${updatedProgram.instructor}</p>
                  <p style="color: #666; margin: 5px 0;"><strong>Duration:</strong> ${updatedProgram.duration}</p>
                  <p style="color: #666; margin: 5px 0;"><strong>Difficulty:</strong> ${updatedProgram.difficulty}</p>
                  <p style="color: #666; margin: 15px 0 5px 0;"><strong>What You'll Achieve:</strong></p>
                  <p style="color: #555; line-height: 1.5;">${updatedProgram.outcome}</p>
                </div>
                
                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0; color: #1976d2; font-size: 14px;">
                    <strong>Updated Areas:</strong> ${getUpdatedFieldsList()}
                  </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.CLIENT_URL}/programs/${updatedProgram._id}" 
                     style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                     View Updated Program
                  </a>
                </div>
                
                <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center; color: #666;">
                  <p style="margin: 0;">Keep growing with The Quiet Place</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">- The Quiet Place Team</p>
                </div>
              </div>
            </div>
          `
        }));

        // Send emails in bulk
        try {
          await Promise.all(mailOptions.map(mail => transporter.sendMail(mail)));
        } catch (emailError) {
          console.log('Email notification error:', emailError);
          // Don't fail the update if email fails
        }
      }
    }

    res.json({ 
      success: true, 
      message: "Program updated successfully" + (updatedFields.length > 0 ? " & users notified" : ""), 
      program: updatedProgram 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// API for deleting programs
const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the program before deleting
    const program = await programModel.findById(id);
    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }

    // Store program data for email notification
    const deletedProgramData = { ...program.toObject() };

    // Delete the program
    await programModel.findByIdAndDelete(id);

    res.json({ 
      success: true, 
      message: "Program deleted successfully",
      deletedProgram: deletedProgramData 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// create community
const createCommunity = async (req, res) => {
  try {
    const { name, description, category, theme, rules, tags, isPrivate } = req.body;
    const userId = req.userId;
    const imageFile = req.file; 

    // Parse JSON strings back to arrays if they exist
    const parsedRules = rules ? JSON.parse(rules) : [];
    const parsedTags = tags ? JSON.parse(tags) : [];

    // Check for existing community with same name
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ success: false, message: 'Community with this name already exists' });
    }

    // Get all approved counsellors (they act as moderators)
    const counsellors = await counsellorModel.find({ status: 'approved' }, '_id');
    const counsellorIds = counsellors.map(c => c._id);

    const communityData = {
      name,
      description,
      category,
      theme,
      rules: parsedRules,
      tags: parsedTags,
      isPrivate: isPrivate === 'true', // Convert string to boolean
      moderators: counsellorIds,
      members: [userId],         
      memberCount: 1
    };

    // Handle image upload if provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { 
        resource_type: 'image',
        folder: 'community_images', // Optional: organize uploads in folders
        transformation: [
          { width: 400, height: 400, crop: 'fill' }, // Resize to square
          { quality: 'auto' } // Optimize quality
        ]
      });
      communityData.image = imageUpload.secure_url;
    }

    // Create new community
    const community = new Community(communityData);
    await community.save();

    // Update user progress (wellness points for creating a community)
    await UserProgress.findOneAndUpdate(
      { user: userId },
      { 
        $addToSet: { joinedCommunities: community._id }, // ✅ avoids duplicates
        $inc: { wellnessPoints: 10 }
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ 
      success: true, 
      message: 'Community created successfully!', 
      community 
    });

  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get donation analytics 
const getDonationAnalytics = async (req, res) => {
  try {
    const totalDonations = await donationModel.countDocuments({ status: 'completed' });
    const totalAmount = await donationModel.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyDonors = await donationModel.countDocuments({
      donationType: 'monthly',
      status: 'completed'
    });

    const recentDonations = await donationModel.find({ status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(10)
      .select('amount donorName donationType completedAt');

    res.json({
      success: true,
      analytics: {
        totalDonations,
        totalAmount: totalAmount[0]?.total || 0,
        monthlyDonors,
        recentDonations
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return res.json({ success: false, message: error.message });
  }
};

// API to get all donations with filters
const getDonations = async (req, res) => {
  try {
    const { filter, dateRange, search } = req.query;
    let query = {};
    
    // Apply status/type filters
    if (filter && filter !== 'all') {
      if (filter === 'completed' || filter === 'pending' || filter === 'failed') {
        query.status = filter;
      } else if (filter === 'one-time') {
        query.donationType = 'one-time';
      } else if (filter === 'monthly') {
        query.donationType = 'monthly';
      }
    }
    
    // Apply date range filters
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      if (dateRange === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (dateRange === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      
      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }
    
    // Apply search filter
    if (search && search.trim()) {
      query.$or = [
        { donorName: { $regex: search, $options: 'i' } },
        { donorEmail: { $regex: search, $options: 'i' } }
      ];
    }
    
    const donations = await donationModel.find(query)
      .sort({ createdAt: -1 })
      .limit(100); // Limit to prevent too much data
    
    res.json({
      success: true,
      donations
    });
    
  } catch (error) {
    console.error('Get donations error:', error);
    return res.json({ success: false, message: error.message });
  }
};

// API to export donations to CSV
const exportDonations = async (req, res) => {
  try {
    const donations = await donationModel.find({})
      .sort({ createdAt: -1 })
      .select('donorName donorEmail amount donationType status createdAt completedAt');
    
    // Create CSV header
    const csvHeader = 'Donor Name,Donor Email,Amount,Type,Status,Created Date,Completed Date\n';
    
    // Create CSV rows
    const csvRows = donations.map(donation => {
      const createdDate = new Date(donation.createdAt).toLocaleDateString();
      const completedDate = donation.completedAt ? new Date(donation.completedAt).toLocaleDateString() : '';
      
      return `"${donation.donorName || 'Anonymous'}","${donation.donorEmail}","${donation.amount}","${donation.donationType}","${donation.status}","${createdDate}","${completedDate}"`;
    }).join('\n');
    
    const csvContent = csvHeader + csvRows;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="donations-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);
    
  } catch (error) {
    console.error('Export donations error:', error);
    return res.json({ success: false, message: error.message });
  }
};

// Reset user progress (admin function)
// const resetUserProgress = async (req, res) => {
//   const { userId } = req.params;
//   const { resetType = 'partial', adminId } = req.body; // 'partial' or 'complete'

//   try {
//     const progress = await UserProgress.findOne({ user: userId });
//     if (!progress) {
//       return res.json({ success: false, message: 'User progress not found' });
//     }

//     if (resetType === 'complete') {
//       // Complete reset - remove all data
//       await UserProgress.findOneAndDelete({ user: userId });
//       res.json({ success: true, message: 'User progress completely reset' });
//     } else {
//       // Partial reset - keep history but reset current scores
//       progress.scoreHistory.push({
//         score: 0,
//         source: 'manual',
//         notes: `Progress reset by admin: ${adminId}`,
//         date: new Date()
//       });

//       progress.wellnessPoints = 0;
//       progress.totalScore = 0;
//       progress.monthlyStats = {
//         currentMonth: new Date().getMonth(),
//         currentYear: new Date().getFullYear(),
//         pointsThisMonth: 0,
//         activitiesThisMonth: 0,
//         postsThisMonth: 0,
//         supportGivenThisMonth: 0
//       };

//       await progress.save();
//       res.json({ success: true, message: 'User progress partially reset' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: 'Error resetting user progress' });
//   }
// };


export { addCounsellor, loginAdmin, allCounsellors, getAllAppointments, adminDashboard, changeAvailability, updateCounsellorStatus, getPendingCounsellors, addProgram, getAllPrograms, updateProgram, deleteProgram, createCommunity, getDonationAnalytics, getDonations, exportDonations }


