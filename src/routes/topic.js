import express from "express";
import auth from "../middleware/auth.js";
import {
  CREATE_TOPIC,
  GET_ALL_TOPICS,
  DELETE_TOPIC_BY_ID,
  GET_TOPIC_BY_ID,
} from "../controllers/topic.js";

const router = express.Router();

router.post("/topics", auth, CREATE_TOPIC);
router.get("/topics", auth, GET_ALL_TOPICS);
router.get("/topics/:id", auth, GET_TOPIC_BY_ID);
router.delete("/topics/:id", auth, DELETE_TOPIC_BY_ID);

export default router;
