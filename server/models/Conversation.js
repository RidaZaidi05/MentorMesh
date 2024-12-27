import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    groupName : {
        type : String , 
        required : true
    } , 
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;