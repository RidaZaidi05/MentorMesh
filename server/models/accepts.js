import mongoose from "mongoose";

const { Schema } = mongoose;

// Define member schema
const memberSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  transcript: String,
  previousProjects: String,
  degree: String
});

// Define request schema
const acceptsSchema = new Schema({
  postId: {
    type: String,
    required: true
  },
  teacherId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  groupName: {
    type: String,
    required: true
  },
  member1: {
    type: memberSchema,
    required: true
  },
  member2: memberSchema,
  member3: memberSchema
});

const Accept = mongoose.model('Accept', acceptsSchema);

export default Accept;
