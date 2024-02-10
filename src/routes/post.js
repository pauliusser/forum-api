import express from "express";
import auth from "../middleware/auth.js";
import { CREATE_POST } from "../controllers/post.js";

const router = express.Router();

router.post("/posts", auth, CREATE_POST);
// router.get("/topics", GET_ALL_TOPICS);
// router.delete("/topics", DELETE_TOPIC);

export default router;
