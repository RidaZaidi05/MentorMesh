import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      rollNo,
      degree,
      passingyear 
    } = req.body;

    
    
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new Student({
      firstName,
      lastName,
      email,
      password:passwordHash,
      picturePath,
      rollNo,
      degree,
      passingyear, 
    });
    //console.log("i am here");
    // Save the new user to the database
    const savedUser = await newUser.save();

    console.log("svaeddd ittt", savedUser);
    // Respond with the saved user object
    res.status(201).json(savedUser);


  } catch (err) {
    // If an error occurs, respond with a 500 status and the error message
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {

    
    const { email, password, userType } = req.body;
    let user;

    if (userType === "teacher") {
      user = await Teacher.findOne({ email: email });
    } else if (userType === "student") {
      console.log(userType);
      user = await Student.findOne({ email: email });
    }

    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
