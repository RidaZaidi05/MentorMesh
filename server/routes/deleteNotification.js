import express from "express";
import {
    DeleteNotification
} from "../controllers/deleteNotification.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.delete("/:id", DeleteNotification);
export default router;