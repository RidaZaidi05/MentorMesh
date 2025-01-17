import express from "express";
import {
  getUser , getStudentsAndTeachers
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", getUser);

router.post("/StudentsAndTeachers" , getStudentsAndTeachers);

// router.get("/:id/friends", verifyToken, getUserFriends);

// /* UPDATE */
// router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
