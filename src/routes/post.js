import express from "express";
import auth from "../middleware/auth.js";
import {
  CREATE_POST,
  GET_ALL_POSTS_BY_TOPIC_ID,
  DELETE_POST_BY_ID,
  GET_ALL_POSTS_BY_USER_ID,
} from "../controllers/post.js";

const router = express.Router();

router.post("/posts", auth, CREATE_POST);
router.get("/posts/:id", auth, GET_ALL_POSTS_BY_TOPIC_ID);
router.get("/posts/user/:id", auth, GET_ALL_POSTS_BY_USER_ID);
router.delete("/posts/:id", auth, DELETE_POST_BY_ID);

export default router;
