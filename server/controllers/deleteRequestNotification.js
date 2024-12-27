import Notification from "../models/notification.js";

export const DeleteReqNotification = async (req, res) => {
    
    try {
    const notificationId = req.params.notificationId;
    //console.log(notificationId,"here is me ");

    // Find the notification by its ID and delete it
    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error("Error deleting notification:", error.message);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};
