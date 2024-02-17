import express from "express";
import auth from "../middleware/auth.js";
import { REGISTER, LOGIN, VALIDATE, GET_CURRENT_USER } from "../controllers/user.js";

const router = express.Router();

router.post("/users/register", REGISTER);
router.post("/users/logIn", LOGIN);
router.get("/users/validate", auth, VALIDATE);
router.get("/users/current", auth, GET_CURRENT_USER);

export default router;
