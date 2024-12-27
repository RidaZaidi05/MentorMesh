import express from "express";

import {
    accessChat , fetchChats , createGroupChat , renameGroup , 
 addToGroup , removeFromGroup , searchUsers
  } from "../controllers/chatControllers.js";

import {searchGroups} from "../controllers/Group.js"
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();

router.route("/").post( accessChat);
router.route("/").get(fetchChats);
router.route("/group").post(createGroupChat);
router.route("/rename").put(renameGroup);
router.route("/groupremove").put(removeFromGroup);
router.route("/groupadd").put(addToGroup);

router.get('/users', searchUsers);
router.get('/groups', searchGroups);



export default router;