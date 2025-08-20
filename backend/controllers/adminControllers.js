import validator from 'validator'
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import counsellorModel from '../models/counsellorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
import transporter from '../config/email.js'

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


export { addCounsellor, loginAdmin, allCounsellors, getAllAppointments, adminDashboard, changeAvailability, updateCounsellorStatus, getPendingCounsellors }


