import express from "express";
import auth from "../middleware/auth.js";
import { CREATE_TOPIC, GET_ALL_TOPICS } from "../controllers/topic.js";

const router = express.Router();

router.post("/topics", auth, CREATE_TOPIC);
router.get("/topics", auth, GET_ALL_TOPICS);
// router.delete("/topics", DELETE_TOPIC);

export default router;
