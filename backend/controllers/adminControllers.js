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
import ChatRoom from '../models/chatModel.js'

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
        const donations = await donationModel.find({})

        // Calculate appointment revenue (only paid appointments)
        const appointmentRevenue = appointments
            .filter(appointment => appointment.payment === true)
            .reduce((total, appointment) => total + appointment.amount, 0)

        // Calculate donation revenue (only completed donations)
        const donationRevenue = donations
            .filter(donation => donation.status === 'completed')
            .reduce((total, donation) => total + donation.amount, 0)

        // Calculate total revenue
        const totalRevenue = appointmentRevenue + donationRevenue

        const dashboardData = {
            counsellors: counsellors.length,
            appointments: appointments.length,
            users: users.length,
            latestAppointments: appointments.reverse().slice(0, 5),
            appointmentRevenue,
            donationRevenue,
            totalRevenue,
            totalDonations: donations.length,
            completedDonations: donations.filter(donation => donation.status === 'completed').length,
            paidAppointments: appointments.filter(appointment => appointment.payment === true).length
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
    const { 
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
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !instructor || !outcome) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Format duration to match schema
    const durationValue = parseInt(duration) || 0;
    const durationUnit = duration.includes('week') ? 'weeks' : 
                        duration.includes('month') ? 'months' : 'days';

    // Save program
    const newProgram = new programModel({
      title,
      description,
      duration: {
        value: durationValue,
        unit: durationUnit
      },
      difficulty: difficulty || 'Beginner',
      category: category || 'Personal Growth',
      instructor: {
        name: instructor,
        title: "",
        bio: "",
        image: "",
        credentials: []
      },
      outcome,
      features: features || [],
      price: price || 'Free',
      thumbnail: thumbnail || "default-thumbnail.jpg",
      participants: 0,
      rating: {
        average: 0,
        count: 0
      }
    });

    await newProgram.save();

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

    res.json({ 
      success: true, 
      message: "Program added successfully", 
      program: newProgram 
    });
  } catch (err) {
    console.error("Error adding program:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
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
    const updateData = req.body;

    // Handle duration conversion if provided
    if (updateData.duration) {
      const durationValue = parseInt(updateData.duration) || 0;
      const durationUnit = updateData.duration.includes('week') ? 'weeks' : 
                          updateData.duration.includes('month') ? 'months' : 'days';
      
      updateData.duration = {
        value: durationValue,
        unit: durationUnit
      };
    }

    // Handle instructor if it's just a string
    if (updateData.instructor && typeof updateData.instructor === 'string') {
      updateData.instructor = {
        name: updateData.instructor,
        title: "",
        bio: "",
        image: "",
        credentials: []
      };
    }

    const updatedProgram = await programModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProgram) {
      return res.status(404).json({
        success: false,
        message: "Program not found"
      });
    }

    res.json({
      success: true,
      message: "Program updated successfully",
      program: updatedProgram
    });
  } catch (err) {
    console.error("Error updating program:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
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
    const counIds = counsellors.map(c => c._id);

    const communityData = {
      name,
      description,
      category,
      theme,
      rules: parsedRules,
      tags: parsedTags,
      isPrivate: isPrivate === 'true', // Convert string to boolean
      moderators: counIds,
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

// API to get all counsellors with their current month revenue
const getCounsellorsWithRevenue = async (req, res) => {
    try {
        // Get current month start and end dates
        const now = new Date()
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

        // Get all approved counsellors
        const counsellors = await counsellorModel.find({ status: 'approved' })

        // Calculate revenue for each counsellor
        const counsellorsWithRevenue = await Promise.all(
            counsellors.map(async (counsellor) => {
                // Get appointments for this counsellor in current month (only paid ones)
                const appointments = await appointmentModel.find({
                    counId: counsellor._id.toString(),
                    payment: true, // Only paid appointments
                    date: {
                        $gte: currentMonthStart.getTime(),
                        $lte: currentMonthEnd.getTime()
                    }
                })

                // Calculate total revenue and appointment count
                const currentMonthRevenue = appointments.reduce((total, appointment) => {
                    return total + (appointment.amount || 0)
                }, 0)

                const currentMonthAppointments = appointments.length

                // Get total completed appointments for this counsellor
                const totalAppointments = await appointmentModel.countDocuments({
                    counId: counsellor._id.toString(),
                    payment: true
                })

                // Calculate total lifetime revenue
                const allPaidAppointments = await appointmentModel.find({
                    counId: counsellor._id.toString(),
                    payment: true
                })

                const totalRevenue = allPaidAppointments.reduce((total, appointment) => {
                    return total + (appointment.amount || 0)
                }, 0)

                // Calculate payable amounts (90% after 10% platform fee)
                const currentMonthPayable = currentMonthRevenue * 0.9
                const totalPayable = totalRevenue * 0.9
                const platformFeeCurrentMonth = currentMonthRevenue * 0.1
                const platformFeeTotal = totalRevenue * 0.1

                return {
                    _id: counsellor._id,
                    name: counsellor.name,
                    email: counsellor.email,
                    specialty: counsellor.specialty,
                    fees: counsellor.fees,
                    location: counsellor.location,
                    image: counsellor.image,
                    available: counsellor.available,
                    sessionType: counsellor.sessionType,
                    experienceYears: counsellor.experienceYears,
                    currentMonthRevenue,
                    currentMonthPayable,
                    currentMonthAppointments,
                    totalRevenue,
                    totalPayable,
                    totalAppointments,
                    platformFeeCurrentMonth,
                    platformFeeTotal
                }
            })
        )

        // Sort by current month revenue (highest first)
        counsellorsWithRevenue.sort((a, b) => b.currentMonthRevenue - a.currentMonthRevenue)

        res.json({
            success: true,
            counsellors: counsellorsWithRevenue,
            month: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get individual counsellor details with revenue breakdown
const getCounsellorRevenue = async (req, res) => {
    try {
        const { counId } = req.params

        // Get counsellor details
        const counsellor = await counsellorModel.findById(counId)
        if (!counsellor) {
            return res.json({ success: false, message: "Counsellor not found" })
        }

        // Get current month start and end dates
        const now = new Date()
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

        // Get last month dates
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

        // Get current month appointments (paid only)
        const currentMonthAppointments = await appointmentModel.find({
            counId: counId,
            payment: true,
            date: {
                $gte: currentMonthStart.getTime(),
                $lte: currentMonthEnd.getTime()
            }
        })

        // Get last month appointments (paid only)
        const lastMonthAppointments = await appointmentModel.find({
            counId: counId,
            payment: true,
            date: {
                $gte: lastMonthStart.getTime(),
                $lte: lastMonthEnd.getTime()
            }
        })

        // Get all time appointments (paid only)
        const allTimeAppointments = await appointmentModel.find({
            counId: counId,
            payment: true
        })

        // Calculate revenues and payable amounts (90% after 10% platform fee)
        const currentMonthRevenue = currentMonthAppointments.reduce((total, app) => total + (app.amount || 0), 0)
        const lastMonthRevenue = lastMonthAppointments.reduce((total, app) => total + (app.amount || 0), 0)
        const totalRevenue = allTimeAppointments.reduce((total, app) => total + (app.amount || 0), 0)

        // Calculate payable amounts (after 10% platform fee deduction)
        const currentMonthPayable = currentMonthRevenue * 0.9
        const lastMonthPayable = lastMonthRevenue * 0.9
        const totalPayable = totalRevenue * 0.9

        // Calculate platform fees
        const platformFeeCurrentMonth = currentMonthRevenue * 0.1
        const platformFeeLastMonth = lastMonthRevenue * 0.1
        const platformFeeTotal = totalRevenue * 0.1

        // Calculate growth percentage (based on gross revenue)
        const growthPercentage = lastMonthRevenue > 0 
            ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
            : currentMonthRevenue > 0 ? 100 : 0

        // Calculate payable growth percentage
        const payableGrowthPercentage = lastMonthPayable > 0 
            ? ((currentMonthPayable - lastMonthPayable) / lastMonthPayable * 100).toFixed(1)
            : currentMonthPayable > 0 ? 100 : 0

        // Get recent appointments for details
        const recentAppointments = await appointmentModel.find({
            counId: counId,
            payment: true
        }).sort({ date: -1 }).limit(10)

        const revenueData = {
            counsellor: {
                _id: counsellor._id,
                name: counsellor.name,
                email: counsellor.email,
                specialty: counsellor.specialty,
                fees: counsellor.fees,
                location: counsellor.location,
                image: counsellor.image,
                available: counsellor.available,
                sessionType: counsellor.sessionType,
                experienceYears: counsellor.experienceYears,
                about: counsellor.about
            },
            revenue: {
                currentMonth: currentMonthRevenue,
                currentMonthPayable: currentMonthPayable,
                lastMonth: lastMonthRevenue,
                lastMonthPayable: lastMonthPayable,
                total: totalRevenue,
                totalPayable: totalPayable,
                growthPercentage: parseFloat(growthPercentage),
                payableGrowthPercentage: parseFloat(payableGrowthPercentage)
            },
            platformFees: {
                currentMonth: platformFeeCurrentMonth,
                lastMonth: platformFeeLastMonth,
                total: platformFeeTotal
            },
            appointments: {
                currentMonth: currentMonthAppointments.length,
                lastMonth: lastMonthAppointments.length,
                total: allTimeAppointments.length
            },
            recentAppointments: recentAppointments.map(app => ({
                _id: app._id,
                slotDate: app.slotDate,
                slotTime: app.slotTime,
                amount: app.amount,
                date: app.date,
                cancelled: app.cancelled,
                isCompleted: app.isCompleted,
                userData: app.userData
            }))
        }

        res.json({
            success: true,
            data: revenueData,
            month: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Get all chat rooms
const getAllChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom
      .find()
      .populate({
        path: "program",
        populate: [
          { path: "assignedCounselor", select: "name email gpcNumber specialty", model: "Counsellor" },
          { path: "counselors", select: "name email gpcNumber specialty status", model: "Counsellor" }, 
          { path: "moderators", select: "name email role avatar", model: "User" }
        ]
      })
      .lean();

    res.json({ success: true, chatRooms });
  } catch (error) {
    console.error("Get all chat rooms error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Assign counselors to a program
const assignCounsellor = async (req, res) => {
  try {
    const { programId } = req.params;
    const { counsellorId } = req.body;

    if (!counsellorId) {
      return res.status(400).json({ success: false, message: "Counsellor ID is required" });
    }

    // Find program and fix rating structure if needed
    let program = await programModel.findById(programId);
    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }

    // Fix rating structure if it's a number instead of object
    if (typeof program.rating === 'number' || !program.rating || program.rating === null) {
      await programModel.updateOne(
        { _id: programId },
        { 
          $set: { 
            rating: {
              average: typeof program.rating === 'number' ? program.rating : 0,
              count: program.reviews?.length || 0
            }
          } 
        }
      );
      // Refresh the program document
      program = await programModel.findById(programId);
    }

    // Find counsellor in Counsellor model
    const counsellor = await counsellorModel.findById(counsellorId);
    if (!counsellor) {
      return res.status(404).json({ success: false, message: "Counsellor not found" });
    }

    // Check if counsellor is approved
    if (counsellor.status !== 'approved') {
      return res.status(400).json({ 
        success: false, 
        message: "Counsellor must be approved before assignment" 
      });
    }

    // Initialize counselors array if it doesn't exist
    if (!program.counselors) {
      program.counselors = [];
    }

    // Prevent duplicates
    if (program.counselors.includes(counsellorId)) {
      return res.status(400).json({ success: false, message: "Counsellor already assigned" });
    }

    // Use findByIdAndUpdate instead of save to avoid validation issues
    const updatedProgram = await programModel.findByIdAndUpdate(
      programId,
      { 
        $addToSet: { counselors: counsellorId },
        $set: { assignedCounselor: counsellorId }
      },
      { 
        new: true, 
        runValidators: true,
        populate: {
          path: "counselors",
          select: "name email gpcNumber specialty status"
        }
      }
    );

    res.status(200).json({ 
      success: true, 
      message: "Counsellor assigned successfully", 
      program: updatedProgram 
    });
  } catch (error) {
    console.error("Assign counsellor error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// Unassign a counsellor from a program
const unassignCounsellor = async (req, res) => {
  try {
    const { programId, counsellorId } = req.params;

    const program = await programModel.findById(programId);
    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }

    // Initialize arrays if they don't exist
    if (!program.counsellors) program.counsellors = [];
    if (!program.moderators) program.moderators = [];

    // Remove counsellor (use counsellors not counselors)
    program.counsellors = program.counsellors.filter(
      id => id.toString() !== counsellorId
    );
    program.moderators = program.moderators.filter(
      id => id.toString() !== counsellorId
    );
    
    // Also remove from assignedCounselor if it matches
    if (
      program.assignedCounselor &&
      program.assignedCounselor.toString() === counsellorId
    ) {
      program.assignedCounselor = null;
    }

    await program.save();

    // Populate the updated program before sending response
    const updatedProgram = await programModel.findById(programId)
      .populate("counsellors", "name email role avatar");

    res.json({
      success: true,
      message: "Counsellor unassigned successfully",
      program: updatedProgram
    });
  } catch (error) {
    console.error("Unassign counsellor error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Don't forget to add this route to your admin router:
// adminRouter.delete('/chat/:roomId/unassign-counsellor/:counId', authAdmin, unassignCounsellor);
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


export { addCounsellor, loginAdmin, 
          allCounsellors, getAllAppointments, 
          adminDashboard, changeAvailability, updateCounsellorStatus,
          getPendingCounsellors, addProgram, getAllPrograms, updateProgram, deleteProgram, 
          createCommunity, 
          getDonationAnalytics, getDonations, exportDonations, 
          getCounsellorsWithRevenue, getCounsellorRevenue,
          getAllChatRooms, assignCounsellor, unassignCounsellor }