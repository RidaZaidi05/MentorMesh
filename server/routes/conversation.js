// conversation.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
import {createConversation , getGroupsbyId} from "../controllers/conversation.js"



// Define routes using the route handlers
router.post("/", createConversation);

router.get("/:id", getGroupsbyId);


export default router;