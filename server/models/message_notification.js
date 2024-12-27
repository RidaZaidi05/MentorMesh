// Message.js

import mongoose from "mongoose";

const Message_Notification_Schema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    userId : {
      type: String,
    },
    groupName: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message_Notification = mongoose.model("Message_Notification", Message_Notification_Schema);

export default Message_Notification;