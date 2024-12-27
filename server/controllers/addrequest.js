import Accept from '../models/Accept.js'; // Import the Accept model
import StudentNotification from '../models/StudentNotification.js';
import Conversation from '../models/Conversation.js';
 // Import the Notification model

 const acceptRequestMiddleware = async (req, res) => {
    try {
        // Extract data from the request body
        const { postId, teacherId, title, groupName, member1, member2, member3 } = req.body;

        // Create a new Accept document
        const accept = new Accept({
            postId,
            teacherId,
            title,
            groupName,
            member1,
            member2,
            member3,
        });

        await accept.save();

        // Extract student ids from members
        const studentIds = [member1, member2, member3].map(member => member.userId);

        // Save notifications for each student
        const studentNotifications = studentIds.map(async (studentId) => {
            const notification = new StudentNotification({
                studentId, // Assuming studentId is a string representing ObjectId
                message: `Your request for '${title}' has been accepted.`,
                read: false // Assuming notifications are initially unread
            });
            return await notification.save();
        });

        const conversationData = {
            groupName: groupName,
            members: [teacherId, ...studentIds]
        };

        const conversation = new Conversation(conversationData);
        await conversation.save();

        res.status(200).json({ message: 'Request Accepted successfully', accept });
    } catch (error) {
        console.error('Error accepting request:', error);
        res.status(500).json({ error: 'Failed to accept request' });
    }
};



export default acceptRequestMiddleware;
