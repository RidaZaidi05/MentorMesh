import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import Student from './models/Student.js'; // Adjust the path as necessary
const app = express();


// for forgot password
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
const JWT_SECRET = process.env.JWT_SECRET; // Retrieve JWT_SECRET from environment variables
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));




// import userRoutes from "./routes/users.js";
// import postRoutes from "./routes/posts.js";

// import notificationRoutes from "./routes/notification.js";

// import chatRoutes from "./routes/chatRoutes.js";

import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import notificationRoutes from "./routes/notification.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { createRequest } from "./controllers/request.js";
import { verifyToken } from "./middleware/auth.js";
import {createtrans} from "./controllers/request.js";

import chatRoutes from "./routes/chatRoutes.js";
import conversationRoute from "./routes/conversation.js"; 
import messageRoute from "./routes/message.js";


import userlikeroute from "./routes/getuserforlike.js"
import delelteNotification from "./routes/deleteNotification.js"
import  DeleteReqNotification  from "./routes/deleteReqNotification.js";
import acceptRequestMiddleware from "./controllers/addrequest.js"
import StudentNotification from "./routes/studentNotification.js"

// 
/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

/* MIDDLEWARE */
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true
}));

/* STATIC FILES */
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
// app.use("/transcripts", express.static(path.join(__dirname, "public/transcripts")));
app.use("/transcripts", express.static(path.join(__dirname, "public/transcripts")));

/* FILE STORAGE */
const storageAssets = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const storageTranscripts = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/transcripts");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadAssets = multer({ storage: storageAssets });
const uploadTranscripts = multer({ storage: storageTranscripts });


/* ROUTES WITH FILES */
app.post("/auth/register", uploadAssets.single("picture"), register);

app.post("/posts", verifyToken, uploadAssets.single("picture"), createPost);

app.post("/teacherData", uploadTranscripts.single("transcript"), createRequest);

app.post("/transData", uploadTranscripts.fields([
  { name: 'transcript1', maxCount: 1 },
  { name: 'transcript2', maxCount: 1 },
  { name: 'transcript3', maxCount: 1 }
]), createtrans);

app.post("/acceptRequest",acceptRequestMiddleware);




/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/chats", chatRoutes);
app.use("/chats/conversation" , conversationRoute);
app.use("/chats/message" , messageRoute);


app.use("/notification",notificationRoutes);
app.use("/user",userlikeroute);
app.use("/deleteNotifications", delelteNotification);
app.use("/deleteReqNotifications" , DeleteReqNotification);
app.use("/studentnotification", StudentNotification);

//---------------------------- forgot password--------------------------------------------------------------


app.post("/forgot-password", async (req, res) => {
  console.log("Inside server side code")
  const { email } = req.body;
  //console.log(email)
  try {
    const oldUser = await Student.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    //console.log(JWT_SECRET);
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `https://mentor-mesh.vercel.app/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Link",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return res.json({ status: "User Exists!!" });
  } catch (error) {}
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await Student.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await Student.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await Student.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

//---------------------------- forgot password--------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Hello, the server is running! ok to go...");
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  console.log("Connected to database:", mongoose.connection.db.databaseName);
})
.catch((error) => console.log(`${error} did not connect`));
