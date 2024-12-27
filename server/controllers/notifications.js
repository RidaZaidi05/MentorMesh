import Notification from "../models/notification.js";
import Accept from "../models/Accept.js";
import StudentNotification from "../models/StudentNotification.js";
import mongoose from "mongoose";

export const getNotification = async (req, res) => {
  try {
    const userId = req.params.id;
    const notifications = await Notification.find({ recipient: userId });
    // Map notifications to include the ObjectId field and createdAt time
    const notificationsWithTime = notifications.map((notification) => ({
      _id: notification._id, // ObjectId field
      createdAt: notification.createdAt, // createdAt time
      ...notification._doc, // Include other notification data
    }));
    res.json(notificationsWithTime);
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const getStudentNotification = async (req, res) => {
  try {
    const userId = req.params.id;
    // Fetch all notifications for the given user ID
    const notifications = await StudentNotification.find({ studentId: userId });

    // Modify each notification to include the ID
    const notificationsWithId = notifications.map((notification) => {
      return {
        _id: notification._id, // Include the ID
        createdAt: notification.createdAt,
        ...notification.toObject(), // Include other fields
      };
    });

    res.status(200).json(notificationsWithId);
  } catch (error) {
    console.error("Error fetching student notifications:", error);
    res.status(500).json({ error: "Failed to fetch student notifications" });
  }
};

export const deleteStudentNotification = async (req, res) => {
  try {
    const notificationId = req.params.id; // Get the notification ID from the request parameters

    // Convert the notificationId to an ObjectId
    const objectId = mongoose.Types.ObjectId(notificationId);

    // Find the notification by ID and delete it
    const deletedNotification = await StudentNotification.findByIdAndDelete(
      objectId
    );

    if (!deletedNotification) {
      // If the notification with the given ID is not found, return 404 Not Found
      return res.status(404).json({ error: "Notification not found" });
    }

    // If the notification is successfully deleted, return a success message
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    // If an error occurs, log the error and return a 500 Internal Server Error response
    console.error("Error deleting student notification:", error);
    res.status(500).json({ error: "Failed to delete student notification" });
  }
};
