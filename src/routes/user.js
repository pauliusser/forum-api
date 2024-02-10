import express from "express";
import auth from "../middleware/auth.js";
import { REGISTER, LOGIN, VALIDATE } from "../controllers/user.js";

const router = express.Router();

router.post("/users/register", REGISTER);
router.post("/users/logIn", LOGIN);
router.get("/users/validate", auth, VALIDATE);

export default router;
