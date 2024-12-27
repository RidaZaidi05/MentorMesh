import express from "express";
import {
    getUserforLike
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */

router.get("/:id", getUserforLike);

export default router;
