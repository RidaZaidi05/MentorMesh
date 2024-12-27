

import express from "express";
import {getStudentNotification} from "../controllers/notifications.js"
import { deleteStudentNotification } from "../controllers/notifications.js";


const router = express.Router();

router.get('/:id', getStudentNotification);
router.delete('/:id', deleteStudentNotification);



export default router;