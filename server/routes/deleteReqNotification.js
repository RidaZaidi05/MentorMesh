import {
    DeleteReqNotification
} from "../controllers/deleteRequestNotification.js";
import express from "express";

const router = express.Router();

router.delete("/:notificationId" , DeleteReqNotification);
export default router;

