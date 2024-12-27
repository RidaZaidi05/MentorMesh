import express from "express";
//  import { getFeedPosts, getUserPosts, likePost, addComment } from "../controllers/posts.js";
 import {getFeedPosts , likePost , addComment , getUserPosts , requestNotification , getPostById}  from "../controllers/posts.js";

 import {createtrans} from "../controllers/request.js";

import { verifyToken } from "../middleware/auth.js";
import { Server }  from 'socket.io';
import http from 'http';
import cors from 'cors';
import bodyParser from "body-parser";
const router = express.Router();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: `${process.env.FRONTEND_URL}`,
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// /* READ */
router.get("/",getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:postId", getPostById);

// /* UPDATE */
router.patch("/:id/like", verifyToken, (req, res) => {
    // Call likePost controller and pass io as an argument
    likePost(io, req, res);
  });

router.post("/:postId/comments", verifyToken, (req, res) => {
    // Call addComment controller and pass io as an argument
    addComment(io, req, res);
});

router.post("/addnotify",(req, res) => {
  console.log("i am here in router for notify");
  requestNotification(io, req, res);
} );

server.listen(3002, () => {
    console.log(`Socket.io server running on port 3002`);
  });

export default router;
