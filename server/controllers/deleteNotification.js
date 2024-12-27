import Notification from "../models/notification.js";


export const DeleteNotification = async (req, res) => {
    console.log("i am hereeeeeeeeeeeeeeeeeeeeeeeeee");
  try {
    
    const userId = req.params.id;
    
    await Notification.deleteMany({ recipient: userId, action: { $in: ['like', 'comment'] } });
    
    res.status(200).json({ message: 'Notifications deleted successfully' });
  } catch (error) {
    console.error("Error deleting notifications:", error.message);
    res.status(500).json({ error: "Failed to delete notifications" });
  }
};
