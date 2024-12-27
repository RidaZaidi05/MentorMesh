// message.js
import express from "express";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
import { addMessage  ,  getMessagesByConversationId , addNotification , message_notifications , deleteNotification} from "../controllers/message.js";



router.post("/", addMessage);

router.get("/:conversationId" , getMessagesByConversationId);

router.post("/notify", addNotification);
router.delete("/", deleteNotification);
router.get("/" , message_notifications)


export default router;