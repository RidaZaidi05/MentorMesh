import mongoose from "mongoose";

const { Schema } = mongoose;

const teacherSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  lastName: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
  picturePath: {
    type: String,
    default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  areaofInterest: {
    type: Array, 
    default:[],
  },
  designation: {
    type: String,
    required: true,
  },
  education: {
    type: Array,
    default:[],
  },
  researches: {
    type: Array, 
    default:[],
  },
  friends: {
    type: Array,
    default: [],
  },
},
{ timestamps: true }
);

const Teacher = mongoose.model("Teacher",teacherSchema);

export default Teacher;

