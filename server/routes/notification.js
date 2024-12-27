import express from "express";
import {getNotification} from "../controllers/notifications.js"


const router = express.Router();

router.get('/:id', getNotification);

export default router;