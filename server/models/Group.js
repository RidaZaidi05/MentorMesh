import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
    teacherName: String,
    member1Data: {
      firstName: String,
      lastName: String,
      rollNumber: String,
      email: String,
      transcript: String,
      previousProjects: String,
    },
    member2Data: {
      firstName: String,
      lastName: String,
      rollNumber: String,
      email: String,
      transcript: String,
      previousProjects: String,
    },
    member3Data: {
      firstName: String,
      lastName: String,
      rollNumber: String,
      email: String,
      transcript: String,
      previousProjects: String,
    },
  });

const Group = mongoose.model("Group", GroupSchema);

export default Group;