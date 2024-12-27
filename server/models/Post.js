import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    userId: {
      type: String, // Assuming userId is an ObjectId
      required: true,
    },
    firstName: {
      type: String,
      
    },
    lastName: {
      type: String,
      
    },
    comment: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);


commentSchema.virtual("userName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const { ObjectId } = mongoose.Schema.Types
const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    title:String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: [commentSchema], 
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
