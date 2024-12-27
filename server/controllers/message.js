import Message from "../models/message.js"; 
import Message_Notification from "../models/message_notification.js";
// Define route handler for adding a message
export async function addMessage(req, res) {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Define route handler for getting messages by conversation ID
export async function getMessagesByConversationId(req, res) {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    
  
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

//addNotification

export async function addNotification(req, res) {
  const newMessage = new Message_Notification(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const message_notifications = async (req, res) => {
  try {
    const groups = await Message_Notification.find();
   // const groupNames = groups.map(group => group.groupName);
    res.status(200).json(groups); // Sending only the group names in the response
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export async function deleteNotification(req, res) {
  const userId = req.body.userId; // Assuming userId is sent in the request body

  try {
    // Find and delete message notifications with the given user ID
    const deletedNotifications = await Message_Notification.deleteMany({
      userId: userId,
    });

    // Respond with a success message or the deleted notifications
    res.status(200).json(deletedNotifications);
  } catch (err) {
    // Handle any errors
    res.status(500).json(err);
  }
}