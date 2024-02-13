import express from "express";
import auth from "../middleware/auth.js";
import {
  CREATE_VOTE,
  UPDATE_VOTE,
  DELETE_VOTE_BY_POST_ID,
  GET_ALL_VOTES,
} from "../controllers/vote.js";

const router = express.Router();

router.post("/votes", auth, CREATE_VOTE);
router.put("/votes/:id", auth, UPDATE_VOTE);
router.delete("/votes/:id", auth, DELETE_VOTE_BY_POST_ID);
router.get("/votes", auth, GET_ALL_VOTES);

export default router;
