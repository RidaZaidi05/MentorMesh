import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import mongoose from "mongoose";
/* READ */
export const getUser = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { userType } = req.query;
    
    const id_ = mongoose.Types.ObjectId(id);

    let user;
    
    if (userType === "Student") {
      user = await Student.findById(id);
    } else if (userType === "Teacher" || userType === "None" ) {
      user = await Teacher.findById(id_);
    }

    
   
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getStudentsAndTeachers = async (req, res) => {
  try {
    // Fetch all students
    const students = await Student.find();
    // Map student data to include _id, fullName, and userType
    const studentData = students.map(student => ({
      _id: student._id,
      fullName: `${student.firstName} ${student.lastName}`,
      userType: 'Student'
    }));

    // Fetch all teachers
    const teachers = await Teacher.find();
    // Map teacher data to include _id, fullName, and userType
    const teacherData = teachers.map(teacher => ({
      _id: teacher._id,
      fullName: `${teacher.firstName} ${teacher.lastName}`,
      userType: 'Teacher'
    }));

    // Combine student and teacher data into one array
    const userData = [...studentData, ...teacherData];
    
    // Send the combined user data in the response
    res.status(200).json(userData);
  } 
  catch (err) {
    // Handle errors
    res.status(404).json({ message: err.message });
  }
};


export const getUserforLike = async (req, res) => {
  try {
    console.log("i am here");
    const { id } = req.params;
  

    const id_ = mongoose.Types.ObjectId(id);

    var user;
    user = await Student.findById(id);
    if(!user){
      user = await Teacher.findById(id_);
    }
    console.log(user);
   res.status(200).json(user);

  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};



// export const getUserFriends = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id);

//     const friends = await Promise.all(
//       user.friends.map((id) => User.findById(id))
//     );
//     const formattedFriends = friends.map(
//       ({ _id, firstName, lastName, occupation, location, picturePath }) => {
//         return { _id, firstName, lastName, occupation, location, picturePath };
//       }
//     );
//     res.status(200).json(formattedFriends);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

// /* UPDATE */
// export const addRemoveFriend = async (req, res) => {
//   try {
//     const { id, friendId } = req.params;
//     const user = await User.findById(id);
//     const friend = await User.findById(friendId);

//     if (user.friends.includes(friendId)) {
//       user.friends = user.friends.filter((id) => id !== friendId);
//       friend.friends = friend.friends.filter((id) => id !== id);
//     } else {
//       user.friends.push(friendId);
//       friend.friends.push(id);
//     }
//     await user.save();
//     await friend.save();

//     const friends = await Promise.all(
//       user.friends.map((id) => User.findById(id))
//     );
//     const formattedFriends = friends.map(
//       ({ _id, firstName, lastName, occupation, location, picturePath }) => {
//         return { _id, firstName, lastName, occupation, location, picturePath };
//       }
//     );

//     res.status(200).json(formattedFriends);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };
