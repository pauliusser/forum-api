import express from "express";
import { REGISTER } from "../controllers/user.js";

const router = express.Router();

router.post("/users/register", REGISTER);

export default router;
