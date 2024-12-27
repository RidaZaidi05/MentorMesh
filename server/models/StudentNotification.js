import mongoose from "mongoose";
// Define the schema for StudentNotification
const studentNotificationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Assuming you have a Student model
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false // Default to unread
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create StudentNotification model from the schema
const StudentNotification = mongoose.model('StudentNotification', studentNotificationSchema);

export default StudentNotification;