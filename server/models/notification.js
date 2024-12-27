import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    recipient: {
      type:String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
