import transporter from "../config/email.js";


const sendActivityNotifications = async (users, counsellor, activity, isUpdate = false) => {
    try {
        
        const activityTypeNames = {
            daily_reflection: 'Daily Reflection',
            mood_checking: 'Mood Check-in',
            challenge: 'Wellness Challenge',
            meditation: 'Guided Meditation',
            exercise: 'Physical Exercise',
            journaling: 'Therapeutic Journaling'
        };

        const activityTypeName = activityTypeNames[activity.activityType] || activity.activityType;
        
        const emailPromises = users.map(user => {
            const subject = isUpdate ? 
                `Updated Activity: ${activity.title}` : 
                `New Wellness Activity: ${activity.title}`;
                
            const htmlMessage = `
                <h2>${isUpdate ? 'Activity Updated' : 'New Wellness Activity Available'}</h2>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #2563eb; margin-top: 0;">${activity.title}</h3>
                    <p><strong>Type:</strong> ${activityTypeName}</p>
                    <p><strong>Duration:</strong> ${activity.duration || 30} minutes</p>
                    <p><strong>Difficulty:</strong> ${activity.difficulty}</p>
                    <p><strong>Description:</strong></p>
                    <p style="font-style: italic; color: #6b7280;">${activity.description}</p>
                    
                    ${activity.instructions && activity.instructions.length > 0 ? `
                        <p><strong>Instructions Preview:</strong></p>
                        <ol style="color: #6b7280;">
                            ${activity.instructions.slice(0, 3).map(instruction => `<li>${instruction}</li>`).join('')}
                            ${activity.instructions.length > 3 ? `<li><em>+ ${activity.instructions.length - 3} more steps</em></li>` : ''}
                        </ol>
                    ` : ''}
                    
                    ${activity.startDate ? `<p><strong>Starts:</strong> ${new Date(activity.startDate).toLocaleDateString()}</p>` : ''}
                    ${activity.endDate ? `<p><strong>Ends:</strong> ${new Date(activity.endDate).toLocaleDateString()}</p>` : ''}
                </div>
                <p>Created by: <strong>${counsellor.name}</strong></p>
                <p style="margin-top: 20px;">
                    <a href="${process.env.FRONTEND_URL}/wellness/activities" 
                       style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        View Activity
                    </a>
                </p>
                <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
                    This is an automated notification from your wellness platform.
                </p>
            `;

            const mailOptions = {
                from: process.env.MAIL_USER,
                to: user.email,
                subject: subject,
                html: htmlMessage,
                text: `
                    ${isUpdate ? 'Activity Updated' : 'New Wellness Activity Available'}
                    
                    Title: ${activity.title}
                    Type: ${activityTypeName}
                    Duration: ${activity.duration || 30} minutes
                    Difficulty: ${activity.difficulty}
                    
                    Description: ${activity.description}
                    
                    Created by: ${counsellor.name}
                    
                    View the full activity at: ${process.env.FRONTEND_URL}/wellness/activities
                `
            };

            return transporter.sendMail(mailOptions);
        });

        const results = await Promise.allSettled(emailPromises);
        
        // Log results
        const successful = results.filter(result => result.status === 'fulfilled').length;
        const failed = results.filter(result => result.status === 'rejected').length;
        
        console.log(`Activity notifications: ${successful} sent successfully, ${failed} failed`);
        
        // Log failed emails for debugging
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Failed to send to ${users[index].email}:`, result.reason);
            }
        });

        return {
            success: true,
            sent: successful,
            failed: failed,
            total: users.length
        };
        
    } catch (error) {
        console.error('Send activity notifications error:', error);
        return {
            success: false,
            error: error.message,
            sent: 0,
            failed: users.length,
            total: users.length
        };
    }
};

// Send activity reminder notifications
const sendActivityReminders = async (activities) => {
    try {
        
        const emailPromises = activities.flatMap(activity => 
            activity.participants.map(user => {
                const mailOptions = {
                    from: process.env.MAIL_USER,
                    to: user.email,
                    subject: `Reminder: Complete "${activity.title}" Activity`,
                    html: `
                        <h2>Activity Reminder</h2>
                        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                            <h3 style="color: #856404; margin-top: 0;">${activity.title}</h3>
                            <p style="color: #856404;">You haven't completed this activity yet.</p>
                            ${activity.endDate ? `<p style="color: #856404;"><strong>Deadline:</strong> ${new Date(activity.endDate).toLocaleDateString()}</p>` : ''}
                        </div>
                        <p style="margin-top: 20px;">
                            <a href="${process.env.FRONTEND_URL}/wellness/activities/${activity._id}" 
                               style="background-color: #ffc107; color: #212529; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                Complete Activity
                            </a>
                        </p>
                    `,
                    text: `
                        Activity Reminder
                        
                        You haven't completed the activity "${activity.title}" yet.
                        ${activity.endDate ? `Deadline: ${new Date(activity.endDate).toLocaleDateString()}` : ''}
                        
                        Complete it at: ${process.env.FRONTEND_URL}/wellness/activities/${activity._id}
                    `
                };

                return transporter.sendMail(mailOptions);
            })
        );

        const results = await Promise.allSettled(emailPromises);
        const successful = results.filter(result => result.status === 'fulfilled').length;
        
        console.log(`Activity reminders sent: ${successful} successful`);
        
        return { success: true, sent: successful };
        
    } catch (error) {
        console.error('Send activity reminders error:', error);
        return { success: false, error: error.message };
    }
};

// Activity completion validation function
const validateActivityCompletion = (activity, completionData) => {
    const { rating, reflection } = completionData;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }
    
    // Activity-specific validation
    switch (activity.activityType) {
        case 'mood_checking':
            if (!reflection || reflection.trim().length < 10) {
                throw new Error('Mood check-in requires a reflection of at least 10 characters');
            }
            break;
            
        case 'journaling':
            if (!reflection || reflection.trim().length < 50) {
                throw new Error('Journaling activities require a reflection of at least 50 characters');
            }
            break;
            
        case 'daily_reflection':
            if (!reflection || reflection.trim().length < 20) {
                throw new Error('Daily reflection requires a reflection of at least 20 characters');
            }
            break;
            
        default:
            // For other activities, reflection is optional but recommended
            break;
    }
    
    return true;
};

// Function to get activity recommendations based on user's completion history
const getActivityRecommendations = async (userId) => {
    try {
        // Get user's completed activities
        const completedActivities = await WellnessActivity.find({
            'completions.user': userId
        }).select('activityType difficulty completions');
        
        // Analyze completion patterns
        const typePreferences = {};
        const difficultyPreferences = {};
        let totalRating = 0;
        let ratingCount = 0;
        
        completedActivities.forEach(activity => {
            const userCompletion = activity.completions.find(c => c.user.toString() === userId);
            if (userCompletion) {
                // Track activity type preferences
                typePreferences[activity.activityType] = (typePreferences[activity.activityType] || 0) + 1;
                
                // Track difficulty preferences based on ratings
                if (userCompletion.rating >= 4) {
                    difficultyPreferences[activity.difficulty] = (difficultyPreferences[activity.difficulty] || 0) + 1;
                }
                
                totalRating += userCompletion.rating;
                ratingCount++;
            }
        });
        
        // Find preferred activity types and difficulties
        const preferredType = Object.keys(typePreferences).sort((a, b) => typePreferences[b] - typePreferences[a])[0];
        const preferredDifficulty = Object.keys(difficultyPreferences).sort((a, b) => difficultyPreferences[b] - difficultyPreferences[a])[0];
        
        // Get recommendations
        const recommendations = await WellnessActivity.find({
            isActive: true,
            participants: { $ne: userId }, // Not already participating
            $or: [
                { activityType: preferredType },
                { difficulty: preferredDifficulty },
                { participantCount: { $lt: 50 } } // Popular but not overcrowded
            ]
        })
        .populate('createdBy', 'name')
        .limit(5)
        .sort({ createdAt: -1 });
        
        return {
            recommendations,
            userStats: {
                completedCount: completedActivities.length,
                averageRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0,
                preferredType,
                preferredDifficulty
            }
        };
    } catch (error) {
        console.error('Get activity recommendations error:', error);
        return { recommendations: [], userStats: {} };
    }
};

export {
    sendActivityNotifications,
    sendActivityReminders,
    validateActivityCompletion,
    getActivityRecommendations
};